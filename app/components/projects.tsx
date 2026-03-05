'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { profile } from '@/data/profile'
import Link from 'next/link'

function ProjectBackgroundText({ title, stepIndex, totalSteps, progress }: { title: string, stepIndex: number, totalSteps: number, progress: MotionValue<number> }) {
  const segmentSize = 1 / totalSteps
  const start = stepIndex * segmentSize
  const end = (stepIndex + 1) * segmentSize

  // Clip path mask
  const clipPath = useTransform(
    progress,
    [
      Math.max(0, start - 0.05),
      start,
      end - 0.05,
      end
    ],
    [
      "inset(100% 0 0% 0)", // Enters from bottom reveal
      "inset(0% 0 0% 0)",   // Fully visible
      "inset(0% 0 0% 0)",   // Fully visible
      "inset(0% 0 100% 0)"  // Exits top masking
    ]
  )

  const y = useTransform(
    progress,
    [
      Math.max(0, start - 0.05),
      start,
      end - 0.05,
      end
    ],
    [
      "50%",   // Enters from slightly below
      "0%",    // Centered
      "0%",    // Centered
      "-50%"   // Exits moving up
    ]
  )

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <motion.div
        style={{ clipPath, y }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex items-center overflow-hidden"
      >
        <div
          className="flex w-max animate-marquee text-[15vw] font-black text-[#fff] whitespace-nowrap leading-none tracking-tighter"
        >
          {[...Array(8)].map((_, i) => <span key={i} className="px-10">{title.toUpperCase()}</span>)}
        </div>
      </motion.div>
    </div>
  )
}

function ProjectCard({ project, projectIndex, totalSteps, progress }: { project: any, projectIndex: number, totalSteps: number, progress: MotionValue<number> }) {
  const segmentSize = 1 / totalSteps
  // The first step (stepIndex = 0) is the "PROJECTS" heading, so the cards start at stepIndex >= 1
  const stepIndex = projectIndex + 1

  const start = stepIndex * segmentSize
  const end = (stepIndex + 1) * segmentSize

  const cardAppear = start
  const cardStraight = start + segmentSize * 0.2
  const cardHold = start + segmentSize * 0.7
  const cardFlip = end

  const rotateX = useTransform(
    progress,
    [
      Math.max(0, cardAppear - 0.01),
      cardAppear,
      cardStraight,
      cardHold,
      cardFlip,
      Math.min(1, cardFlip + 0.01)
    ],
    [90, 90, 0, 0, -90, -90]
  )

  const opacity = useTransform(
    progress,
    [
      cardAppear,
      cardAppear + 0.01,
      cardFlip - 0.01,
      cardFlip
    ],
    [0, 1, 1, 0]
  )

  const pointerEvents = useTransform(
    progress,
    (v) => (v >= cardStraight && v <= cardHold) ? 'auto' : 'none'
  )

  const projectUrl = `/project/${project.title.split('—')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <motion.div
      style={{ rotateX, opacity, pointerEvents, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      className="absolute inset-0 m-auto w-[90vw] md:w-[60vw] max-w-[900px] h-[50vh] md:h-[60vh] flex flex-col justify-center p-8 md:p-12 bg-[#121212] rounded-[2rem] border border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]" />

      <div className="relative z-10 flex flex-col h-full justify-center">
        <div>
          <span className="text-[#86868b] font-medium tracking-widest text-sm uppercase mb-3 block">
            0{projectIndex + 1} — {project.tech.slice(0, 3).join(' / ')}
          </span>
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#f5f5f7] tracking-tight max-w-2xl leading-tight">
            {project.title.split('—')[0].trim()}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-[#f5f5f7] text-black font-semibold text-center rounded-full hover:bg-white transition-colors"
            >
              View Live Project
            </a>
          )}

          <Link
            href={projectUrl}
            className="px-8 py-4 bg-transparent border border-[#555] text-[#f5f5f7] font-semibold text-center rounded-full hover:bg-[#1a1a1a] transition-colors"
          >
            Project Description
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const totalCards = profile.projects.length

  // We add 1 to the steps so the first step (0) is simply the "PROJECTS" heading before any cards appear.
  const totalSteps = totalCards + 1

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // To make the background heading "PROJECTS" static while wait to scroll, we can just use the exact logic of the cards but for title.
  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative z-30 bg-[#000] rounded-t-[3rem] border-t border-[#111]"
      style={{ height: `${totalSteps * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black" style={{ perspective: '1500px' }}>

        {/* Render the initial "PROJECTS" heading text at stepIndex=0 */}
        <ProjectBackgroundText
          title="PROJECTS"
          stepIndex={0}
          totalSteps={totalSteps}
          progress={scrollYProgress}
        />

        {/* Render all individual project background texts, masked from bottom to top */}
        {profile.projects.map((project, index) => (
          <ProjectBackgroundText
            key={index}
            title={project.title.split('—')[0].trim()}
            stepIndex={index + 1}
            totalSteps={totalSteps}
            progress={scrollYProgress}
          />
        ))}

        {/* 3D Flipping Cards Container */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {profile.projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              projectIndex={index}
              totalSteps={totalSteps}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
