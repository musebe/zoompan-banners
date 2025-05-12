//cloudinary-cache.ts

import redis from "@/lib/redis";
import crypto from "crypto";

const TTL = 60 * 60; // 1 h

/** Cache wrapper for any async fn that returns a string */
export async function cacheString(
    key: string,
    fn: () => Promise<string>
): Promise<string> {
    const cached = await redis.get(key);
    if (cached) return cached;

    const value = await fn();
    await redis.set(key, value, { EX: TTL });
    return value;
}

/* ——— example: signed upload ——— */

import { cldAdmin } from "@/lib/cloudinary-server";
// Params can be any JSON-serialisable values
export async function getUploadSignature(
    params: Record<string, string | number | boolean>
) {
    const raw = JSON.stringify(params);
    const key = `cld:sig:${crypto.createHash("md5").update(raw).digest("hex")}`;

    return cacheString(key, async () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = cldAdmin.utils.api_sign_request(
            { ...params, timestamp },
            process.env.CLOUDINARY_API_SECRET!
        );
        return JSON.stringify({ signature, timestamp });
    });
}
