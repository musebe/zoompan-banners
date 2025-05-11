import redis from "@/lib/redis";
import { createOptimisedURL } from "@/lib/cloudinary";

export async function GET() {
    const t = Date.now().toString();
    await redis.set("health:last", t, { EX: 60 });
    const value = await redis.get("health:last");

    return Response.json({
        ok: true,
        redis: value,
        cld: createOptimisedURL("pixel"), // tiny placeholder
    });
}
