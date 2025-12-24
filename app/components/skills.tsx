'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textSectionRef = useRef<HTMLDivElement>(null)
  const skillsSectionRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  // Safe card size helper - smaller mobile, bigger desktop
  const getCardSize = () => {
    if (typeof window === 'undefined') {
      return { width: '450px', height: '500px' }
    }
    return window.innerWidth < 768
      ? { width: '180px', height: '250px' }  // Much smaller for mobile
      : { width: '450px', height: '500px' }  // Bigger for desktop
  }

  // marquee text
  const { scrollYProgress: textScroll } = useScroll({
    target: textSectionRef,
    offset: ['start end', 'end start'],
  })
  const textX = useTransform(textScroll, [0, 1], [200, -1200])
  const textX2 = useTransform(textScroll, [0, 1], [-1200, 200])

  const skillCards = Object.entries(profile.skills).map(([category, skills], index) => ({
    title: category.toUpperCase(),
    skills: skills.slice(0, 6),
    id: index,
  }))
  const N = skillCards.length

  useEffect(() => {
    if (!skillsSectionRef.current) return

    // kill previous
    scrollTriggerRef.current?.kill()
    scrollTriggerRef.current = null

    const ctx = gsap.context(() => {
      // Measure to keep logic responsive
      const firstEl = document.querySelector('.skill-card-0') as HTMLElement | null
      const cardW = firstEl ? firstEl.offsetWidth : 450
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
      const totalScrollPx = Math.round(span * stepX)

      // init: place all cards off to the right & invisible
      for (let i = 0; i < N; i++) {
        const el = document.querySelector(`.skill-card-${i}`) as HTMLElement | null
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
            const el = document.querySelector(`.skill-card-${index}`) as HTMLElement | null
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

    const onResize = () => ScrollTrigger.refresh()
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
      {/* Moving Text Section */}
      <section ref={textSectionRef} className="py-24 bg-white overflow-hidden">
        <div className="relative">
          <motion.div
            style={{ x: textX }}
            className="flex whitespace-nowrap text-[18vw] font-black text-gray-100 leading-none select-none"
          >
            <span>DEVELOPER • ENGINEER • CREATOR • </span>
          </motion.div>
          <motion.div
            style={{ x: textX2 }}
            className="flex whitespace-nowrap text-[18vw] font-black text-gray-100 leading-none select-none"
          >
            <span>FULL-STACK • FRONTEND • BACKEND • </span>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsSectionRef} className="min-h-screen bg-white relative overflow-hidden">
        {/* Solid black heading */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div
            className="text-[16vw] md:text-[18vw] font-black leading-none select-none pointer-events-none"
            style={{ color: '#000000', opacity: 1 }}
          >
            SKILLS
          </div>
        </div>

        {/* Cards Layer */}
        <div ref={containerRef} className="relative z-10 h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="relative h-[600px] flex items-center justify-center">
              {skillCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`skill-card-${index} gfx-card absolute bg-white rounded-xl md:rounded-3xl shadow-xl border border-gray-200 p-3 md:p-10`}
                  style={{
                    ...getCardSize(),
                    zIndex: 20,
                    transition: 'none',
                  }}
                >
                  <div className="h-full flex flex-col justify-start">
                    <h3 className="text-sm md:text-3xl font-bold text-gray-900 mb-2 md:mb-8 tracking-tight">
                      {card.title}
                    </h3>
                    <div className="space-y-1 md:space-y-4">
                      {card.skills.map((skill, i) => (
                        <div key={i} className="text-gray-700 text-[9px] md:text-lg font-medium">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 text-center z-30">
              <div className="text-xs md:text-lg font-mono text-gray-600 bg-white px-2.5 md:px-4 py-1 md:py-2 rounded-full shadow-lg">
                {String(safeIndex).padStart(2, '0')} — {String(N).padStart(2, '0')}
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
