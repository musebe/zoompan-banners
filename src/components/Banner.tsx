'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

import {
  createOptimisedURL,
  createGenerativeFillURL,
  createZoompanGifURL,
} from '@/lib/cloudinary';
import { zoomInOut } from '@/lib/motionPresets';

export type BannerProps = {
  /** Public ID without folder prefix, e.g. "hero" */
  id: string;
  /** Enable Ken-Burns zoompan (GIF), default false */
  zoompan?: boolean;
  /** AI out-paint if wider/taller than source */
  generativeFill?: boolean;
  /** Width × height for the static banner (Generative Fill) */
  size?: { w: number; h: number };
  /** CSS aspect ratio if you want a fixed box */
  aspect?: string;
  /** Alt text for accessibility */
  alt?: string;
};

export default function Banner({
  id,
  zoompan = false,
  generativeFill = false,
  size = { w: 1600, h: 900 },
  aspect,
  alt = 'Marketing banner',
}: BannerProps) {
  // Build URLs once per render
  const { srcStatic, srcGif } = useMemo(() => {
    const srcStatic = generativeFill
      ? createGenerativeFillURL(id, size.w, size.h)
      : createOptimisedURL(id);

    const srcGif = zoompan ? createZoompanGifURL(id) : undefined;
    return { srcStatic, srcGif };
  }, [id, generativeFill, zoompan, size]);

  // If zoompan on, use <motion.img> with GIF
  if (zoompan && srcGif) {
    return (
      <motion.img
        variants={zoomInOut}
        initial='rest'
        animate='zoom'
        src={srcGif}
        alt={alt}
        className='w-full rounded-2xl shadow-lg object-cover'
        style={aspect ? { aspectRatio: aspect } : undefined}
      />
    );
  }

  // Otherwise use next/image with optional Generative Fill
  return (
    <Image
      src={srcStatic}
      alt={alt}
      unoptimized // Cloudinary already handles f_auto / q_auto
      width={size.w}
      height={size.h}
      className='w-full rounded-2xl shadow-lg object-cover'
      style={aspect ? { aspectRatio: aspect } : undefined}
      priority
    />
  );
}
