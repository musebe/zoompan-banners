// src/lib/cloudinary-client-utils.ts
import { cldClient } from './cloudinary-client';
import { pad } from '@cloudinary/url-gen/actions/resize';
import { generativeFill } from '@cloudinary/url-gen/qualifiers/background';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';

const toId = (file: string) =>
    process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER
        ? `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${file}`
        : file;

/** q_auto + f_auto */
export function createOptimisedURL(file: string): string {
    return cldClient.image(toId(file)).delivery(quality('auto')).delivery(format('auto')).toURL();
}

/** Generative Fill */
export function createGenerativeFillURL(file: string, w: number, h: number): string {
    return cldClient
        .image(toId(file))
        .resize(pad().width(w).height(h).background(generativeFill()))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL();
}

/** Zoompan GIF */
export function createZoompanGifURL(
    file: string,
    opts: { duration?: number; loop?: boolean; fps?: number } = {}
): string {
    const { duration = 6, loop = true, fps } = opts;
    const parts = [`e_zoompan,d_${duration}`];
    if (fps) parts.push(`fps_${fps}`);
    if (loop) parts.push('e_loop');
    parts.push('q_auto', 'f_auto');
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${parts.join(
        '/'
    )}/${encodeURIComponent(toId(file))}.gif`;
}
