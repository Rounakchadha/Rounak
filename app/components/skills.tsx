'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { profile } from '@/data/profile'
import { useIsMobile } from '@/lib/useIsMobile'
import {
  PenLine,
  Database,
  Share2,
  LayoutTemplate,
  Zap,
  Code2,
  Search,
  Frame,
  Bot,
  LayoutDashboard
} from 'lucide-react'

function DraggableMarquee({ children, speed = 1.0, direction = "left", reverseOffset = false }: any) {
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const [isHovered, setIsHovered] = useState(false)
  const isDraggingRef = useRef(false)
  const isMomentumRef = useRef(false)
  const isInViewRef = useRef(false)
  const [setContentWidth, setSetContentWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (trackRef.current) {
        // We render 6 sets, so one set is scrollWidth / 6
        setSetContentWidth(trackRef.current.scrollWidth / 6)
      }
    }
    updateWidth()
    const timeout = setTimeout(updateWidth, 100)
    window.addEventListener("resize", updateWidth)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", updateWidth)
    }
  }, [])

  // This autoplay loop otherwise runs on every animation frame for the
  // component's entire mounted lifetime — never pausing even when scrolled
  // far away — which means it's permanently competing with the browser for
  // main-thread time during every scroll gesture on the page, not just while
  // this marquee is visible. Gating it to only run near the viewport doesn't
  // change anything about how it looks or moves while actually in view.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { isInViewRef.current = entry.isIntersecting },
      { rootMargin: '200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useAnimationFrame((t, delta) => {
    if (!isInViewRef.current || isDraggingRef.current || isHovered) return

    // Let the native momentum spring finish naturally
    if (isMomentumRef.current) {
      if (Math.abs(x.getVelocity()) < 10) {
        isMomentumRef.current = false
      }
      return
    }

    // Normal auto-scroll
    if (setContentWidth > 0) {
      let moveBy = speed * (delta / 16)
      if (direction === "right") {
        x.set(x.get() + moveBy)
      } else {
        x.set(x.get() - moveBy)
      }
    }
  })

  useEffect(() => {
    return x.on("change", (latest) => {
      if (setContentWidth > 0) {
        let v = x.getVelocity()

        if (latest > -setContentWidth) {
          x.set(latest - setContentWidth * 2)
        } else if (latest <= -setContentWidth * 4) {
          x.set(latest + setContentWidth * 2)
        }
        else if (Math.abs(v) < 150 && !isDraggingRef.current) {
          if (latest > -setContentWidth * 2) {
            x.set(latest - setContentWidth)
          } else if (latest <= -setContentWidth * 3) {
            x.set(latest + setContentWidth)
          }
        }
      }
    })
  }, [x, setContentWidth])

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <motion.div 
        ref={trackRef}
        className="flex w-max"
        style={{ x, marginLeft: reverseOffset ? '-50vw' : '0' }}
        drag="x"
        onDragStart={() => {
          isDraggingRef.current = true
          isMomentumRef.current = false
        }}
        onDragEnd={() => {
          isDraggingRef.current = false
          isMomentumRef.current = true
        }}
        dragMomentum={true}
      >
        {children}
      </motion.div>
    </div>
  )
}

function MobileMarqueeRow({ items, direction, speed, reverseOffset }: any) {
  const allItems = [...items, ...items, ...items, ...items, ...items, ...items]
  return (
    <DraggableMarquee direction={direction} speed={speed} reverseOffset={reverseOffset}>
      {allItems.map((pill: any, index: number) => {
        const Icon = pill.icon
        return (
          <div
            key={`row-${pill.name}-${index}`}
            className="px-6 py-3 mx-2.5 rounded-full bg-[#1a1a1c] border border-[#333] text-[#c1c1c6] text-sm md:text-base font-semibold whitespace-nowrap flex items-center gap-3 transition-colors hover:bg-[#222] hover:border-[#555] hover:text-[#f5f5f7]"
          >
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#86868b]" strokeWidth={2} />
            {pill.name}
          </div>
        )
      })}
    </DraggableMarquee>
  )
}

