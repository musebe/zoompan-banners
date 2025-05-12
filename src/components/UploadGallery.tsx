'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

import {
  createOptimisedURL,
  createZoompanGifURL,
  createGenerativeFillURL,
} from '@/lib/cloudinary-client-utils';

const PAGE_SIZE = 3;

type Props = {
  zoompan: boolean;
  generativeFill: boolean;
  aspect?: string;
};

export default function UploadGallery({
  zoompan,
  generativeFill,
  aspect = '16/9',
}: Props) {
  const [uploads, setUploads] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ----------------------------------------------------------- */
  /*  Fetch helpers                                              */
  /* ----------------------------------------------------------- */

  const loadPage = async (nextOffset: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/uploads?limit=${PAGE_SIZE}&offset=${nextOffset}`
      );
      if (!res.ok) throw new Error(await res.text());

      const { uploads: items } = (await res.json()) as { uploads: string[] };

      /* 🆕 keep only records not yet shown */
      setUploads((prev) => [
        ...prev,
        ...items.filter((id) => !prev.includes(id)),
      ]);

      /* bump offset by PAGE_SIZE so each request is a clean slice */
      setOffset(nextOffset + PAGE_SIZE);

      /* stop if server returned < PAGE_SIZE */
      if (items.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error('[UploadGallery] fetch failed:', err);
      setError('Could not load uploads – please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* first load */
  useEffect(() => {
    loadPage(0);
  }, []);

  /* ----------------------------------------------------------- */
  /*  UI                                                         */
  /* ----------------------------------------------------------- */

  return (
    <section className='container mx-auto mt-12 px-4 sm:px-6 lg:px-8'>
      <h2 className='mb-4 text-2xl font-bold'>Recent Uploads</h2>

      {!loading && uploads.length === 0 && (
        <p className='text-muted-foreground'>
          No uploads yet – be the first! 📷
        </p>
      )}

      {error && <p className='mb-4 text-sm text-destructive'>{error}</p>}

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <AnimatePresence initial={false}>
          {uploads.map((pid, idx) => {
            const thumbUrl = zoompan
              ? createZoompanGifURL(pid)
              : generativeFill
              ? createGenerativeFillURL(pid, 800, 450)
              : createOptimisedURL(pid);

            return (
              <motion.div
                key={`${pid}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className='relative overflow-hidden rounded-lg bg-card shadow'
                style={{ aspectRatio: aspect }}
              >
                <Link
                  href={`/image/${encodeURIComponent(pid)}`}
                  className='absolute inset-0'
                >
                  <Image
                    src={thumbUrl}
                    alt='Transformed thumbnail'
                    fill
                    unoptimized
                    sizes='(max-width:768px) 100vw, 33vw'
                    className='object-cover'
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
