'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { zoomInOut, slideUp } from '@/lib/motionPresets';

type Props = {
  staticUrl: string;
  zoomUrl: string;
  redisValue: string;
};

export default function SmokeBanner({ staticUrl, zoomUrl, redisValue }: Props) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-10 p-8'>
      {/* Ken-Burns (Zoompan) GIF */}
      <motion.img
        variants={zoomInOut}
        initial='rest'
        animate='zoom'
        src={zoomUrl}
        alt='Zoompan demo'
        className='w-full max-w-3xl rounded-2xl shadow-lg'
      />

      {/* Generative-Fill banner (resize the window to see responsive crop) */}
      <Image
        src={staticUrl}
        alt='Generative fill demo'
        width={1600}
        height={900}
        unoptimized // Cloudinary already delivers optimised images
        className='w-full max-w-3xl rounded-2xl shadow-lg'
      />

      {/* Redis value + action */}
      <motion.div
        variants={slideUp}
        initial='hidden'
        animate='show'
        className='text-center'
      >
        <p className='mb-4'>
          Redis round-trip value:{' '}
          <span className='font-mono text-green-600'>{redisValue}</span>
        </p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </motion.div>
    </main>
  );
}
