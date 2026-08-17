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
  themeColor: '#000000',
}

// Vercel preview/staging deployments run the same production build as the
// real site — without this check, Google could index preview URLs as
// duplicate content under a different domain than the canonical one.
const isProductionDeployment = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production'

const title = `${profile.name} — ${profile.role}`
const keywords = [
  profile.name,
  'Rounak Chadha',
  profile.role,
  'Full-Stack Developer',
  'Software Engineer',
  'React Developer',
  'Next.js Developer',
  'Web Developer Lucknow',
  'Web Developer India',
  ...profile.projects.slice(0, 6).map((p) => p.title.split('—')[0].trim()),
]

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description: profile.metaDescription,
  keywords,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  applicationName: `${profile.name} Portfolio`,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: isProductionDeployment,
    follow: isProductionDeployment,
    googleBot: {
      index: isProductionDeployment,
      follow: isProductionDeployment,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: profile.siteUrl,
    siteName: `${profile.name} Portfolio`,
    title,
    description: profile.metaDescription,
    // app/opengraph-image.tsx is auto-detected by Next.js and wired in here
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: profile.metaDescription,
  },
  // icon.tsx/apple-icon.tsx are auto-detected by Next.js; favicon.ico stays
  // in public/ as a fallback for old browsers that only ever look there.
  verification: {
    // Paste the content value from Google Search Console's HTML tag
    // verification method here once the domain is set up, e.g.:
    // google: 'abc123...',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: profile.siteUrl,
    jobTitle: profile.role,
    email: profile.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    },
    sameAs: Object.values(profile.socials).filter(
      (url) => typeof url === 'string' && url.startsWith('http')
    ),
    knowsAbout: Object.values(profile.skills).flat(),
    alumniOf: profile.education.map((e) => ({
      '@type': 'CollegeOrUniversity',
      name: e.institution,
    })),
  }

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-[#f5f5f7] antialiased selection:bg-[#2997ff] selection:text-white`}>
        {children}
      </body>
    </html>
  )
}
