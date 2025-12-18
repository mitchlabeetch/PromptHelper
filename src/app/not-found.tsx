import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-6xl font-black mb-4 text-violet-500">404</h1>
      <h2 className="text-2xl font-bold mb-8">Page Not Found</h2>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to building.
      </p>
      <Button asChild>
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  );
}
