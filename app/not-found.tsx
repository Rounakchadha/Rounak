import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[#86868b] text-sm font-medium tracking-widest uppercase mb-4">404</p>
      <h1 className="text-4xl md:text-6xl font-bold text-[#f5f5f7] tracking-tight mb-6">
        Page not found.
      </h1>
      <p className="text-[#86868b] text-lg mb-10 max-w-md">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        href="/"
        className="px-8 py-4 bg-[#f5f5f7] text-black font-semibold rounded-full hover:bg-white transition-colors"
      >
        Back to Home
      </Link>
    </main>
  )
}
