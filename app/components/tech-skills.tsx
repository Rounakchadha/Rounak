'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '@/lib/lenis'
import { useIsMobile } from '@/lib/useIsMobile'

function getSkillCards() {
    return Object.entries(profile.skills).map(([category, skills], index) => ({
        title: category.toUpperCase(),
        skills: skills.slice(0, 6),
        id: index,
    }))
}

// Plain stacked grid — no GSAP ScrollTrigger pin, no per-frame arc transform
// math, no scroll-linked marquee text. The desktop version pins the section
// and manually writes translate3d/opacity to fixed-width 400px cards every
// scroll tick via querySelectorAll, which is both expensive and doesn't fit
// mobile viewports anyway.
function TechnicalSkillsStatic() {
    const skillCards = getSkillCards()

    return (
        <section
            id="skills"
            className="w-full relative z-30 bg-[#000] rounded-[3rem] border-t border-[#111] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)] px-4 py-24"
        >
            <h2 className="text-5xl font-black text-[#fff] tracking-tighter uppercase text-center mb-12">
                SKILLS
            </h2>

            <div className="flex flex-col gap-6 max-w-[500px] mx-auto">
                {skillCards.map((card) => (
                    <div
                        key={card.id}
                        className="bg-gradient-to-br from-[#1a1a1c] to-[#0a0a0c] rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-[#333] p-8"
                    >
                        <h3 className="text-2xl font-black text-[#f5f5f7] mb-6 tracking-wide uppercase border-b border-[#333] pb-4">
                            {card.title}
                        </h3>
                        <div className="space-y-3">
                            {card.skills.map((skill, i) => (
                                <div key={i} className="flex items-center text-[#a1a1a6] text-lg font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#555] mr-4" />
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

function TechnicalSkillsAnimated() {
    const containerRef = useRef<HTMLDivElement>(null)
    const textSectionRef = useRef<HTMLDivElement>(null)
    const skillsSectionRef = useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = useState(-1)
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
    const [cardStyle, setCardStyle] = useState({ width: '85vw', maxWidth: '400px', height: '450px' })

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCardStyle({ width: '60vw', maxWidth: '280px', height: '300px' })
            } else {
                setCardStyle({ width: '85vw', maxWidth: '400px', height: '450px' })
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Register GSAP ScrollTrigger (conditionally loaded in browser)
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        // GSAP's own default behavior also treats the mobile address-bar
        // show/hide as a resize and auto-refreshes all triggers on it, which
        // is the standard cause of pinned sections "jumping"/glitching
        // mid-scroll on phones. This is the officially recommended guard.
        ScrollTrigger.config({ ignoreMobileResize: true })
    }, [])

    // marquee text
    //
    // Framer Motion's own useScroll() tracks window scroll with its own rAF
    // listener, which runs as a separate loop from Lenis's rAF loop that's
    // actually driving the scroll position. Two independent loops reading/
    // writing the same value a frame apart is what read as a wobble — no
    // amount of spring-smoothing the output fixes a mismatch in the input.
    // Instead, compute progress directly inside Lenis's own scroll callback,
    // so this updates on the exact same tick Lenis uses, once.
    const textProgress = useMotionValue(0)
    useEffect(() => {
        const el = textSectionRef.current
        if (!el) return

        // This whole block is `hidden md:block` (desktop-only) — on mobile the
        // element is display:none, so attaching a scroll listener here just
        // burns a synchronous getBoundingClientRect() read on every scroll
        // event for an invisible, zero-size element. No visual difference
        // either way; this only removes wasted work during mobile scrolling.
        if (window.matchMedia('(max-width: 767px)').matches) return

        const compute = () => {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            const total = rect.height + vh
            const traveled = vh - rect.top
            textProgress.set(Math.min(1, Math.max(0, traveled / total)))
        }

        let unsubscribe: (() => void) | undefined
        // Defer to the next frame — this component's mount effect runs before
        // SmoothScroll's (children mount before parents), so Lenis may not
        // exist yet if we call getLenis() synchronously here.
        const rafId = requestAnimationFrame(() => {
            const lenis = getLenis()
            if (lenis) {
                unsubscribe = lenis.on('scroll', compute)
            } else {
                window.addEventListener('scroll', compute, { passive: true })
                unsubscribe = () => window.removeEventListener('scroll', compute)
            }
            compute()
        })

        return () => {
            cancelAnimationFrame(rafId)
            unsubscribe?.()
        }
    }, [textProgress])

    const textX = useTransform(textProgress, [0, 1], ["5%", "-50%"])
    const textX2 = useTransform(textProgress, [0, 1], ["-50%", "5%"])

    const skillCards = getSkillCards()
    const N = skillCards.length

    useEffect(() => {
        if (!skillsSectionRef.current) return

        // kill previous
        scrollTriggerRef.current?.kill()
        scrollTriggerRef.current = null

        const ctx = gsap.context(() => {
            // Cache every card element once — onUpdate fires on essentially
            // every scroll tick while pinned, so re-running querySelector for
            // each of the N cards on every single tick (as this used to do)
            // is pure repeated DOM-query overhead with no visual difference.
            const cardEls: (HTMLElement | null)[] = []
            for (let i = 0; i < N; i++) {
                cardEls.push(document.querySelector(`.skill-card-${i}`) as HTMLElement | null)
            }

            // Measure to keep logic responsive
            const firstEl = cardEls[0]
            const cardW = firstEl ? firstEl.offsetWidth : 400
            const gap = Math.max(140, Math.min(220, Math.floor(window.innerWidth * 0.12))) // spacing between cards
            const stepX = Math.round(cardW + gap) // distance between neighboring card centers

            // distance from center to be completely off-screen (both sides)
            const offX = Math.ceil(window.innerWidth / 2 + cardW / 2 + 64)

            // lead-in so NO card is visible when section enters;
            // tail so last card fully exits left before unpin
            const lead = offX / stepX
            const tail = offX / stepX

            // raw timeline range and total scroll
            const startRaw = -1 - lead
            const endRaw = (N - 1) + tail
            const span = endRaw - startRaw // = N + lead + tail

            const isMobile = window.innerWidth < 768
            // Increase pinning distance slightly (0.65) to slow down the arc animation and prevent jumping/glitching on fast swipes
            const totalScrollPx = Math.round(span * stepX * (isMobile ? 0.65 : 1))

            // init: place all cards off to the right & invisible
            for (let i = 0; i < N; i++) {
                const el = cardEls[i]
                if (el) {
                    el.style.transform = `translate3d(${offX}px, 0, 0)`
                    el.style.opacity = '0'
                }
            }

            const round = (n: number) => Math.round(n)

            scrollTriggerRef.current = ScrollTrigger.create({
                trigger: skillsSectionRef.current!,
                start: 'top top',
                end: `+=${totalScrollPx}`, // stays pinned through lead + cards + tail
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const t = (self.scroll() - self.start) / (self.end - self.start) // 0..1
                    const raw = startRaw + t * span

                    // UI counter (clamped)
                    const a = Math.max(0, Math.min(N - 1, Math.floor(raw)))
                    setCurrentIndex(raw < 0 ? -1 : a)

                    for (let index = 0; index < N; index++) {
                        const el = cardEls[index]
                        if (!el) continue

                        const offset = index - raw
                        const abs = Math.abs(offset)

                        // arc path
                        let x: number
                        let y: number
                        if (abs <= 2.5) {
                            x = offset * stepX
                            y = Math.pow(abs, 0.8) * 80
                        } else {
                            x = offset < 0 ? -offX : offX
                            y = 0
                        }

                        // keep cards visible while they are actually inside the viewport;
                        // snap to 0 exactly once fully beyond offX threshold (no fractional opacity -> no blur)
                        const fullyInside = Math.abs(x) < offX
                        const opacity = fullyInside ? 1 : 0

                        el.style.transform = `translate3d(${round(x)}px, ${round(y)}px, 0)`
                        el.style.opacity = opacity.toString()
                    }
                },
            })
        }, skillsSectionRef)

        // Mobile browsers fire `resize` when the address bar shows/hides during
        // a scroll gesture (window.innerHeight changes, width doesn't). Calling
        // ScrollTrigger.refresh() there recalculates the pin's start/end mid-
        // swipe, which is what reads as the animation "stopping"/glitching —
        // only refresh on an actual width change (rotation/real resize).
        let lastWidth = window.innerWidth
        const onResize = () => {
            if (window.innerWidth === lastWidth) return
            lastWidth = window.innerWidth
            ScrollTrigger.refresh()
        }
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            scrollTriggerRef.current?.kill()
            scrollTriggerRef.current = null
            ctx.revert()
        }
    }, [N])

    // counter text (never shows 07 — 06)
    const safeIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, Math.max(1, N))

    return (
        <>
            <section
                id="skills"
                className="w-full relative z-30 bg-[#000] rounded-[3rem] border-t border-[#111] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
            >
                {/* Moving Text Section immediately above the pinned skills - hidden on mobile to prevent transition glitches */}
                <div ref={textSectionRef} className="hidden md:block py-24 bg-black overflow-hidden border-b border-[#222]">
                    <div className="relative">
                        <motion.div
                            style={{ x: textX }}
                            className="flex w-max whitespace-nowrap text-[18vw] font-black text-white leading-none select-none tracking-tighter"
                        >
                            {[...Array(4)].map((_, i) => (
                                <span key={i} className="pr-8">DEVELOPER • ENGINEER • CREATOR • </span>
                            ))}
                        </motion.div>
                        <motion.div
                            style={{ x: textX2 }}
                            className="flex w-max whitespace-nowrap text-[18vw] font-black text-[#555] leading-none select-none tracking-tighter mt-4"
                        >
                            {[...Array(4)].map((_, i) => (
                                <span key={i} className="pr-8">FULL-STACK • FRONTEND • BACKEND • </span>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Skills Section */}
                <div ref={skillsSectionRef} className="min-h-screen bg-black relative overflow-hidden">
                    {/* Solid white heading */}
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                        <div
                            className="flex w-max text-[22vw] font-black text-[#fff] tracking-tighter uppercase whitespace-nowrap select-none pointer-events-none"
                            style={{ opacity: 1 }}
                        >
                            SKILLS
                        </div>
                    </div>

                    {/* Cards Layer */}
                    <div ref={containerRef} className="relative z-10 h-screen flex items-center justify-center">
                        <div className="w-full max-w-7xl mx-auto px-8">
                            <div className="relative h-[600px] flex items-center justify-center">
                                {skillCards.map((card, index) => (
                                    <div
                                        key={card.id}
                                        className={`skill-card-${index} gfx-card absolute bg-gradient-to-br from-[#1a1a1c] to-[#0a0a0c] rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-[#333] p-5 md:p-10 overflow-hidden group hover:border-[#555] transition-colors duration-500`}
                                        style={{ ...cardStyle, zIndex: 20 }}
                                    >
                                        {/* Subtle top glow effect */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[#555] to-transparent opacity-50" />

                                        <div className="h-full flex flex-col justify-start relative z-10">
                                            <h3 className="text-xl md:text-3xl font-black text-[#f5f5f7] mb-3 md:mb-8 tracking-wide uppercase border-b border-[#333] pb-3 md:pb-6 flex items-center justify-between">
                                                {card.title}
                                                <span className="text-[#333] text-2xl md:text-4xl leading-none">.</span>
                                            </h3>
                                            <div className="space-y-1.5 md:space-y-4 flex-grow">
                                                {card.skills.map((skill, i) => (
                                                    <div key={i} className="flex items-center text-[#a1a1a6] text-[15px] md:text-xl font-medium group-hover:text-[#d1d1d6] transition-colors duration-300">
                                                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#333] mr-3 md:mr-4 group-hover:bg-[#555] transition-colors duration-300" />
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress */}
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-30">
                                <div className="text-sm font-mono tracking-widest text-[#f5f5f7] bg-[#121212] border border-[#333] px-6 py-3 rounded-full shadow-2xl">
                                    {String(safeIndex).padStart(2, '0')} — {String(N).padStart(2, '0')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GPU/AA hints */}
            <style jsx global>{`
        .gfx-card {
          backface-visibility: hidden;
          transform-style: preserve-3d;
          will-change: transform;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          contain: layout paint style;
        }
      `}</style>
        </>
    )
}

export default function TechnicalSkills() {
    return <TechnicalSkillsAnimated />
}
