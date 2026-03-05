'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { profile } from '@/data/profile'

function ExperienceCard({ exp, index, totalCards, progress }: { exp: any, index: number, totalCards: number, progress: MotionValue<number> }) {
  // We want cards to stick to the top. As subsequent cards scroll up, the current card scales down slightly and darkens.
  // We calculate a custom range for each card.

  const isLast = index === totalCards - 1

  const targetScale = isLast ? 1 : 1 - ((totalCards - index) * 0.05)
  const range = [index * (1 / totalCards), (index + 0.5) * (1 / totalCards)]
  const scale = useTransform(progress, range, [1, targetScale])

  // Fade out the content of the old card much later, only when the new one has almost fully arrived.
  // The last card should never fade out its content.
  const fadeOutRange = [(index + 0.8) * (1 / totalCards), (index + 1) * (1 / totalCards)]
  const contentOpacity = useTransform(progress, fadeOutRange, [1, isLast ? 1 : 0])

  // Keep card background relatively opaque so it maintains the "stack" look
  const opacity = useTransform(progress, range, [1, 1])

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-0">
      <motion.div
        style={{ scale, opacity, top: `calc(10vh + ${index * 2}0px)` }}
        className="relative w-full max-w-[1000px] h-[65vh] rounded-[2rem] bg-[#1a1a1a] border border-[#333] shadow-2xl p-8 md:p-16 flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle top glare */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#555] to-transparent opacity-50" />

        <motion.div style={{ opacity: contentOpacity }} className="flex flex-col h-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 border-b border-[#333] pb-10">
            <div>
              <h3 className="text-3xl md:text-5xl font-bold text-[#f5f5f7] tracking-tight mb-2">
                {exp.role}
              </h3>
              <h4 className="text-xl md:text-2xl font-medium text-[#2997ff]">
                {exp.company}
              </h4>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#333] bg-[#000] text-[#86868b] text-sm font-medium tracking-wide">
                {exp.duration}
              </span>
            </div>
          </div>

          <div className="pt-10 flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <ul className="space-y-6">
              {exp.bullets.map((bullet: string, i: number) => (
                <li key={i} className="flex items-start text-[#a1a1a6] text-lg md:text-xl leading-relaxed font-medium">
                  <span className="text-[#2997ff] mr-4 text-2xl leading-none mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll over the entire container which is N * 100vh tall
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Start the heading from behind the cards (~40vh down) and move it up to top (~5vh) as the first card scrolls
  const headingY = useTransform(scrollYProgress, [0, 0.2], ["40vh", "5vh"])

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full bg-black z-20"
      style={{
        // Height = (Number of cards + 1) * 100vh so they have room to stick and compress
        height: `${(profile.experience.length + 1) * 100}vh`
      }}
    >
      <div className="absolute top-0 left-0 bottom-0 w-full pointer-events-none z-0">
        <div className="sticky top-0 h-screen flex justify-center overflow-hidden w-full">
          <motion.h2
            style={{ y: headingY }}
            className="text-[12vw] font-bold tracking-tighter text-[#f5f5f7] uppercase select-none absolute"
          >
            EXPERIENCE
          </motion.h2>
        </div>
      </div>

      <div className="w-full h-full px-6 flex flex-col items-center relative z-10 pt-[20vh]">
        {profile.experience.map((exp, index) => (
          <ExperienceCard
            key={index}
            exp={exp}
            index={index}
            totalCards={profile.experience.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
      `}</style>
    </section>
  )
}
