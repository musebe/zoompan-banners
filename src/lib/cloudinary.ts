/**
 * High-level Cloudinary URL helpers  (client-side only)
 * ─────────────────────────────────────────────────────
 * Relies on `cldClient` from cloudinary-client.ts so no secrets leak.
 * All helpers return a ready-to-use URL string.
 */

import { cldClient } from "@/lib/cloudinary-client";

import { pad } from "@cloudinary/url-gen/actions/resize";
import { generativeFill } from "@cloudinary/url-gen/qualifiers/background";
import { quality, format } from "@cloudinary/url-gen/actions/delivery";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "";

/** Turn “hero” → “marketing-banners/hero” if a folder is set */
const toPublicId = (file: string) => (folder ? `${folder}/${file}` : file);

/** Build a raw-transformation URL for effects missing typed builders */
function buildRawUrl(
    publicId: string,
    rawTransform: string,
    ext: string
) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${rawTransform}/${encodeURIComponent(
        publicId
    )}.${ext}`;
}

/* ------------------------------------------------------------------ */
/*  1. q_auto + f_auto                                                */
/* ------------------------------------------------------------------ */
export const createOptimisedURL = (file: string) =>
    cldClient
        .image(toPublicId(file))
        .delivery(quality("auto"))
        .delivery(format("auto"))
        .toURL();

/* ------------------------------------------------------------------ */
/*  2. Generative Fill (AI out-paint)                                 */
/* ------------------------------------------------------------------ */
export const createGenerativeFillURL = (
    file: string,
    w: number,
    h: number
) =>
    cldClient
        .image(toPublicId(file))
        .resize(
            pad()
                .width(w)
                .height(h)
                .background(generativeFill())
        )
        .delivery(quality("auto"))
        .delivery(format("auto"))
        .toURL();

/* ------------------------------------------------------------------ */
/*  3. Zoompan (Ken Burns) GIF                                         */
/* ------------------------------------------------------------------ */
export const createZoompanGifURL = (
    file: string,
    opts: { duration?: number; loop?: boolean; fps?: number } = {}
) => {
    const { duration = 6, loop = true, fps } = opts;

    const parts = [`e_zoompan,d_${duration}`];
    if (fps) parts.push(`fps_${fps}`);
    if (loop) parts.push("e_loop");

    // always deliver optimised
    parts.push("q_auto", "f_auto");

    return buildRawUrl(toPublicId(file), parts.join("/"), "gif");
};

/* ------------------------------------------------------------------ */
/*  4. Background removal helper                                       */
/* ------------------------------------------------------------------ */
export const createBgRemovalURL = (
    file: string,
    w: number,
    h: number,
    bgColour?: string
) => {
    const parts = [
        "e_background_removal",
        `w_${w},h_${h}`,
        ...(bgColour ? [`b_rgb:${bgColour.replace("#", "")}`] : []),
        "q_auto",
        "f_auto",
    ];

    return buildRawUrl(toPublicId(file), parts.join("/"), "png");
};
