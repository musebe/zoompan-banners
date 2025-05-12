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

  const updateSplit = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSplit(pct);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    updateSplit(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) updateSplit(e.clientX);
  };

  const onPointerUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className='mx-auto my-12 max-w-3xl relative'
      style={{ aspectRatio: aspect }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Static banner underneath */}
      <Banner
        id={publicId}
        zoompan={false}
        generativeFill={generativeFill}
        aspect={aspect}
      />

      {/* Clipped dynamic banner */}
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

      {/* Drag handle */}
      <motion.div
        className='absolute top-0 h-full flex items-center justify-center'
        style={{
          left: `${split * 100}%`,
          touchAction: 'none',
          cursor: 'ew-resize',
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onPointerDown={onPointerDown}
      >
        <div className='h-full w-px bg-border' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='h-8 w-8 rounded-full border-2 border-primary bg-background' />
        </div>
      </motion.div>
    </div>
  );
}
