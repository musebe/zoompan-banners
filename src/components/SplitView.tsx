// src/components/SplitView.tsx
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import Banner from '@/components/Banner';

type SplitViewProps = {
  publicId: string;
  zoompan: boolean;
  generativeFill: boolean;
  aspect?: string;
};

export default function SplitView({
  publicId,
  zoompan,
  generativeFill,
  aspect = '16/9',
}: SplitViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(0.5);
  const [dragging, setDragging] = useState(false);

  const updateSplit = (x: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSplit(Math.max(0, Math.min(1, (x - rect.left) / rect.width)));
  };

  return (
    <div
      ref={containerRef}
      className='mx-auto my-12 max-w-3xl relative'
      style={{ aspectRatio: aspect }}
      onPointerMove={(e) => dragging && updateSplit(e.clientX)}
      onPointerUp={() => setDragging(false)}
    >
      <Banner
        id={publicId}
        zoompan={false}
        generativeFill={generativeFill}
        aspect={aspect}
      />

      <div
        className='absolute inset-0 overflow-hidden'
        style={{ width: `${split * 100}%` }}
      >
        <Banner
          id={publicId}
          zoompan={zoompan}
          generativeFill={generativeFill}
          aspect={aspect}
        />
      </div>

      <motion.div
        className='absolute top-0 h-full flex items-center justify-center'
        style={{
          left: `${split * 100}%`,
          touchAction: 'none',
          cursor: 'ew-resize',
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onPointerDown={(e) => {
          setDragging(true);
          updateSplit(e.clientX);
        }}
      >
        <div className='h-full w-px bg-border' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='h-8 w-8 rounded-full border-2 border-primary bg-background' />
        </div>
      </motion.div>
    </div>
  );
}
