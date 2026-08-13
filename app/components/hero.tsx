'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
import { useIsMobile } from '@/lib/useIsMobile'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { scrollY } = useScroll()

  // Deep Parallax Effect: As user scrolls down, hero moves down slower, scales down slightly, and fades out.
  // This creates the illusion that the next section is sliding *over* it.
  // Skipped on mobile — scroll-linked transforms (esp. the blur filter) are
  // a heavy per-frame cost on touch devices, so mobile gets a static hero.
  const y = useTransform(scrollY, [0, 800], ["0%", isMobile ? "0%" : "40%"])
  const opacity = useTransform(scrollY, [0, 600], [1, isMobile ? 1 : 0])
  const scale = useTransform(scrollY, [0, 800], [1, isMobile ? 1 : 0.95])
  const filter = useTransform(scrollY, [0, 800], ["blur(0px)", isMobile ? "blur(0px)" : "blur(10px)"])

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ zIndex: 0 }} // Base layer
    >
      {/* Liquid Glass Infinite Marquee Background (Highly Performant) */}
      {/* blur + mix-blend-screen compositing is expensive on mobile GPUs — keep mix-blend-screen but drop blur on mobile to prevent black background artifact */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-center gap-16 md:gap-12 -z-10 ${isMobile ? 'mix-blend-screen opacity-15' : 'mix-blend-screen opacity-20 blur-[4px]'}`}>
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(4).fill(0).map((_, i) => (
            <span key={i} className="font-black uppercase tracking-tighter liquid-glass-text mr-8" style={{ fontSize: 'clamp(140px, 20vw, 220px)', paddingRight: '2rem' }}>
              FULL STACK • DEVELOPER • ENGINEER • FRONT END • BACK END
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {Array(4).fill(0).map((_, i) => (
            <span key={`rev-${i}`} className="font-black uppercase tracking-tighter liquid-glass-text mr-8" style={{ fontSize: 'clamp(140px, 20vw, 220px)', paddingRight: '2rem' }}>
              SOFTWARE ENGINEER • CREATOR
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="flex flex-col items-center justify-center text-center px-6 w-full max-w-7xl"
        style={{ y, opacity, scale, filter }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-[#86868b] text-sm md:text-base font-medium tracking-widest uppercase mb-6"
        >
          {profile.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[7.5rem] sm:text-[8.5rem] md:text-9xl lg:text-[12rem] font-bold tracking-tighter leading-[0.9] text-[#f5f5f7] mb-8"
        >
          Rounak<br />Chadha.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-xl text-[#86868b] text-lg md:text-xl font-medium leading-relaxed"
        >
          Engineering scalable and robust architectures from the ground up, prioritizing performance and elegant design.
        </motion.p>
      </motion.div>


    </section>
  )
}
