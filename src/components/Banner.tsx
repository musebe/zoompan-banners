'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

import {
  createOptimisedURL,
  createGenerativeFillURL,
  createZoompanGifURL,
} from '@/lib/cloudinary-client-utils';

import { zoomInOut } from '@/lib/motionPresets';

/** Simple skeleton placeholder */
function BannerSkeleton({ aspect }: { aspect: string }) {
  return (
    <div
      className='w-full animate-pulse bg-muted rounded-lg'
      style={{ aspectRatio: aspect }}
    />
  );
}

export type BannerProps = {
  id: string;
  zoompan?: boolean;
  generativeFill?: boolean;
  size?: { w: number; h: number };
  aspect?: string;
  alt?: string;
};

export default function Banner({
  id,
  zoompan = false,
  generativeFill = false,
  size = { w: 1600, h: 900 },
  aspect = '16/9',
  alt = 'Banner image',
}: BannerProps) {
  const { staticUrl, gifUrl } = useMemo(() => {
    const pid = id;
    const sUrl = generativeFill
      ? createGenerativeFillURL(pid, size.w, size.h)
      : createOptimisedURL(pid);
    const gUrl = zoompan ? createZoompanGifURL(pid) : undefined;
    return { staticUrl: sUrl, gifUrl: gUrl };
  }, [id, generativeFill, zoompan, size]);

  // Show skeleton only if something went wrong (rare since sync)
  if (!staticUrl || (zoompan && !gifUrl)) {
    return <BannerSkeleton aspect={aspect} />;
  }

  if (zoompan && gifUrl) {
    return (
      <motion.img
        src={gifUrl}
        alt={alt}
        variants={zoomInOut}
        initial='rest'
        animate='zoom'
        className='w-full rounded-lg object-cover shadow-lg'
        style={{ aspectRatio: aspect }}
      />
    );
  }

  return (
    <Image
      src={staticUrl}
      alt={alt}
      unoptimized
      fill
      sizes='(max-width: 640px) 100vw, 800px'
      className='object-cover rounded-lg shadow-lg'
      style={{ aspectRatio: aspect }}
    />
  );
}
