// src/lib/redis.ts
import { createClient } from "redis";

declare global {
    // eslint-disable-next-line no-var
    var __redis: ReturnType<typeof createClient> | undefined;
}

const url = process.env.REDIS_URL;
if (!url) throw new Error("❌ REDIS_URL env var missing");

const redis =
    global.__redis ??
    createClient({
        url,                              // redis://…:18928  (plain TCP)
        socket: {
            connectTimeout: 5_000,
            reconnectStrategy: (tries: number) => Math.min(50 * 2 ** tries, 2_000),
        },
    });

redis.on("error", (e: Error) =>
    console.error("🔴 Redis client error:", e.message)
);

if (!global.__redis) {
    redis.connect().catch((e: Error) =>
        console.error("🔴 Redis initial connect failed:", e.message)
    );
    global.__redis = redis;
}

export default redis;
