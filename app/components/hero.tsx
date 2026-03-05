'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  // Deep Parallax Effect: As user scrolls down, hero moves down slower, scales down slightly, and fades out.
  // This creates the illusion that the next section is sliding *over* it.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"])

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ zIndex: 0 }} // Base layer
    >
      {/* Liquid Glass Infinite Marquee Background (Highly Performant) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-center gap-12 -z-10 mix-blend-screen opacity-30 blur-[4px]">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(4).fill(0).map((_, i) => (
            <span key={i} className="text-[16vw] font-black uppercase tracking-tighter liquid-glass-text mr-8" style={{ paddingRight: '2rem' }}>
              FULL STACK • DEVELOPER • ENGINEER • FRONT END • BACK END
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {Array(4).fill(0).map((_, i) => (
            <span key={`rev-${i}`} className="text-[16vw] font-black uppercase tracking-tighter liquid-glass-text mr-8" style={{ paddingRight: '2rem' }}>
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
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.9] text-[#f5f5f7] mb-8"
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

      {/* Scroll indicator - absolute bottom */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{ opacity }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#86868b] to-transparent animate-pulse" />
      </motion.div>
    </section>
  )
}
