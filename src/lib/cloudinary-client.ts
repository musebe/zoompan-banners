/**
 * Browser-safe Cloudinary instance
 * ─────────────────────────────────
 * • Uses only the public cloud name so it can be imported in React components.
 * • Secure URLs (`https`) are enabled by default.
 */

import { Cloudinary } from "@cloudinary/url-gen";

export const cldClient = new Cloudinary({
    cloud: { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME! },
    url: { secure: true },
});
