import { createGenerativeFillURL, createZoompanGifURL } from '@/lib/cloudinary';
import redis from '@/lib/redis';
import SmokeBanner from '@/components/SmokeBanner';

export default async function Home() {
  // Redis sanity check (server-side)
  const timestamp = Date.now().toString();
  await redis.set('health:last', timestamp, { EX: 60 });
  const redisValue = (await redis.get('health:last')) ?? 'n/a';

  // Cloudinary demo assets
  const staticUrl = createGenerativeFillURL('hero', 1600, 900);
  const zoomUrl = createZoompanGifURL('hero', { duration: 8, fps: 2 });

  return (
    <SmokeBanner
      staticUrl={staticUrl}
      zoomUrl={zoomUrl}
      redisValue={redisValue}
    />
  );
}
