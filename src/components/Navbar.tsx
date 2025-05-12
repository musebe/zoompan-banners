'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

// load the uploader only when someone clicks “Upload”
const ImageUploader = dynamic(() => import('@/components/ImageUploader'), {
  ssr: false,
  loading: () => <Button disabled>Upload</Button>,
});

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className='sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur'
    >
      <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6'>
        {/* Logo */}
        <Link
          href='/'
          className='font-semibold text-lg tracking-tight hover:opacity-80'
        >
          Zoompan&nbsp;Demo
        </Link>

        {/* Right-hand actions */}
        <nav className='flex items-center gap-3 text-sm'>
          <Link
            href='/about'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            About
          </Link>

          <ImageUploader />

          <Button
            asChild
            size='icon'
            variant='ghost'
            className='text-muted-foreground'
            aria-label='GitHub repo'
          >
            <a
              href='https://github.com/your/repo'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Github className='h-5 w-5' />
            </a>
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}
