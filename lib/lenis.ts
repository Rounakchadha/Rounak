import type Lenis from 'lenis'

// Lenis takes over scroll animation entirely, so any code that wants to
// scroll programmatically (e.g. navbar links) must go through the same
// instance — calling window.scrollTo/scrollIntoView directly fights with
// Lenis's own rAF loop and randomly gets overridden mid-animation.
let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function getLenis() {
  return instance
}
