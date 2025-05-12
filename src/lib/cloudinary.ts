// src/lib/cloudinary.ts

import { cldClient } from './cloudinary-client';
import { pad } from '@cloudinary/url-gen/actions/resize';
import { generativeFill } from '@cloudinary/url-gen/qualifiers/background';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';
import { cacheString } from './cloudinary-cache';

/** 
 * Build a raw‐transformation URL string for unsupported actions
 * @param publicId Cloudinary public ID (including folder)
 * @param rawTransform transformation string (e.g. 'e_zoompan,d_6')
 * @param ext file extension ('gif', 'png', etc.)
 */
function buildRawUrl(publicId: string, rawTransform: string, ext: string) {
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${rawTransform}/${encodeURIComponent(
        publicId
    )}.${ext}`;
}

/** Normalize folder + filename */
const toPublicId = (file: string) =>
    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER
        ? `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${file}`
        : file;

/**
 * 1. Universal optimiser (q_auto + f_auto)
 * Cached by file name
 */
export async function getOptimisedURL(file: string): Promise<string> {
    const pid = toPublicId(file);
    const key = `cld:opt:${pid}`;
    return cacheString(key, async () =>
        cldClient
            .image(pid)
            .delivery(quality('auto'))
            .delivery(format('auto'))
            .toURL()
    );
}

/**
 * 2. Generative Fill (AI out-paint)
 * Cached by file + dimensions
 */
export async function getGenFillURL(
    file: string,
    w: number,
    h: number
): Promise<string> {
    const pid = toPublicId(file);
    const key = `cld:genfill:${pid}:${w}x${h}`;
    return cacheString(key, async () =>
        cldClient
            .image(pid)
            .resize(
                pad()
                    .width(w)
                    .height(h)
                    .background(generativeFill())
            )
            .delivery(quality('auto'))
            .delivery(format('auto'))
            .toURL()
    );
}

/**
 * 3. Zoompan GIF (Ken Burns)
 * Cached by file + options
 */
export async function getZoompanGifURL(
    file: string,
    opts: { duration?: number; loop?: boolean; fps?: number } = {}
): Promise<string> {
    const pid = toPublicId(file);
    const { duration = 6, loop = true, fps } = opts;
    // Build a consistent cache key
    const key = `cld:zoompan:${pid}:d${duration}:l${loop}:f${fps ?? 'auto'}`;
    return cacheString(key, async () => {
        const parts = [`e_zoompan,d_${duration}`];
        if (fps) parts.push(`fps_${fps}`);
        if (loop) parts.push('e_loop');
        parts.push('q_auto', 'f_auto');
        return buildRawUrl(pid, parts.join('/'), 'gif');
    });
}

/**
 * 4. Background removal helper
 * Cached by file + dimensions + colour
 */
export async function getBgRemovalURL(
    file: string,
    w: number,
    h: number,
    bgColour?: string
): Promise<string> {
    const pid = toPublicId(file);
    const colorKey = bgColour ? bgColour.replace('#', '') : 'none';
    const key = `cld:bgrem:${pid}:${w}x${h}:b${colorKey}`;
    return cacheString(key, async () => {
        const parts = [
            'e_background_removal',
            `w_${w},h_${h}`,
            ...(bgColour ? [`b_rgb:${colorKey}`] : []),
            'q_auto',
            'f_auto',
        ];
        return buildRawUrl(pid, parts.join('/'), 'png');
    });
}
