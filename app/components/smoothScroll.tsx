'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '@/lib/lenis'
import { scrollToSection } from '@/lib/scrollToSection'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Checked synchronously (not via the useIsMobile hook) so Lenis never
    // briefly spins up on mobile before a re-render turns it back off.
    const isMobile = window.matchMedia('(max-width: 767px)').matches

    // Only force-reset to the top when there's no #section in the URL —
    // otherwise this used to unconditionally run and stomp on the browser's
    // native scroll-to-hash whenever a nav link routed in from another page
    // (router.push('/#contact')), which is why anchor links worked or failed
    // depending on which one won the race.
    const hash = window.location.hash.slice(1)
    if (!hash) {
      window.scrollTo(0, 0)
    }

    // On mobile, skip Lenis entirely and let the browser handle native
    // touch scrolling — Lenis's rAF-driven scroll fights with iOS/Android
    // momentum scroll and is a major source of jank on touch devices.
    if (isMobile) {
      if (hash) {
        requestAnimationFrame(() => scrollToSection(hash))
      }
      return
    }

    const lenis = new Lenis({
      duration: 1.5, // Slower, Apple-like velvety scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    setLenis(lenis)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    if (hash) {
      // Wait a frame so the layout (and the scroll-jacked Projects section's
      // height) is measured before we compute a scroll target.
      requestAnimationFrame(() => scrollToSection(hash))
    }

    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
