'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useMotionValue, useAnimationFrame, useMotionValueEvent } from 'framer-motion'
import type { Project } from '@/lib/projects'
import { useIsMobile } from '@/lib/useIsMobile'

// Only mounts the active image. Uses a cheap blur-sm fill behind object-contain
// so there are no black bands and no expensive GPU blur compositing.
function AutoCarousel({ images, title }: { images: string[]; title: string }) {
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
          <img src={src} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110" alt="" aria-hidden />
          {/* Sharp foreground — contained so nothing is cropped */}
          <img src={src} className="absolute inset-0 w-full h-full object-contain" alt={`${title} screenshot ${index + 1}`} />
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
  project: Project
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

  // All 6 cards are always mounted (that's what makes the flip transform
  // work), but they don't all need to be loading video/images at once —
  // that was 2 autoplaying videos + 3 image carousels + a 6-image marquee
  // all fighting for bandwidth the instant the page loads, which is why
  // some images would time out or briefly show broken while queued behind
  // video downloads. Only mount media for the card that's actually active
  // or about to be, with a one-step buffer so the next card preloads
  // slightly ahead of when it flips into view.
  const buffer = seg
  const [isNearActive, setIsNearActive] = useState(projectIndex === 0)
  useMotionValueEvent(progress, 'change', (latest) => {
    setIsNearActive(latest >= cardAppear - buffer && latest <= cardFlip + buffer)
  })

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
          {!isNearActive ? null : project.video ? (
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={project.video} type="video/mp4" />
            </video>
          ) : project.marqueeImages ? (
            <MarqueeCarousel images={project.marqueeImages} />
          ) : project.images && project.images.length > 0 ? (
            <AutoCarousel images={project.images} title={project.title.split('—')[0].trim()} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-[15vw] md:text-[10vw] font-black text-[#ffffff05] uppercase tracking-tighter leading-none">
                {project.title.substring(0, 2)}
              </h3>
            </div>
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

// Simple static stacked list — no pinning, no perspective/3D flip, no
// scroll-linked background marquee text. Just cards you scroll past normally.
function ProjectCardStatic({ project, index }: { project: Project, index: number }) {
  const hasLive = project.links?.live && project.links.live !== '#'
  const hasGithub = project.links?.github && project.links.github !== '#'

  // The mobile carousel duplicates every card 6x for the infinite-drag
  // illusion, so up to 36 of these can exist in the DOM at once. Without
  // this, that's dozens of autoplaying videos and image carousels all
  // loading simultaneously regardless of whether they're ever scrolled to —
  // only mount media once this specific card is actually near the viewport.
  const mediaRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  useEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full h-full bg-[#121212] rounded-[2rem] border border-[#2a2a2a] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
      <div ref={mediaRef} className="relative w-full aspect-video bg-[#0a0a0a] shrink-0">
        {!isNearViewport ? null : project.video ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={project.video} type="video/mp4" />
          </video>
        ) : project.marqueeImages ? (
          <MarqueeCarousel images={project.marqueeImages} />
        ) : project.images && project.images.length > 0 ? (
          <AutoCarousel images={project.images} title={project.title.split('—')[0].trim()} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-[15vw] font-black text-[#ffffff08] uppercase tracking-tighter leading-none">
              {project.title.substring(0, 2)}
            </h3>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-6 flex-1">
        <span className="text-[#555] font-medium tracking-widest text-xs uppercase">
          0{index + 1}
        </span>
        <h3 className="text-3xl font-bold text-[#f5f5f7] tracking-tight leading-[1.1]">
          {project.title.split('—')[0].trim()}
        </h3>
        {project.description && (
          <p className="text-[#86868b] text-sm leading-relaxed">
            {project.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 5).map((t: string) => (
            <span key={t} className="px-3 py-1 text-xs font-medium bg-[#1c1c1c] text-[#888] rounded-lg border border-[#2c2c2c]">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-auto pt-4">
          {hasLive && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-[#f5f5f7] text-black font-semibold rounded-full text-sm tracking-tight"
            >
              Live Project
            </a>
          )}
          {hasGithub && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 border border-[#444] text-[#f5f5f7] font-semibold rounded-full text-sm tracking-tight"
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const displayProjects = projects
  // 6 sets to ensure massive buffer for momentum gliding
  const carouselItems = [...displayProjects, ...displayProjects, ...displayProjects, ...displayProjects, ...displayProjects, ...displayProjects]
  
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  
  const [isHovered, setIsHovered] = useState(false)
  const isDraggingRef = useRef(false)
  const isMomentumRef = useRef(false)
  const [setContentWidth, setSetContentWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        // The track has 6 sets. One set is 1/6th of the total width.
        setSetContentWidth(trackRef.current.scrollWidth / 6)
      }
    }
    updateWidth()
    // Small delay to ensure images/fonts are loaded
    const timeout = setTimeout(updateWidth, 100)
    window.addEventListener("resize", updateWidth)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", updateWidth)
    }
  }, [])

  useAnimationFrame((t, delta) => {
    if (isDraggingRef.current || isHovered) return

    // Let the native momentum spring finish naturally
    if (isMomentumRef.current) {
      if (Math.abs(x.getVelocity()) < 10) {
        isMomentumRef.current = false
      }
      return
    }

    // Normal auto-scroll
    if (setContentWidth > 0) {
      let moveBy = 1.0 * (delta / 16)
      x.set(x.get() - moveBy)
    }
  })

  useEffect(() => {
    return x.on("change", (latest) => {
      if (setContentWidth > 0) {
        // EXTREME BOUNDS (Prevent seeing empty space)
        // If they fling past the massive buffer, hard-wrap immediately.
        if (latest > 0) {
          x.set(latest - setContentWidth * 2)
        } else if (latest <= -setContentWidth * 5) {
          x.set(latest + setContentWidth * 2)
        }
        // SOFT BOUNDS (Invisible wrap)
        // Only wrap when auto-scrolling (NOT dragging and NOT gliding)
        // Keeps the position comfortably in the middle buffer (-2W to -3W).
        else if (!isDraggingRef.current && !isMomentumRef.current) {
          if (latest > -setContentWidth * 2) {
            x.set(latest - setContentWidth)
          } else if (latest <= -setContentWidth * 3) {
            x.set(latest + setContentWidth)
          }
        }
      }
    })
  }, [x, setContentWidth])

  const handleDragStart = () => {
    isDraggingRef.current = true
    isMomentumRef.current = false
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
    isMomentumRef.current = true
  }

  return (
    <section
      id="projects"
      className="relative z-30 bg-[#000] rounded-t-[3rem] border-t border-[#111] py-24 overflow-hidden"
    >
      <h2 className="text-5xl font-bold tracking-tighter text-[#fff] uppercase text-center mb-12 px-4">
        PROJECTS
      </h2>

      <div className="relative w-full flex flex-col gap-12 overflow-hidden">
        {/* Framer Motion Draggable Infinite Carousel */}
        <div 
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <motion.div 
            ref={trackRef}
            className="flex w-max"
            style={{ x }}
            drag="x"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragMomentum={true}
          >
            {carouselItems.map((project, i) => (
              <div key={i} className="w-[85vw] md:w-[450px] shrink-0 px-3 flex items-stretch">
                <ProjectCardStatic project={project} index={i % displayProjects.length} />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="w-full px-4">
          <div className="w-full max-w-[600px] mx-auto bg-[#121212] rounded-[2rem] border border-[#2a2a2a] p-8 text-center flex flex-col items-center gap-4">
            <h3 className="text-3xl font-bold text-[#f5f5f7] tracking-tight">
              More to Explore
            </h3>
            <p className="text-[#86868b] text-sm max-w-md">
              Check out the rest of my work spanning AI, full-stack development, AR/VR, and more.
            </p>
            <a
              href="/projects"
              className="px-7 py-3 bg-[#f5f5f7] text-black font-semibold rounded-full text-sm"
            >
              View All Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectsAnimated({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  const displayProjects = projects
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

export default function Projects({ projects }: { projects: Project[] }) {
  const isMobile = useIsMobile()
  return isMobile ? <ProjectsCarousel projects={projects} /> : <ProjectsAnimated projects={projects} />
}
