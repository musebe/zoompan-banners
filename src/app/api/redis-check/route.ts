import redis from "@/lib/redis";

// 👇 Optional but explicit — forces Node runtime even if you later switch default
export const runtime = "nodejs";

export async function GET() {
    try {
        await redis.set("foo", "bar", { EX: 30 });
        const value = await redis.get("foo");
        return Response.json({ ok: true, value });
    } catch (err) {
        return Response.json(
            { ok: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}
