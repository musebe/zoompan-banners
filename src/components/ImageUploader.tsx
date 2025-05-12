// src/components/ImageUploader.tsx
'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent as CardInner,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export interface ImageUploaderProps {
  onUploadSuccess?: (publicId: string) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isValid = Boolean(file);

  const upload = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // 1) fetch signature
      console.debug('[Uploader] Fetching upload signature...');
      const sigRes = await fetch('/api/upload-signature');
      const sigText = await sigRes.text();
      console.debug('[Uploader] Signature response:', sigRes.status, sigText);

      if (!sigRes.ok) {
        throw new Error(
          `Signature fetch failed (${sigRes.status}): ${sigText}`
        );
      }

      const { signature, timestamp, ...uploadParams } = JSON.parse(sigText) as {
        signature: string;
        timestamp: number;
        folder: string;
        use_filename: boolean;
        unique_filename: boolean;
        overwrite: boolean;
      };

      // 2) build and POST FormData to Cloudinary
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      form.append('timestamp', String(timestamp));
      form.append('signature', signature);
      Object.entries(uploadParams).forEach(([key, val]) => {
        form.append(key, String(val));
      });

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      console.debug('[Uploader] Uploading to Cloudinary:', uploadUrl);
      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: form });
      const uploadText = await uploadRes.text();
      console.debug(
        '[Uploader] Cloudinary response:',
        uploadRes.status,
        uploadText
      );

      if (!uploadRes.ok) {
        throw new Error(
          `Cloudinary upload failed (${uploadRes.status}): ${uploadText}`
        );
      }

      const { public_id: publicId } = JSON.parse(uploadText) as {
        public_id: string;
      };
      console.info('[Uploader] Success! publicId:', publicId);
      toast.success('Image uploaded 🎉');

      // 3) record in Redis‐backed uploads list
      const redisRes = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
      console.debug('[Uploader] Redis response status:', redisRes.status);

      // 4) inform parent & reset UI
      onUploadSuccess?.(publicId);
      setOpen(false);
      setFile(null);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      console.error('[Uploader] Error:', msg);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [file, onUploadSuccess, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary'>
          Upload
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-md rounded-xl p-6'>
        <DialogTitle>Upload banner</DialogTitle>
        <DialogDescription className='mb-4 text-sm'>
          Drag & drop a JPG/PNG under 5 MB to upload directly to Cloudinary.
        </DialogDescription>

        <Card className='p-4 space-y-6'>
          <CardHeader className='p-0'>
            <CardTitle className='text-base'>Choose file</CardTitle>
          </CardHeader>

          <CardInner className='space-y-6'>
            <ImageDropZone file={file} onChange={setFile} />

            {error && <p className='text-sm text-destructive'>{error}</p>}

            {loading ? (
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  repeatType: 'reverse',
                }}
                className='h-10 w-full rounded bg-muted'
              />
            ) : (
              <Button
                className='w-full'
                disabled={!isValid}
                onClick={upload}
                size='sm'
              >
                Upload to Cloudinary
              </Button>
            )}
          </CardInner>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function ImageDropZone({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => accepted[0] && onChange(accepted[0]),
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className='space-y-2'>
      <Label>Banner image</Label>
      <div
        {...getRootProps()}
        className={clsx(
          'relative flex h-44 w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          'cursor-pointer bg-background hover:bg-muted/50',
          isDragActive ? 'border-primary/70 bg-muted' : 'border-muted/50'
        )}
      >
        <input {...getInputProps()} />
        {!file ? (
          <div className='flex flex-col items-center gap-1 text-muted-foreground'>
            <UploadCloud className='h-6 w-6' />
            <span className='text-xs'>Drag &amp; drop or click to browse</span>
          </div>
        ) : (
          <Suspense>
            <Image
              fill
              alt='Preview'
              src={URL.createObjectURL(file)}
              className='object-contain rounded-md'
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
