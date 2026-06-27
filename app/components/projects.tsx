'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion'
import { profile } from '@/data/profile'

// Only mounts the active image. Uses a cheap blur-sm fill behind object-contain
// so there are no black bands and no expensive GPU blur compositing.
function AutoCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [images])

  if (!images || images.length === 0) return null

  const src = images[index]

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-[#0a0a0a]">
      <AnimatePresence>
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Blurred fill — blur-sm is ~10x cheaper than blur-2xl */}
          <img src={src} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110" aria-hidden />
          {/* Sharp foreground — contained so nothing is cropped */}
          <img src={src} className="absolute inset-0 w-full h-full object-contain" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ProjectBackgroundText({ title, stepIndex, totalSteps, progress }: {
  title: string
  stepIndex: number
  totalSteps: number
  progress: MotionValue<number>
}) {
  const seg = 1 / totalSteps
  const start = stepIndex * seg
  const end = (stepIndex + 1) * seg

  const clipPath = useTransform(
    progress,
    [Math.max(0, start - 0.05), start, end - 0.05, end],
    ['inset(100% 0 0% 0)', 'inset(0% 0 0% 0)', 'inset(0% 0 0% 0)', 'inset(0% 0 100% 0)']
  )
  const y = useTransform(
    progress,
    [Math.max(0, start - 0.05), start, end - 0.05, end],
    ['50%', '0%', '0%', '-50%']
  )

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <motion.div
        style={{ clipPath, y }}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex items-center overflow-hidden"
      >
        <div className="flex w-max animate-marquee text-[15vw] font-black text-[#fff] whitespace-nowrap leading-none tracking-tighter">
          {[...Array(8)].map((_, i) => <span key={i} className="px-10">{title.toUpperCase()}</span>)}
        </div>
      </motion.div>
    </div>
  )
}

function MarqueeCarousel({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0ae6]">
      <div className="relative w-full h-full overflow-hidden flex justify-start items-center pl-[50%] mask-image-horizontal gap-4">
        <motion.div
          className="flex flex-row h-[80%] min-h-[140px] absolute left-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {/* First wrapper */}
          <div className="flex flex-row gap-4 pr-4 shrink-0 h-full">
            {images.map((src, i) => (
              <img key={`1-${i}`} src={src} alt="" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
            ))}
          </div>
          {/* Second wrapper for seamless looping */}
          <div className="flex flex-row gap-4 pr-4 shrink-0 h-full">
            {images.map((src, i) => (
              <img key={`2-${i}`} src={src} alt="" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
            ))}
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
    </div>
  )
}

