// src/app/page.tsx
'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ControlsBar, { GenerateConfig } from '@/components/ControlsBar';
import SplitView from '@/components/SplitView';
import UploadGallery from '@/components/UploadGallery';

export default function HomeClient() {
  const [config, setConfig] = useState<GenerateConfig | null>(null);

  return (
    <div className='flex flex-col min-h-screen'>
      <HeroSection />

      {/* Upload + toggles */}
      <ControlsBar onGenerate={setConfig} />

      {/* Main content: split-view & gallery */}
      <main className='flex-1 p-8 space-y-12'>
        {/* Only show SplitView once you’ve clicked “View Transformed” */}
        {config && (
          <SplitView
            publicId={config.publicId}
            zoompan={config.zoompan}
            generativeFill={config.generativeFill}
            aspect='16/9'
          />
        )}

        {/* Always show the recent‐uploads gallery, using the same toggle settings */}
        <UploadGallery
          zoompan={config?.zoompan ?? true}
          generativeFill={config?.generativeFill ?? true}
          aspect='16/9'
        />
      </main>
    </div>
  );
}
