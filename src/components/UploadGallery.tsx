'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  createOptimisedURL,
  createZoompanGifURL,
  createGenerativeFillURL,
} from '@/lib/cloudinary-client-utils';

const PAGE_SIZE = 6;

type UploadGalleryProps = {
  zoompan: boolean;
  generativeFill: boolean;
  aspect?: string;
};

export default function UploadGallery({
  zoompan,
  generativeFill,
  aspect = '16/9',
}: UploadGalleryProps) {
  const [uploads, setUploads] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ––––– Fetch helpers ––––– */
  const loadPage = async (nextOffset: number) => {
    setLoading(true);
    const res = await fetch(
      `/api/uploads?limit=${PAGE_SIZE}&offset=${nextOffset}`
    );
    const { uploads: items } = (await res.json()) as { uploads: string[] };
    setUploads((prev) => [...prev, ...items]);
    setOffset(nextOffset + items.length);
    if (items.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
  };

  /* initial */
  useEffect(() => {
    loadPage(0);
  }, []);

  /* ––––– Render ––––– */
  return (
    <section className='container mx-auto mt-12 px-4 sm:px-6 lg:px-8'>
      <h2 className='mb-4 text-2xl font-bold'>Recent Uploads</h2>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <AnimatePresence initial={false}>
          {uploads.map((pid) => {
            /* choose right-hand (animated or gen-fill) as thumbnail */
            const thumbUrl = zoompan
              ? createZoompanGifURL(pid)
              : generativeFill
              ? createGenerativeFillURL(pid, 800, 450)
              : createOptimisedURL(pid);

            return (
              <motion.div
                key={pid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className='relative overflow-hidden rounded-lg bg-card shadow'
                style={{ aspectRatio: aspect }}
              >
                {/* card links to the detail page */}
                <Link
                  href={`/image/${encodeURIComponent(pid)}`}
                  className='absolute inset-0'
                >
                  <Image
                    src={thumbUrl}
                    alt='Transformed thumbnail'
                    fill
                    unoptimized /* Cloudinary already optimises */
                    className='object-cover'
                    sizes='(max-width:768px) 100vw, 33vw'
                    priority={false}
                  />
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className='mt-6 text-center'>
          <button
            onClick={() => loadPage(offset)}
            disabled={loading}
            className='rounded bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-50'
          >
            {loading ? 'Loading…' : 'View More'}
          </button>
        </div>
      )}
    </section>
  );
}