export default function Skills() {
  const isMobile = useIsMobile()
  const servicePills = [
    { name: "Copywriting", icon: PenLine },
    { name: "CMS Setup", icon: Database },
    { name: "n8n Workflows", icon: Share2 },
    { name: "Wireframing", icon: LayoutTemplate },
    { name: "Optimization", icon: Zap },
    { name: "Custom Code", icon: Code2 },
    { name: "SEO", icon: Search },
    { name: "Framer Expert", icon: Frame },
    { name: "WhatsApp Bots", icon: Bot },
    { name: "Landing Pages", icon: LayoutDashboard },
  ]

  return (
    <section
      id="services"
      className="relative z-40 bg-[#0a0a0a] overflow-hidden"
    >
      {/* Bento box — sized to fill the screen below the sticky navbar on desktop so
          it reads as one complete frame instead of spilling past the fold. */}
      <div className="w-full lg:h-[calc(100vh-80px)] lg:min-h-[640px] flex flex-col justify-center px-6 md:px-12 xl:px-24 py-8 lg:py-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="w-full shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end mb-5 md:mb-8 gap-4"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#f5f5f7] whitespace-nowrap">
            How I Can Help Your Business
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#333] bg-black px-7 py-3 text-sm md:text-base font-semibold transition-all duration-500 hover:bg-[#f5f5f7] shrink-0"
          >
            <div className="relative flex overflow-hidden">
              <span className="inline-block text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%] md:group-hover:-translate-y-[120%]">
                Get in Touch ↗
              </span>
              <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 md:group-hover:translate-y-0">
                Get in Touch ↗
              </span>
            </div>
          </a>
        </motion.div>

        {/* Bento Grid layout based on the reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 w-full lg:flex-1 lg:min-h-0">

          {/* Left Column */}
          <div className="flex flex-col gap-4 lg:gap-5 lg:h-full">

            {/* Top Left: Large Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-7 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col flex-1 min-h-[280px] lg:min-h-0"
            >
              <div className="flex items-center gap-3 mb-3 relative z-10 shrink-0">
                <span className="text-2xl text-[#f5f5f7]">
                  ✨
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  UI/UX & Interactive Design
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed mb-4 relative z-10 max-w-lg shrink-0">
                Crafting pixel-perfect, engaging interfaces with complex animations and 3D rendering (Three.js/WebXR) that captivate and convert users.
              </p>
              {/* Video */}
              <div className="w-full flex-1 min-h-[90px] rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-[#222] relative overflow-hidden group-hover:border-[#333] transition-colors duration-500 flex items-center justify-center p-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-2xl"
                >
                  <source src="/infra.webm" type="video/webm" />
                  <source src="/infra.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            </motion.div>

            {/* Bottom Left: Small Text Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-7 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col justify-center min-h-[150px]"
            >
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <span className="text-2xl text-[#f5f5f7]">
                  🌐
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  Full-Stack Web Development
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed relative z-10 max-w-lg">
                Building high-performance, scalable web applications with React, Next.js, and modern backends. Combining aesthetic design with robust API integration.
              </p>
            </motion.div>

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 lg:gap-5 lg:h-full">

            {/* Top Right: Text Card with small image area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.04 }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-7 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col justify-center min-h-[150px]"
            >
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <span className="text-2xl text-[#f5f5f7]">
                  ☁️
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  DevOps & Cloud Infrastructure
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed relative z-10 max-w-lg">
                Deploying robust, secure, and optimized architectures using modern CI/CD pipelines, Docker, and reliable cloud hosting.
              </p>
            </motion.div>

            {/* Bottom Right: Tall Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-7 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col flex-1 min-h-[280px] lg:min-h-0"
            >
              <div className="flex items-center gap-3 mb-3 relative z-10 shrink-0">
                <span className="text-2xl text-[#f5f5f7]">
                  🤖
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  AI & Automation Systems
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed mb-4 relative z-10 max-w-lg shrink-0">
                Designing smart chatbot integrations and RAG pipelines for intelligent, automated workflows to streamline your business operations.
              </p>
              {/* Marquee Carousel for AI & Automation */}
              <div className="w-full flex-1 min-h-[90px] rounded-2xl bg-[#0a0a0ae6] border border-[#222] relative overflow-hidden group-hover:border-[#333] transition-colors duration-500 flex items-center justify-center p-3">
                {/* Horizontal Scrolling Marquee container */}
                <div className="relative w-full h-full overflow-hidden flex justify-start items-center pl-[50%] mask-image-horizontal gap-4">
                  <motion.div
                    className="flex flex-row h-[80%] absolute left-0"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: 15,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    {/* First wrapper */}
                    <div className="flex flex-row gap-4 pr-4 shrink-0 h-full">
                      <img src="/assets/ai_demo_1.jpg" alt="AI Chatbot Demo" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                      <img src="/assets/ai_demo_2.jpg" alt="AI Interface" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                      <img src="/assets/ai_demo_3.png" alt="Automation Workflow" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    </div>
                    {/* Second wrapper for seamless looping */}
                    <div className="flex flex-row gap-4 pr-4 shrink-0 h-full">
                      <img src="/assets/ai_demo_1.jpg" alt="AI Chatbot Demo" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                      <img src="/assets/ai_demo_2.jpg" alt="AI Interface" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                      <img src="/assets/ai_demo_3.png" alt="Automation Workflow" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    </div>
                  </motion.div>
                </div>
                {/* Left/Right Gradient Overlays for smooth fade out */}
                <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0a0a0ae6] to-transparent z-10 pointer-events-none rounded-l-2xl" />
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0a0ae6] to-transparent z-10 pointer-events-none rounded-r-2xl" />
              </div>
            </motion.div>

          </div>

        </div>

      </div>

      {/* Infinite Scrolling Marquee for Services — deliberately outside the
          viewport-fit wrapper above; it's free to flow below the fold. */}
      <div className="w-full relative py-6 bg-[#0a0a0a] flex flex-col gap-3 overflow-hidden">
        {/* Gradients to fade the edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {isMobile ? (
          <>
            <MobileMarqueeRow items={servicePills} direction="left" speed={1.0} />
            <MobileMarqueeRow items={[...servicePills].reverse()} direction="right" speed={1.0} reverseOffset={true} />
          </>
        ) : (
          <>
            {/* Row 1: Moving Left */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-default" style={{ animationDuration: '50s' }}>
              {/* Double the array to ensure seamless looping without visual jumps */}
              {[...servicePills, ...servicePills, ...servicePills].map((pill, index) => {
                const Icon = pill.icon
                return (
                  <div
                    key={`row1-${pill.name}-${index}`}
                    className="px-6 py-3 mx-2.5 rounded-full bg-[#1a1a1c] border border-[#333] text-[#c1c1c6] text-sm md:text-base font-semibold whitespace-nowrap flex items-center gap-3 transition-colors hover:bg-[#222] hover:border-[#555] hover:text-[#f5f5f7]"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#86868b]" strokeWidth={2} />
                    {pill.name}
                  </div>
                )
              })}
            </div>

            {/* Row 2: Moving Right */}
            <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused] cursor-default ml-[-50vw]" style={{ animationDuration: '55s' }}>
              {/* Reverse the pills for variety */}
              {[...servicePills].reverse().concat([...servicePills].reverse(), [...servicePills].reverse()).map((pill, index) => {
                const Icon = pill.icon
                return (
                  <div
                    key={`row2-${pill.name}-${index}`}
                    className="px-6 py-3 mx-2.5 rounded-full bg-[#1a1a1c] border border-[#333] text-[#c1c1c6] text-sm md:text-base font-semibold whitespace-nowrap flex items-center gap-3 transition-colors hover:bg-[#222] hover:border-[#555] hover:text-[#f5f5f7]"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#86868b]" strokeWidth={2} />
                    {pill.name}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
