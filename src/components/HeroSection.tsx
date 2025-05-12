'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='bg-background py-16 sm:py-24'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
        {/* Logo */}
        <div className='mx-auto w-32 sm:w-40'>
          <Image
            src='/cloudinary-logo.svg'
            alt='Cloudinary'
            width={200}
            height={50}
            className='object-contain'
            priority
          />
        </div>

        {/* Headline */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight'>
          Transform Static Visuals into
          <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
            Dynamic Banners
          </span>
          <br className='hidden sm:block' />
          Using Zoompan &amp; Generative Fill
        </h1>

        {/* Subheading */}
        <p className='max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg'>
          Elevate your marketing with AI-powered out-painting and cinematic
          motion—built with Next.js 14, Cloudinary, and Motion for React.
        </p>
      </div>
    </motion.section>
  );
}
