import type { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'Instagram Carousel AI',
    template: '%s | Instagram Carousel AI',
  },
  description: 'Transform your ideas into engaging Instagram carousel posts with AI. Create stunning visuals and compelling content in minutes.',
  keywords: [
    'Instagram',
    'carousel',
    'AI',
    'social media',
    'content creation',
    'GPT-4',
    'DALL-E',
    'automation'
  ],
  authors: [{ name: 'Instagram Carousel AI Team' }],
  creator: 'Instagram Carousel AI',
  openGraph: {
    type: 'website',
    title: 'Instagram Carousel AI - Create Beautiful Carousel Posts with AI',
    description: 'Transform your ideas into engaging Instagram carousel posts with AI',
    siteName: 'Instagram Carousel AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Carousel AI',
    description: 'Create stunning Instagram carousels with AI',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default defaultMetadata;