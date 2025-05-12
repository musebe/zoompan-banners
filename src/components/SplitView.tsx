// src/components/SplitView.tsx
'use client';

import { useMemo } from 'react';
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from '@/components/ui/image-comparison';
import {
  createOptimisedURL,
  createGenerativeFillURL,
  createZoompanGifURL,
} from '@/lib/cloudinary-client-utils';

type SplitViewProps = {
  publicId: string;
  zoompan: boolean;
  generativeFill: boolean;
  aspect?: string;
};

export default function SplitView({
  publicId,
  zoompan,
  generativeFill,
  aspect = '16/9',
}: SplitViewProps) {
  const staticUrl = useMemo(() => createOptimisedURL(publicId), [publicId]);

  const dynamicUrl = useMemo(() => {
    if (zoompan) return createZoompanGifURL(publicId);
    if (generativeFill) return createGenerativeFillURL(publicId, 1600, 900);
    return staticUrl;
  }, [publicId, zoompan, generativeFill, staticUrl]);

  return (
    <div className='mx-auto my-12 max-w-3xl' style={{ aspectRatio: aspect }}>
      <ImageComparison
        aspectRatio={aspect}
        className='relative w-full h-full rounded-lg border border-zinc-200 dark:border-zinc-800'
      >
        <ImageComparisonImage src={staticUrl} alt='Original' position='left' />
        <ImageComparisonImage
          src={dynamicUrl}
          alt='Transformed'
          position='right'
        />
        <ImageComparisonSlider className='bg-white/50'>
          <div className='h-full w-px bg-border' />
          <div className='absolute left-1/2 top-1/2 h-6 w-4 -translate-x-1/2 -translate-y-1/2 rounded bg-white dark:bg-zinc-800' />
        </ImageComparisonSlider>
      </ImageComparison>
    </div>
  );
}
