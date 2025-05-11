import redis from "@/lib/redis";

const SESSION_TTL = 60 * 60 * 24 * 7; // 1 week

export async function getSession<T = unknown>(sid: string) {
    const raw = await redis.get(`sess:${sid}`);
    return raw ? (JSON.parse(raw) as T) : null;
}

export async function setSession<T>(sid: string, data: T) {
    await redis.set(`sess:${sid}`, JSON.stringify(data), { EX: SESSION_TTL });
}

/* --------------------------------------------------------- */
/*  Feature flags (simple JSON map per user/tenant)          */
/* --------------------------------------------------------- */
export async function getFlags(uid: string) {
    const raw = await redis.get(`flags:${uid}`);
    return raw ? JSON.parse(raw) : {};
}

export async function setFlags(uid: string, flags: Record<string, boolean>) {
    await redis.set(`flags:${uid}`, JSON.stringify(flags));
}
