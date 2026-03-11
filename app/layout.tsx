import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { profile } from '@/data/profile'

// We will use strictly Inter, avoiding monospaced and display fonts to keep it purely Apple-esque.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`${inter.className} min-h-screen bg-black text-[#f5f5f7] antialiased selection:bg-[#2997ff] selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
