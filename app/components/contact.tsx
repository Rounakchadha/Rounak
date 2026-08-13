'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
import { Github, Linkedin, Mail } from 'lucide-react'

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
      className="relative w-full min-h-screen bg-[#0a0a0a] z-50 flex flex-col items-center justify-between px-6 pt-32 pb-8"
    >
      <motion.div
        style={{ scale, opacity }}
        className="w-full max-w-[1000px] flex-1 flex flex-col items-center justify-center text-center -mt-16"
      >
        <p className="font-semibold tracking-[0.2em] text-[#86868b] uppercase text-sm mb-12">
          Get in touch
        </p>

        <h2 className="text-5xl md:text-7xl lg:text-[10rem] font-bold tracking-tighter text-[#f5f5f7] mb-8 leading-[1.05]">
          Ready to build <br />
          <span className="text-[#2997ff]">something great.</span>
        </h2>

        <a
          href={`mailto:${profile.email}`}
          className="inline-block mt-8 px-8 py-4 bg-[#f5f5f7] text-black font-semibold rounded-full text-lg hover:scale-105 hover:bg-white transition-all duration-300"
        >
          Start a Conversation
        </a>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-24">
          {Object.entries(profile.socials).map(([platform, url]) => {
            if (!url) return null
            
            let Icon = null
            if (platform === 'github') Icon = <Github className="w-6 h-6" />
            if (platform === 'linkedin') Icon = <Linkedin className="w-6 h-6" />
            if (platform === 'email') Icon = <Mail className="w-6 h-6" />
            if (platform === 'whatsapp') Icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>

            return (
              <a
                key={platform}
                href={platform === 'email' ? `mailto:${url}` : url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#86868b] font-medium text-lg capitalize hover:text-[#f5f5f7] transition-colors"
              >
                {Icon}
                <span>{platform}</span>
              </a>
            )
          })}
        </div>
      </motion.div>

      <div className="w-full max-w-[1200px] border-t border-[#333] pt-6 flex justify-between items-center text-[#515154] text-xs font-medium uppercase tracking-widest mt-auto">
        <span>&copy; {new Date().getFullYear()} {profile.name}</span>
        <span>All Rights Reserved</span>
      </div>
    </section>
  )
}
