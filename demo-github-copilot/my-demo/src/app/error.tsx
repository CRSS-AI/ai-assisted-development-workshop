'use client';

import { useEffect } from 'react';

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
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          An error occurred while loading the AI Todo Extractor. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