function ProjectCard({ project, projectIndex, totalSteps, progress }: {
  project: any
  projectIndex: number
  totalSteps: number
  progress: MotionValue<number>
}) {
  const seg = 1 / totalSteps
  const stepIndex = projectIndex + 1
  const start = stepIndex * seg
  const end = (stepIndex + 1) * seg

  const cardAppear   = start
  const cardStraight = start + seg * 0.2
  const cardHold     = start + seg * 0.7
  const cardFlip     = end

  const rotateX = useTransform(
    progress,
    [Math.max(0, cardAppear - 0.01), cardAppear, cardStraight, cardHold, cardFlip, Math.min(1, cardFlip + 0.01)],
    [90, 90, 0, 0, -90, -90]
  )
  const opacity = useTransform(
    progress,
    [cardAppear, cardAppear + 0.01, cardFlip - 0.01, cardFlip],
    [0, 1, 1, 0]
  )
  const pointerEvents = useTransform(progress, (v) =>
    v >= cardStraight && v <= cardFlip ? 'auto' : 'none'
  )

  const hasLive   = project.links?.live   && project.links.live   !== '#'
  const hasGithub = project.links?.github && project.links.github !== '#'

  return (
    <motion.div
      style={{ rotateX, opacity, pointerEvents, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
      className="absolute inset-0 m-auto w-[88vw] md:w-[75vw] max-w-[1200px] h-[50vh] md:h-[52vh] flex flex-row bg-[#121212] rounded-[2rem] border border-[#2a2a2a] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden"
    >
      {/* Left — all content centered */}
      <div className="relative z-10 w-full md:w-[40%] flex flex-col justify-center gap-5 p-8 md:p-10">
        <div className="flex flex-col gap-3">
          <span className="text-[#555] font-medium tracking-widest text-xs uppercase">
            0{projectIndex + 1}
          </span>
          <h3 className="text-4xl md:text-5xl font-bold text-[#f5f5f7] tracking-tight leading-[1.1]">
            {project.title.split('—')[0].trim()}
          </h3>
          {project.description && (
            <p className="text-[#86868b] text-sm md:text-[15px] leading-relaxed line-clamp-3 max-w-sm">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 5).map((t: string) => (
            <span key={t} className="px-3 py-1 text-xs font-medium bg-[#1c1c1c] text-[#888] rounded-lg border border-[#2c2c2c]">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {hasLive && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3 bg-[#f5f5f7] text-black font-semibold rounded-full hover:bg-white transition-colors text-sm tracking-tight"
            >
              Live Project
            </a>
          )}
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3 border border-[#444] text-[#f5f5f7] font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors text-sm tracking-tight"
            >
              View Code
            </a>
          )}
        </div>
      </div>

      {/* Right — image panel */}
      <div className="hidden md:block w-[60%] h-full relative">
        {/* Vertical separator gradient */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 aspect-video rounded-[1.2rem] overflow-hidden border border-[#222] bg-[#0a0a0a]">
          {project.video ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={project.video} type="video/mp4" />
            </video>
          ) : project.marqueeImages ? (
            <MarqueeCarousel images={project.marqueeImages} />
          ) : (
            <AutoCarousel images={project.images} />
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CtaCard({ projectIndex, totalSteps, progress }: {
  projectIndex: number
  totalSteps: number
  progress: MotionValue<number>
}) {
  const seg = 1 / totalSteps
  const stepIndex = projectIndex + 1
  const start = stepIndex * seg
  const end = (stepIndex + 1) * seg

  const cardAppear   = start
  const cardStraight = start + seg * 0.2
  const cardHold     = start + seg * 0.7
  const cardFlip     = end

  const rotateX = useTransform(
    progress,
    [Math.max(0, cardAppear - 0.01), cardAppear, cardStraight, cardHold, cardFlip, Math.min(1, cardFlip + 0.01)],
    [90, 90, 0, 0, -90, -90]
  )
  const opacity = useTransform(
    progress,
    [cardAppear, cardAppear + 0.01, cardFlip - 0.01, cardFlip],
    [0, 1, 1, 0]
  )
  const pointerEvents = useTransform(progress, (v) =>
    v >= cardStraight && v <= cardFlip ? 'auto' : 'none'
  )

  return (
    <motion.div
      style={{ rotateX, opacity, pointerEvents, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
      className="absolute inset-0 m-auto w-[88vw] md:w-[60vw] max-w-[1000px] h-[45vh] md:h-[50vh] flex flex-col items-center justify-center gap-6 p-8 md:p-14 bg-[#121212] rounded-[2rem] border border-[#2a2a2a] shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f5f5f7] tracking-tight">
          More to Explore
        </h3>
        <p className="text-[#86868b] text-base md:text-lg max-w-md">
          Check out the rest of my work spanning AI, full-stack development, AR/VR, and more.
        </p>
        <a
          href="/projects"
          className="px-9 py-4 bg-[#f5f5f7] text-black font-semibold rounded-full hover:bg-white transition-colors text-base"
        >
          View All Projects
        </a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)

  const displayProjects = profile.projects.slice(0, 6)
  const totalCards = displayProjects.length + 1
  const totalSteps = totalCards + 1

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative z-30 bg-[#000] rounded-t-[3rem] border-t border-[#111]"
      style={{ height: `${totalSteps * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black"
        style={{ perspective: '1500px' }}
      >
        {/* Background marquee texts */}
        <ProjectBackgroundText title="PROJECTS" stepIndex={0} totalSteps={totalSteps} progress={scrollYProgress} />
        {displayProjects.map((project, i) => (
          <ProjectBackgroundText
            key={i}
            title={project.title.split('—')[0].trim()}
            stepIndex={i + 1}
            totalSteps={totalSteps}
            progress={scrollYProgress}
          />
        ))}
        <ProjectBackgroundText title="MORE PROJECTS" stepIndex={displayProjects.length + 1} totalSteps={totalSteps} progress={scrollYProgress} />

        {/* 3D flip cards — all always mounted, transforms are GPU-driven */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          {displayProjects.map((project, i) => (
            <ProjectCard
              key={i}
              project={project}
              projectIndex={i}
              totalSteps={totalSteps}
              progress={scrollYProgress}
            />
          ))}
          <CtaCard projectIndex={displayProjects.length} totalSteps={totalSteps} progress={scrollYProgress} />
        </div>
      </div>
    </section>
  )
}
