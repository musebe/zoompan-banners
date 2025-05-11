import redis from "@/lib/redis";

(async () => {
    await redis.set("foo", "bar", { EX: 30 });
    console.log("GET foo →", await redis.get("foo"));
    await redis.disconnect();
})();
