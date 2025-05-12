'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Banner from '@/components/Banner';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 6;

export default function UploadGallery({
  zoompan,
  generativeFill,
  aspect = '16/9',
}: {
  zoompan: boolean;
  generativeFill: boolean;
  aspect?: string;
}) {
  const [uploads, setUploads] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadPage = async (nextOffset: number) => {
    setLoading(true);
    const res = await fetch(
      `/api/uploads?limit=${PAGE_SIZE}&offset=${nextOffset}`
    );
    const { uploads: items } = (await res.json()) as { uploads: string[] };
    console.debug(
      '[UploadGallery] fetched items:',
      items,
      'offset:',
      nextOffset
    );

    if (items.length < PAGE_SIZE) setHasMore(false);
    setUploads((prev) => [...prev, ...items]);
    setOffset(nextOffset + items.length);
    setLoading(false);
  };

  useEffect(() => {
    loadPage(0);
  }, []);

  return (
    <section className='container mx-auto px-4 sm:px-6 lg:px-8 mt-12'>
      <h2 className='text-2xl font-bold mb-4'>Recent Uploads</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <AnimatePresence>
          {uploads.map((pid, idx) => (
            <motion.div
              key={`${pid}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className='rounded-lg overflow-hidden shadow'
            >
              <Banner
                id={pid}
                zoompan={zoompan}
                generativeFill={generativeFill}
                aspect={aspect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {hasMore && (
        <div className='text-center mt-6'>
          <Button onClick={() => loadPage(offset)} disabled={loading}>
            {loading ? 'Loading…' : 'View More'}
          </Button>
        </div>
      )}
    </section>
  );
}
