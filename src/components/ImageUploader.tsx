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

/* -------------------------------------------------------------------------- */
/*                             Component props                                */
/* -------------------------------------------------------------------------- */
export interface ImageUploaderProps {
  onUploadSuccess?: (publicId: string) => void;
}

/* -------------------------------------------------------------------------- */
/*                               Uploader                                     */
/* -------------------------------------------------------------------------- */
export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isValid = file !== null;

  const upload = useCallback(async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append('file', file!);

      const res = await fetch('/api/upload', { method: 'POST', body });
      if (!res.ok) throw new Error(await res.text());
      const { publicId } = (await res.json()) as { publicId: string };

      toast.success('Image uploaded 🎉');
      setOpen(false);
      setFile(null);
      onUploadSuccess?.(publicId);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [file, isValid, onUploadSuccess, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary'>
          Upload
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className='max-w-md rounded-xl p-6'>
        <DialogTitle>Upload banner</DialogTitle>
        <DialogDescription className='mb-4 text-sm'>
          Drop a JPG/PNG under&nbsp;5&nbsp;MB. We’ll send it to Cloudinary and
          show a preview.
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

/* -------------------------------------------------------------------------- */
/*                          Drop-zone with preview                            */
/* -------------------------------------------------------------------------- */
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
