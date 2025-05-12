// src/components/Banner.tsx
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
    const s = generativeFill
      ? createGenerativeFillURL(id, size.w, size.h)
      : createOptimisedURL(id);
    const g = zoompan ? createZoompanGifURL(id) : undefined;
    console.debug('[Banner] id=', id, { staticUrl: s, zoompan, gifUrl: g });
    return { staticUrl: s, gifUrl: g };
  }, [id, generativeFill, zoompan, size]);

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
