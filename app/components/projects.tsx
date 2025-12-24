'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const numProjects = profile.projects.length
  const segmentSize = 1 / (numProjects + 1)

  useEffect(() => {
    if (!containerRef.current || !aboutSectionRef.current || !aboutContentRef.current) return

    // Set up About section initially hidden
    gsap.set(aboutSectionRef.current, { opacity: 0 })
    gsap.set(aboutContentRef.current, { opacity: 0, y: 30 })
    gsap.set('.about-word-mask', { overflow: 'hidden' })
    gsap.set(
      ['.about-word-1', '.about-word-2', '.about-word-3', '.about-word-4'],
      { y: '100%' }
    )

    // EXACT timing from your working version
    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: `${(numProjects - 0.5) * segmentSize * 100}% top`,
        end: 'bottom top',
        scrub: 0.3,
        onEnter: () => {
          gsap.to(aboutSectionRef.current, { opacity: 1, duration: 0.2 })
        },
        onLeave: () => {
          gsap.set(aboutSectionRef.current, { opacity: 1 })
        },
        onEnterBack: () => {
          gsap.to(aboutSectionRef.current, { opacity: 1, duration: 0.2 })
        },
        onLeaveBack: () => {
          gsap.to(aboutSectionRef.current, { opacity: 0, duration: 0.2 })
          gsap.set(
            ['.about-word-1', '.about-word-2', '.about-word-3', '.about-word-4'],
            { y: '100%' }
          )
          gsap.set(aboutContentRef.current, { opacity: 0, y: 30 })
        }
      }
    })

    // Animate everything much faster and together
    aboutTimeline
      .to('.about-word-1', { y: '0%', duration: 0.2, ease: 'power2.out' })
      .to('.about-word-2', { y: '0%', duration: 0.2, ease: 'power2.out' }, '-=0.15')
      .to('.about-word-3', { y: '0%', duration: 0.2, ease: 'power2.out' }, '-=0.15')
      .to('.about-word-4', { y: '0%', duration: 0.2, ease: 'power2.out' }, '-=0.15')
      .to(
        aboutContentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        },
        '-=0.15'
      )

    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [numProjects, segmentSize])

  const sentences = profile.summary.split('. ').filter(s => s.length > 0)

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative bg-white"
      style={{ height: `${(numProjects + 2) * 120}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        
        {/* Projects Content */}
        <div className="w-full max-w-6xl lg:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 lg:pt-0 pb-10 sm:pb-12 lg:pb-0">
          <h2 className="text-center font-black text-gray-900 mb-6 sm:mb-8 md:mb-10 lg:mb-16 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl">
            SELECTED <span className="text-emerald-700">PROJECTS</span>
          </h2>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-center">
            {/* Left Side - Progressive Text Reveal */}
            <div className="relative h-[230px] xs:h-[250px] sm:h-[290px] md:h-[340px] lg:h-[500px]">
              {profile.projects.map((project, index) => {
                const start = index * segmentSize
                const end = (index + 1) * segmentSize
                
                const titleStart = start
                const descStart = start + segmentSize * 0.15
                const techStart = start + segmentSize * 0.3
                const linksStart = start + segmentSize * 0.45
                const fadeOutStart = end - segmentSize * 0.2
                
                return (
                  <ProjectTextContent
                    key={index}
                    project={project}
                    index={index}
                    numProjects={numProjects}
                    scrollYProgress={scrollYProgress}
                    titleStart={titleStart}
                    descStart={descStart}
                    techStart={techStart}
                    linksStart={linksStart}
                    fadeOutStart={fadeOutStart}
                    start={start}
                    end={end}
                  />
                )
              })}
            </div>

            {/* Right Side - Card */}
            <div
              className="relative h-[230px] xs:h-[250px] sm:h-[290px] md:h-[340px] lg:h-[500px] flex items-center justify-center"
              style={{ perspective: '1500px' }}
            >
              {profile.projects.map((project, index) => {
                const start = index * segmentSize
                const end = (index + 1) * segmentSize
                
              
                return (
                  <ProjectCard
                    key={index}
                    project={project}
                    index={index}
                    scrollYProgress={scrollYProgress}
                    start={start}
                    end={end}
                    segmentSize={segmentSize}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* About Section Overlay */}
        <div
          ref={aboutSectionRef}
          className="absolute inset-0 bg-white flex items-center opacity-0 overflow-y-auto"
        >
          <div className="px-3 sm:px-4 md:px-6 lg:px-16 xl:px-32 w-full py-10 sm:py-12 md:py-14 lg:py-16">
            <div className="max-w-6xl lg:max-w-7xl mx-auto">
              
              <h2 className="font-black text-gray-900 mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-3xl xs:text-[2.1rem] sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl">
                <div className="leading-[0.9]">
                  <span className="about-word-mask inline-block overflow-hidden">
                    <span className="about-word-1 inline-block">FULL-STACK</span>
                  </span>{' '}
                  <span className="about-word-mask inline-block overflow-hidden">
                    <span className="about-word-2 inline-block text-emerald-700">DEVELOPER.</span>
                  </span>
                </div>
                <div className="leading-[0.9] mt-1 sm:mt-2">
                  <span className="about-word-mask inline-block overflow-hidden">
                    <span className="about-word-3 inline-block">SOFTWARE</span>
                  </span>{' '}
                  <span className="about-word-mask inline-block overflow-hidden">
                    <span className="about-word-4 inline-block text-emerald-700">ENGINEER.</span>
                  </span>
                </div>
              </h2>

              <div ref={aboutContentRef} className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-12">
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  {sentences.map((sentence, index) => (
                    <p key={index} className="text-[12px] xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 text-left sm:text-justify leading-relaxed">
                      {sentence}{index < sentences.length - 1 ? '.' : ''}
                    </p>
                  ))}
                </div>
                <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-black">HIGHLIGHTS</h3>
                  {profile.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2.5 sm:gap-3 md:gap-4">
                      <span className="text-emerald-700 text-lg sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0">
                        →
                      </span>
                      <span className="text-[12px] xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer at the bottom */}
      <div className="h-[40vh]" aria-hidden="true" />
    </section>
  )
}

// Separate component for project text content
function ProjectTextContent({
  project,
  index,
  numProjects,
  scrollYProgress,
  titleStart,
  descStart,
  techStart,
  linksStart,
  fadeOutStart,
  start,
  end
}: {
  project: any
  index: number
  numProjects: number
  scrollYProgress: any
  titleStart: number
  descStart: number
  techStart: number
  linksStart: number
  fadeOutStart: number
  start: number
  end: number
}) {
  // All useTransform hooks at the top level of this component
  const titleOpacity = useTransform(
    scrollYProgress,
    [titleStart, titleStart + 0.02, fadeOutStart, end],
    [0, 1, 1, 0]
  )
  
  const titleY = useTransform(
    scrollYProgress,
    [titleStart, titleStart + 0.02, fadeOutStart, end],
    [16, 0, 0, -16]
  )
  
  const descOpacity = useTransform(
    scrollYProgress,
    [descStart, descStart + 0.02, fadeOutStart, end],
    [0, 1, 1, 0]
  )
  
  const descY = useTransform(
    scrollYProgress,
    [descStart, descStart + 0.02, fadeOutStart, end],
    [16, 0, 0, -16]
  )
  
  const techOpacity = useTransform(
    scrollYProgress,
    [techStart, techStart + 0.02, fadeOutStart, end],
    [0, 1, 1, 0]
  )
  
  const techY = useTransform(
    scrollYProgress,
    [techStart, techStart + 0.02, fadeOutStart, end],
    [16, 0, 0, -16]
  )
  
  const linksOpacity = useTransform(
    scrollYProgress,
    [linksStart, linksStart + 0.02, fadeOutStart, end],
    [0, 1, 1, 0]
  )
  
  const linksY = useTransform(
    scrollYProgress,
    [linksStart, linksStart + 0.02, fadeOutStart, end],
    [16, 0, 0, -16]
  )

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center space-y-1.5 xs:space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6"
      style={{
        pointerEvents:
          scrollYProgress.get() >= start &&
          scrollYProgress.get() < fadeOutStart
            ? 'auto'
            : 'none'
      }}
    >
      <motion.span
        className="block font-mono text-[10px] xs:text-[11px] sm:text-xs text-gray-400"
        style={{ opacity: titleOpacity }}
      >
        0{index + 1} / 0{numProjects}
      </motion.span>
      
      <motion.h3
        className="font-black text-gray-900 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-5xl leading-tight"
        style={{ opacity: titleOpacity, y: titleY }}
      >
        {project.title}
      </motion.h3>
      
      <motion.p
        className="text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-snug sm:leading-relaxed max-w-xl"
        style={{ opacity: descOpacity, y: descY }}
      >
        {project.description}
      </motion.p>
      
      {project.impact && (
        <motion.p
          className="text-emerald-700 font-semibold text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg"
          style={{ opacity: descOpacity }}
        >
          ↗ {project.impact}
        </motion.p>
      )}

      <motion.div
        className="flex flex-wrap gap-1.5 sm:gap-2"
        style={{ opacity: techOpacity, y: techY }}
      >
        {project.tech.map((tech: string, i: number) => (
          <span
            key={i}
            className="px-2.5 sm:px-3 py-1 bg-gray-100 text-[10px] xs:text-[11px] sm:text-xs font-medium rounded-full"
          >
            {tech}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2"
        style={{ opacity: linksOpacity, y: linksY }}
      >
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-900 font-bold hover:text-emerald-700 transition-colors"
          >
            VIEW CODE →
          </a>
        )}
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] xs:text-xs sm:text-sm md:text-base text-gray-900 font-bold hover:text-emerald-700 transition-colors"
          >
            LIVE DEMO →
          </a>
        )}
      </motion.div>
    </div>
  )
}

// Separate component for project card
function ProjectCard({
  project,
  index,
  scrollYProgress,
  start,
  end,
  segmentSize
}: {
  project: any
  index: number
  scrollYProgress: any
  start: number
  end: number
  segmentSize: number
}) {
  const cardAppear = start
  const cardStraight = start + segmentSize * 0.2
  const cardHold = start + segmentSize * 0.7
  const cardFlip = end

  // All useTransform hooks at the top level
  const rotateX = useTransform(
    scrollYProgress,
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

  const cardOpacity = useTransform(
    scrollYProgress,
    [
      cardAppear,
      cardAppear + 0.01,
      cardFlip - 0.01,
      cardFlip
    ],
    [0, 1, 1, 0]
  )

  return (
    <motion.div
      className="absolute inset-0 px-1.5 xs:px-2 sm:px-3 lg:px-0"
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        opacity: cardOpacity,
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/20 font-black select-none text-[2.7rem] xs:text-[3.2rem] sm:text-[3.8rem] md:text-[4.6rem] lg:text-[200px]">
            0{index + 1}
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 lg:py-6 bg-gradient-to-t from-black/60 to-transparent">
          <h4 className="font-bold text-white mb-0.5 xs:mb-1 sm:mb-1.5 text-sm xs:text-[15px] sm:text-base md:text-xl lg:text-3xl">
            {project.title}
          </h4>
          <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base text-white/80">
            {project.tech.slice(0, 3).join(' • ')}
          </p>
        </div>

        <div className="absolute top-3 right-3 xs:top-4 xs:right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 lg:top-8 lg:right-8 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-xl lg:blur-3xl" />
      </div>
    </motion.div>
  )
}
