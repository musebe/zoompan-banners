// src/lib/cloudinary-server-utils.ts
import { v2 as cloudinary } from 'cloudinary';
import { cacheString } from './cloudinary-cache';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true,
});

const toId = (file: string) =>
    process.env.CLOUDINARY_FOLDER
        ? `${process.env.CLOUDINARY_FOLDER}/${file}`
        : file;

export async function getCachedOptimisedURL(file: string): Promise<string> {
    const pid = toId(file);
    return cacheString(`cld:opt:${pid}`, async () =>
        cloudinary.url(pid, { transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }] })
    );
}

// similarly for getCachedGenerativeFillURL, getCachedZoompanGifURL, etc.
