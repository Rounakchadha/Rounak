'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
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

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Deep parallax for the background grid to give it an immense sense of scale
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const services = [
    {
      title: "UI/UX & Interactive Design",
      description: "Crafting pixel-perfect, engaging interfaces with complex animations and 3D rendering (Three.js/WebXR) that captivate and convert users.",
      span: "lg:col-span-8",
      icon: "✨",
      hasImage: true,
    },
    {
      title: "DevOps & Cloud Infrastructure",
      description: "Deploying robust, secure, and optimized architectures using modern CI/CD pipelines, Docker, and reliable cloud hosting.",
      span: "lg:col-span-4",
      icon: "☁️",
      hasImage: false,
    },
    {
      title: "Full-Stack Web Development",
      description: "Building high-performance, scalable web applications with React, Next.js, and modern backends. Combining aesthetic design with robust API integration.",
      span: "lg:col-span-4",
      icon: "🌐",
      hasImage: false,
    },
    {
      title: "AI & Automation Systems",
      description: "Designing smart chatbot integrations and RAG pipelines for intelligent, automated workflows to streamline your business operations.",
      span: "lg:col-span-8",
      icon: "🤖",
      hasImage: true,
    }
  ]

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
      id="skills"
      ref={ref}
      className="relative z-40 bg-[#0a0a0a] overflow-hidden py-10 md:py-16 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
    >
      <div className="w-full mx-auto px-6 md:px-12 xl:px-24 relative z-10 flex flex-col items-center">

        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <motion.h2
            style={{ opacity }}
            className="text-[7.5vw] md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#f5f5f7] whitespace-nowrap"
          >
            How I Can Help Your Business
          </motion.h2>
          <a
            href={`mailto:${profile.email}`}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#333] bg-black px-10 py-4 text-base md:text-lg font-semibold transition-all duration-500 hover:bg-[#f5f5f7] shrink-0"
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
        </div>

        {/* Bento Grid layout based on the reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10">

          {/* Left Column */}
          <div className="flex flex-col gap-6">

            {/* Top Left: Large Image Card */}
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0.1, 0.3], [50, 0]), opacity: useTransform(scrollYProgress, [0.1, 0.3], [0, 1]) }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col flex-1 min-h-[400px]"
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <span className="text-2xl text-[#f5f5f7]">
                  ✨
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  UI/UX & Interactive Design
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed mb-6 relative z-10 max-w-lg">
                Crafting pixel-perfect, engaging interfaces with complex animations and 3D rendering (Three.js/WebXR) that captivate and convert users.
              </p>
              {/* Video Player */}
              <div className="w-full mt-auto h-48 md:h-64 rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-[#222] relative overflow-hidden group-hover:border-[#333] transition-colors duration-500 flex items-center justify-center p-0">
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
              style={{ y: useTransform(scrollYProgress, [0.15, 0.35], [50, 0]), opacity: useTransform(scrollYProgress, [0.15, 0.35], [0, 1]) }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col justify-center min-h-[250px]"
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
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
          <div className="flex flex-col gap-6">

            {/* Top Right: Text Card with small image area */}
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0.2, 0.4], [50, 0]), opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]) }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col min-h-[300px]"
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <span className="text-2xl text-[#f5f5f7]">
                  ☁️
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  DevOps & Cloud Infrastructure
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed mb-6 relative z-10 max-w-lg">
                Deploying robust, secure, and optimized architectures using modern CI/CD pipelines, Docker, and reliable cloud hosting.
              </p>
            </motion.div>

            {/* Bottom Right: Tall Image Card */}
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0.25, 0.45], [50, 0]), opacity: useTransform(scrollYProgress, [0.25, 0.45], [0, 1]) }}
              className="bg-[#121212] border border-[#222] rounded-3xl p-6 md:p-8 transition-all duration-500 hover:bg-[#151515] hover:border-[#444] group flex flex-col flex-1 min-h-[450px]"
            >
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <span className="text-2xl text-[#f5f5f7]">
                  🤖
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#f5f5f7] tracking-tight">
                  AI & Automation Systems
                </h3>
              </div>
              <p className="text-[#86868b] text-sm md:text-base leading-relaxed mb-6 relative z-10 max-w-lg">
                Designing smart chatbot integrations and RAG pipelines for intelligent, automated workflows to streamline your business operations.
              </p>
              {/* Tall Image Placeholder with Animated Carousel */}
              <div className="w-full mt-auto h-64 md:h-80 rounded-2xl bg-[#0a0a0ae6] border border-[#222] relative overflow-hidden group-hover:border-[#333] transition-colors duration-500 flex items-center justify-center p-4">
                {/* Horizontal Scrolling Marquee container */}
                <div className="relative w-full h-full overflow-hidden flex justify-start items-center pl-[50%] mask-image-horizontal gap-4">
                  <motion.div
                    className="flex flex-row gap-4 h-[80%] min-h-[140px] absolute left-0"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: 15,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    {/* First set of images */}
                    <img src="/assets/ai_demo_1.jpg" alt="AI Chatbot Demo" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    <img src="/assets/ai_demo_2.jpg" alt="AI Interface" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    <img src="/assets/ai_demo_3.png" alt="Automation Workflow" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    {/* Duplicate set for seamless looping */}
                    <img src="/assets/ai_demo_1.jpg" alt="AI Chatbot Demo" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    <img src="/assets/ai_demo_2.jpg" alt="AI Interface" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
                    <img src="/assets/ai_demo_3.png" alt="Automation Workflow" className="h-full w-auto rounded-xl object-cover border border-[#222] shadow-2xl" />
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

      {/* Infinite Scrolling Marquee for Services */}
      <div className="w-full relative py-8 bg-[#0a0a0a] flex flex-col gap-4 overflow-hidden">
        {/* Gradients to fade the edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Row 1: Moving Left */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-default" style={{ animationDuration: '50s' }}>
          {/* Double the array to ensure seamless looping without visual jumps */}
          {[...servicePills, ...servicePills, ...servicePills].map((pill, index) => {
            const Icon = pill.icon
            return (
              <div
                key={`row1-${pill.name}-${index}`}
                className="px-8 py-4 mx-3 rounded-full bg-[#1a1a1c] border border-[#333] text-[#c1c1c6] text-base font-semibold whitespace-nowrap flex items-center gap-4 transition-colors hover:bg-[#222] hover:border-[#555] hover:text-[#f5f5f7]"
              >
                <Icon className="w-5 h-5 text-[#86868b]" strokeWidth={2} />
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
                className="px-8 py-4 mx-3 rounded-full bg-[#1a1a1c] border border-[#333] text-[#c1c1c6] text-base font-semibold whitespace-nowrap flex items-center gap-4 transition-colors hover:bg-[#222] hover:border-[#555] hover:text-[#f5f5f7]"
              >
                <Icon className="w-5 h-5 text-[#86868b]" strokeWidth={2} />
                {pill.name}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
