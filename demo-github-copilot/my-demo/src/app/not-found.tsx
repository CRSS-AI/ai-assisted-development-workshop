import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <h2 className="text-6xl font-bold text-gray-400 mb-4">404</h2>
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
