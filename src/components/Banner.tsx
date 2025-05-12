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
  /** Cloudinary public ID (without folder) */
  id: string;
  /** Ken-Burns GIF effect? */
  zoompan?: boolean;
  /** AI out-paint for responsive crops? */
  generativeFill?: boolean;
  /** Static fallback dimensions */
  size?: { w: number; h: number };
  /** CSS aspect (e.g. "16/9") */
  aspect?: string;
  /** Alt text */
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
  // Generate URLs once
  const { srcStatic, srcGif } = useMemo(() => {
    const srcStatic = generativeFill
      ? createGenerativeFillURL(id, size.w, size.h)
      : createOptimisedURL(id);

    const srcGif = zoompan ? createZoompanGifURL(id) : undefined;
    return { srcStatic, srcGif };
  }, [id, generativeFill, zoompan, size]);

  // Common classes
  const wrapperClasses =
    'relative w-full overflow-hidden rounded-lg shadow-lg bg-card';

  const contentClasses = 'absolute inset-0 flex items-center justify-center';

  // If zoompan, render animated GIF
  if (zoompan && srcGif) {
    return (
      <motion.div className={wrapperClasses} style={{ aspectRatio: aspect }}>
        <motion.img
          src={srcGif}
          alt={alt}
          variants={zoomInOut}
          initial='rest'
          animate='zoom'
          className='h-full w-full object-cover'
        />
        {/* Optional caption overlay */}
        <div className={`${contentClasses} pointer-events-none`}>
          <motion.span
            className='bg-gradient-to-b from-transparent to-background/80 text-foreground px-4 py-2 rounded-md text-xl font-semibold'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {alt}
          </motion.span>
        </div>
      </motion.div>
    );
  }

  // Static fallback
  return (
    <div className={wrapperClasses} style={{ aspectRatio: aspect }}>
      <Image
        src={srcStatic}
        alt={alt}
        unoptimized
        fill
        sizes='(max-width: 768px) 100vw, 800px'
        className='object-cover'
      />
      <div className={contentClasses}>
        <span className='bg-gradient-to-b from-transparent to-background/80 text-foreground px-4 py-2 rounded-md text-xl font-semibold'>
          {alt}
        </span>
      </div>
    </div>
  );
}
