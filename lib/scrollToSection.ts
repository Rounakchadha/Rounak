import { getLenis } from './lenis'

// Nav labels don't always match the DOM id of the section they should land
// on (e.g. the "Skills" link should land on the technical skills list, not
// the id="skills" services/bento section further up the page).
const SECTION_IDS: Record<string, string> = {
  about: 'about',
  experience: 'experience',
  projects: 'projects',
  skills: 'technical-skills',
  contact: 'contact',
}

export function resolveSectionId(label: string) {
  const key = label.toLowerCase()
  return SECTION_IDS[key] ?? key
}

export function scrollToSection(label: string) {
  const id = resolveSectionId(label)
  const el = document.getElementById(id)
  if (!el) return false

  const lenis = getLenis()

  // The Projects section is a pinned/scroll-jacked timeline — landing on its
  // top just shows the title slide, so jump further in to reveal the first
  // card, matching the offset the scroll-driven animation expects.
  const target: number | HTMLElement =
    id === 'projects'
      ? el.getBoundingClientRect().top + window.scrollY + window.innerHeight * 1.05
      : el

  if (lenis) {
    lenis.scrollTo(target, { offset: id === 'projects' ? 0 : -80, duration: 1.5 })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }

  return true
}
