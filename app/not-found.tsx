import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-[24px] border border-earth/20 shadow-lg text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ?
        </div>
        <h2 className="font-serif italic text-3xl text-earth mb-4">Page Not Found</h2>
        <p className="text-earth-muted mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-gold text-white rounded-full font-medium hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
