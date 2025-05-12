// src/components/ui/image-comparison.tsx
'use client';

import { cn } from '@/lib/utils';
import { useState, createContext, useContext, ReactNode } from 'react';
import {
  motion,
  MotionValue,
  SpringOptions,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

type ContextType = {
  sliderPosition: number;
  setSliderPosition: (pos: number) => void;
  motionSliderPosition: MotionValue<number>;
};
const ImageComparisonContext = createContext<ContextType | undefined>(
  undefined
);

export type ImageComparisonProps = {
  children: ReactNode;
  className?: string;
  enableHover?: boolean;
  springOptions?: SpringOptions;
  /** Start position in % */
  initialPosition?: number;
  /** CSS aspect ratio, e.g. '16/9' */
  aspectRatio?: string;
};

const DEFAULT_SPRING_OPTIONS = { bounce: 0, duration: 0 };

export function ImageComparison({
  children,
  className,
  enableHover = false,
  springOptions,
  initialPosition = 50,
  aspectRatio,
}: ImageComparisonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const motionValue = useMotionValue(initialPosition);
  const motionSliderPosition = useSpring(
    motionValue,
    springOptions ?? DEFAULT_SPRING_OPTIONS
  );
  const [sliderPosition, setSliderPosition] = useState(initialPosition);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && !enableHover) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX =
      'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pct = Math.min(
      Math.max(((clientX - rect.left) / rect.width) * 100, 0),
      100
    );
    motionValue.set(pct);
    setSliderPosition(pct);
  };

  return (
    <ImageComparisonContext.Provider
      value={{ sliderPosition, setSliderPosition, motionSliderPosition }}
    >
      <div
        className={cn(
          'relative select-none overflow-hidden',
          enableHover && 'cursor-ew-resize',
          className
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
        onMouseDown={() => !enableHover && setIsDragging(true)}
        onMouseUp={() => !enableHover && setIsDragging(false)}
        onMouseLeave={() => !enableHover && setIsDragging(false)}
        onMouseMove={handleDrag}
        onTouchStart={() => !enableHover && setIsDragging(true)}
        onTouchEnd={() => !enableHover && setIsDragging(false)}
        onTouchMove={handleDrag}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}

export type ImageComparisonImageProps = {
  src: string;
  alt: string;
  position: 'left' | 'right';
  className?: string;
};
export function ImageComparisonImage({
  src,
  alt,
  position,
  className,
}: ImageComparisonImageProps) {
  const ctx = useContext(ImageComparisonContext)!;
  const clip = useTransform(ctx.motionSliderPosition, (v) =>
    position === 'left' ? `inset(0 0 0 ${v}%)` : `inset(0 ${100 - v}% 0 0)`
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      style={{ clipPath: clip }}
    />
  );
}

export type ImageComparisonSliderProps = {
  className?: string;
  children?: ReactNode;
};
export function ImageComparisonSlider({
  className,
  children,
}: ImageComparisonSliderProps) {
  const { motionSliderPosition } = useContext(ImageComparisonContext)!;
  const left = useTransform(motionSliderPosition, (v) => `${v}%`);

  return (
    <motion.div
      className={cn('absolute inset-y-0 w-1 cursor-ew-resize', className)}
      style={{ left }}
    >
      {children}
    </motion.div>
  );
}
