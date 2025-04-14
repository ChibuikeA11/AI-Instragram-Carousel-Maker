'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
  message?: string;
  className?: string;
}

export default function ErrorBoundary({
  error,
  reset,
  message = 'Something went wrong!',
  className = '',
}: Props) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error);
  }, [error]);

  return (
    <div className={`min-h-[400px] flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">{message}</h2>
        <p className="text-gray-500 dark:text-gray-400">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh page
          </Button>
        </div>
      </div>
    </div>
  );
}