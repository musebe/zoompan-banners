import { cldClient } from './cloudinary-client';
import { pad } from '@cloudinary/url-gen/actions/resize';
import { generativeFill } from '@cloudinary/url-gen/qualifiers/background';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';

const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? '';

/**
 * Ensure we don’t double-prefix the folder if it’s already present.
 */
function toId(file: string): string {
    if (!folder) return file;
    return file.startsWith(`${folder}/`) ? file : `${folder}/${file}`;
}

/** q_auto + f_auto */
export function createOptimisedURL(file: string): string {
    return cldClient
        .image(toId(file))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL();
}

/** Generative Fill */
export function createGenerativeFillURL(
    file: string,
    w: number,
    h: number
): string {
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

    // keep the animation – don’t let f_auto convert it to a static WebP/JPEG
    parts.push('fl_animated', 'q_auto');

    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }/image/upload/${parts.join('/')}/${encodeURIComponent(toId(file))}.gif`;
}