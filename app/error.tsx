'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-[24px] border border-error/20 shadow-lg text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          !
        </div>
        <h2 className="font-serif italic text-3xl text-earth mb-4">Something went wrong!</h2>
        <p className="text-earth-muted mb-8">
          We've encountered an unexpected error. Please try again or return to the homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 border border-earth/20 rounded-full font-medium text-earth hover:bg-earth/5 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gold text-white rounded-full font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
