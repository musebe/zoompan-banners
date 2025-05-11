/**
 * Server-side Cloudinary instance
 * ───────────────────────────────
 * • Includes API key/secret for uploads, Admin API, or signed URLs.
 * • ONLY import this in server-side code: route handlers, server actions, etc.
 */

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export { cloudinary as cldAdmin };
