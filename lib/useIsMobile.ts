'use client'

import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

// Heavy scroll-jacked / GSAP-pinned / parallax animations are dropped for
// this breakpoint in favor of static layouts — mobile GPUs and touch
// scrolling don't handle scroll-linked transforms well, and pinned
// sections fight with iOS Safari's momentum scroll.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    setIsMobile(mql.matches)

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isMobile
}
