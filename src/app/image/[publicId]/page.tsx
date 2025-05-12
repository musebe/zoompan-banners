// src/app/image/[publicId]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  createOptimisedURL,
  createZoompanGifURL,
  createGenerativeFillURL,
} from '@/lib/cloudinary-client-utils';

export const revalidate = 60; // ISR – refresh after 1 min

type Props = { params: { publicId: string } };

export default async function ImageDetail({ params }: Props) {
  /** 👉  Await the params object once (required by App Router) */
  const { publicId } = await Promise.resolve(params);

  const pid = decodeURIComponent(publicId ?? '');
  if (!pid) notFound();

  const original = createOptimisedURL(pid);
  const transformed =
    createZoompanGifURL(pid) ?? // zoompan first
    createGenerativeFillURL(pid, 1600, 900);

  return (
    <main className='container mx-auto max-w-5xl px-4 py-12 space-y-8'>
      <h1 className='text-3xl font-bold'>Transformed Banner</h1>

      <div className='grid gap-8 sm:grid-cols-2'>
        {/* ─── Original ───────────────────────────────────────────── */}
        <figure className='space-y-3'>
          <Image
            src={original}
            alt='Original banner'
            width={1600}
            height={900}
            unoptimized
            className='w-full rounded-lg shadow'
            priority
          />
          <a
            href={original}
            download
            className='inline-block rounded bg-secondary px-4 py-2 text-sm font-medium hover:opacity-90'
          >
            Download original
          </a>
        </figure>

        {/* ─── Transformed ────────────────────────────────────────── */}
        <figure className='space-y-3'>
          <Image
            src={transformed}
            alt='Transformed banner'
            width={1600}
            height={900}
            unoptimized
            className='w-full rounded-lg shadow'
            priority
          />
          <a
            href={transformed}
            download
            className='inline-block rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90'
          >
            Download transformed
          </a>
        </figure>
      </div>

      <Link
        href='/'
        className='text-primary underline-offset-2 hover:underline'
      >
        ← Back to gallery
      </Link>
    </main>
  );
}
