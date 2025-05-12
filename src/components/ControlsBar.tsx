// src/components/ControlsBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import ImageUploader from '@/components/ImageUploader';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export type GenerateConfig = {
  publicId: string;
  zoompan: boolean;
  generativeFill: boolean;
};

export interface ControlsBarProps {
  onGenerate: (cfg: GenerateConfig) => void;
}

export default function ControlsBar({ onGenerate }: ControlsBarProps) {
  const [publicId, setPublicId] = useState<string | null>(null);
  const [zoompan, setZoompan] = useState(true);
  const [genFill, setGenFill] = useState(true);
  const [loading, setLoading] = useState(false);

  const canGenerate = Boolean(publicId) && !loading;

  const handleGenerate = useCallback(() => {
    if (!publicId) return;
    setLoading(true);
    onGenerate({ publicId, zoompan, generativeFill: genFill });
    setLoading(false);
  }, [publicId, zoompan, genFill, onGenerate]);

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg shadow'
      >
        <ImageUploader onUploadSuccess={setPublicId} />

        <div className='flex items-center gap-6'>
          <label className='flex items-center space-x-2'>
            <Switch
              checked={zoompan}
              onCheckedChange={setZoompan}
              id='zoompan'
            />
            <Label htmlFor='zoompan'>Zoompan</Label>
          </label>
          <label className='flex items-center space-x-2'>
            <Switch
              checked={genFill}
              onCheckedChange={setGenFill}
              id='genfill'
            />
            <Label htmlFor='genfill'>Generative Fill</Label>
          </label>
        </div>

        <Button
          size='lg'
          className='whitespace-nowrap'
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          {loading ? 'Generating…' : 'View Transformed Banner'}
        </Button>
      </motion.div>
    </div>
  );
}
