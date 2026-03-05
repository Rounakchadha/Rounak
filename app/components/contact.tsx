'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)

  // This section acts as a "curtain reveal" footer.
  // It is fixed to the bottom of the viewport with a negative z-index.
  // The main wrapper padding/margin will allow the page to scroll past it, revealing it.

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  // Subtle scale-up effect as it is revealed
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1])

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative w-full min-h-[80vh] bg-[#0a0a0a] z-50 flex flex-col items-center justify-center px-6 py-24"
    >
      <motion.div
        style={{ scale, opacity }}
        className="w-full max-w-[1000px] flex flex-col items-center text-center"
      >
        <p className="font-semibold tracking-[0.2em] text-[#86868b] uppercase text-sm mb-12">
          Get in touch
        </p>

        <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-[#f5f5f7] mb-8 leading-[1.1]">
          Ready to build <br />
          <span className="text-[#2997ff]">something great.</span>
        </h2>

        <a
          href={`mailto:${profile.email}`}
          className="inline-block mt-8 px-8 py-4 bg-[#f5f5f7] text-black font-semibold rounded-full text-lg hover:scale-105 hover:bg-white transition-all duration-300"
        >
          Start a Conversation
        </a>

        <div className="flex gap-8 mt-24">
          {Object.entries(profile.socials).map(([platform, url]) => {
            if (!url) return null
            // Handle email differently if needed, but here we just render all valid string URLs
            return (
              <a
                key={platform}
                href={platform === 'email' ? `mailto:${url}` : url}
                target="_blank"
                rel="noreferrer"
                className="text-[#86868b] font-medium text-lg capitalize hover:text-[#f5f5f7] transition-colors"
              >
                {platform}
              </a>
            )
          })}
        </div>

        <div className="w-full border-t border-[#333] mt-24 pt-8 flex justify-between items-center text-[#515154] text-xs font-medium uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} {profile.name}</span>
          <span>All Rights Reserved</span>
        </div>

      </motion.div>
    </section>
  )
}
