// app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Correct font variables to match CSS custom props in `globals.css`
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dynamic Banner Demo • Zoompan + Generative Fill',
  description:
    'Transform static visuals into dynamic, responsive marketing banners with Cloudinary AI and Next.js 14.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='scroll-smooth' suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          font-sans 
          antialiased 
          min-h-screen 
          flex flex-col 
          bg-background 
          text-foreground
        `}
      >
        <Navbar />
        <main className='flex-1'>{children}</main>
        <Footer />
        <Toaster position='top-right' richColors />
      </body>
    </html>
  );
}
