'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    title: 'Cinematic Zoompan Motion',
    description:
      'Bring static visuals to life with Cloudinary’s Ken-Burns-style e_zoompan transformation rendered as optimized GIFs.',
  },
  {
    title: 'AI Generative Fill',
    description:
      'Expand image boundaries intelligently using Cloudinary’s generativeFill background for beautiful banner crops on all screen sizes.',
  },
  {
    title: 'Responsive Banner Builder',
    description:
      'Preview and generate marketing assets in real-time with motion effects, generative fill, and optimizations.',
  },
  {
    title: 'Auto Format & Delivery',
    description:
      'Every asset is served with f_auto and q_auto for high visual fidelity and blazing-fast performance.',
  },
];

export default function AboutPage() {
  return (
    <main className='container mx-auto px-6 py-16 space-y-16'>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center space-y-6'
      >
        <h1 className='text-4xl font-bold tracking-tight'>
          Zoompan + Generative Fill Demo
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
          An AI-enhanced marketing tool powered by Cloudinary, built with the
          latest Next.js 15 features. Create dynamic banners from static images
          — with cinematic motion, intelligent cropping, and blazing fast
          delivery.
        </p>
        <div className='mx-auto w-full max-w-xl overflow-hidden rounded-xl shadow-lg ring-1 ring-border/20'>
          <Image
            src='/preview.png'
            alt='Dynamic Banner Demo Preview'
            width={1200}
            height={600}
            priority
            className='object-cover'
          />
        </div>
      </motion.section>

      {/* Features */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {FEATURES.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className='h-full hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle>{feat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feat.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Tech Stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className='space-y-4'
      >
        <h2 className='text-2xl font-semibold tracking-tight'>Built With</h2>
        <div className='flex flex-wrap gap-3'>
          <Badge variant='outline'>Next.js 15</Badge>
          <Badge variant='outline'>React 19</Badge>
          <Badge variant='outline'>Tailwind CSS 4</Badge>
          <Badge variant='outline'>shadcn/ui</Badge>
          <Badge variant='outline'>Motion.dev</Badge>
          <Badge variant='outline'>Cloudinary</Badge>
          <Badge variant='outline'>Redis Cloud</Badge>
        </div>
      </motion.section>
    </main>
  );
}
