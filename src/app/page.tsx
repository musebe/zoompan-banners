'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ControlsBar from '@/components/ControlsBar';
import SplitView from '@/components/SplitView';

export default function HomeClient() {
  const [config, setConfig] = useState<{
    publicId: string;
    zoompan: boolean;
    generativeFill: boolean;
  } | null>(null);

  return (
    <>
      <HeroSection />
      <ControlsBar onGenerate={setConfig!} />
      {config && (
        <SplitView
          publicId={config.publicId}
          zoompan={config.zoompan}
          generativeFill={config.generativeFill}
          aspect='16/9'
        />
      )}
    </>
  );
}
