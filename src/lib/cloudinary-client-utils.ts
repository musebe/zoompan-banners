// lib/cloudinary-client-utils.ts

import { cldClient } from './cloudinary-client';
import { pad } from '@cloudinary/url-gen/actions/resize';
import { generativeFill } from '@cloudinary/url-gen/qualifiers/background';
import { quality, format } from '@cloudinary/url-gen/actions/delivery';

const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? '';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function toId(file: string): string {
    if (!folder) return file;
    return file.startsWith(`${folder}/`) ? file : `${folder}/${file}`;
}

/* -------------------------------------------------------------------------- */
/*  Straight-up optimisation                                                  */
/* -------------------------------------------------------------------------- */

export function createOptimisedURL(file: string): string {
    return cldClient
        .image(toId(file))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL();
}

/* -------------------------------------------------------------------------- */
/*  AI generative fill                                                        */
/* -------------------------------------------------------------------------- */

export function createGenerativeFillURL(
    file: string,
    w: number,
    h: number,
): string {
    return cldClient
        .image(toId(file))
        .resize(pad().width(w).height(h).background(generativeFill()))
        .delivery(quality('auto'))
        .delivery(format('auto'))
        .toURL();
}

/* -------------------------------------------------------------------------- */
/*  Ken-Burns / zoom-pan helper                                               */
/* -------------------------------------------------------------------------- */
/**
 * NOTE: the function name stays the same for backwards compatibility,
 * but you can now ask for `webm` or `mp4` via the `format` option.
 */
export function createZoompanGifURL(
    file: string,
    opts: {
        duration?: number;               // seconds (default 6)
        loop?: boolean;                  // default true
        fps?: number;                    // default 15
        maxZoom?: number;                // default 1.05 (never zoom out)
        format?: 'gif' | 'webm' | 'mp4'; // default 'gif'
    } = {},
): string {
    const {
        duration = 6,
        loop = true,
        fps = 15,
        maxZoom = 1.05,
        format: outFmt = 'gif',
    } = opts;

    /* —— build zoompan parameter string (colon + semicolons) ———————— */
    const zpParams = [
        `du_${duration}`,
        `maxzoom_${maxZoom}`,
        `fps_${fps}`,
    ].join(';');                       // ← semicolons, not commas!

    /* —— all other transformations ————————————— */
    const parts: string[] = [
        `e_zoompan:${zpParams}`,         // ✔️ proper syntax
        loop ? 'e_loop' : null,          // loop flag as separate step
        'e_sharpen',
        'fl_animated',
        'q_auto',
    ].filter((p): p is string => Boolean(p));

    /* —— final Cloudinary URL ———————————————— */
    const extension = `.${outFmt}`;
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }/image/upload/${parts.join('/')}/${encodeURIComponent(
            toId(file),
        )}${extension}`;
}
