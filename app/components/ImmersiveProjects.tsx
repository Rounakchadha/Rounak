// app/components/ImmersiveProjects.tsx
'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: "VoxAssist AI",
    subtitle: "Intelligent IVR Agent",
    description: "Voice-based interactive system for automated customer support.",
    color: "#00F5FF",
    image: "/projects/propbot-ai.jpg"
  },
  {
    title: "EngageIQ",
    subtitle: "Analytics Platform",
    description: "Advanced analytics platform for deep user engagement insights.",
    color: "#FF006E",
    image: "/projects/insight-crm.jpg"
  },
  {
    title: "PropBot AI",
    subtitle: "Real Estate Intelligence",
    description: "Conversational AI chatbot for property discovery and ROI.",
    color: "#8338EC",
    image: "/projects/propbot-ai.jpg"
  },
  {
    title: "CerviCare",
    subtitle: "AI-Powered Healthcare",
    description: "Revolutionary cervical cancer awareness platform.",
    color: "#FFBE0B",
    image: "/projects/cervicare.jpg"
  },
  {
    title: "Deepfake Detection",
    subtitle: "Neural Networks",
    description: "93% accuracy in real-time deepfake media detection.",
    color: "#FB5607",
    image: "/projects/deepfake.jpg"
  },
  {
    title: "AR/VR Tour",
    subtitle: "Immersive Experiences",
    description: "Web-based AR/VR house-tour for 360° panoramic properties.",
    color: "#3A86FF",
    image: "/projects/ar-vr-house-tour.jpg"
  }
]

export default function ImmersiveProjects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const projectRefs = useRef<HTMLDivElement[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate projects
      projectRefs.current.forEach((project, index) => {
        ScrollTrigger.create({
          trigger: project,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          scrub: 1,
        })

        const image = project.querySelector('.project-image')
        gsap.fromTo(image,
          { scale: 1.5, y: -100 },
          {
            scale: 1,
            y: 100,
            scrollTrigger: {
              trigger: project,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        )

        const title = project.querySelector('.project-title')
        const content = project.querySelector('.project-content')
        
        gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        })
        .fromTo(title, 
          { x: -200, opacity: 0 },
          { x: 0, opacity: 1 }
        )
        .fromTo(content,
          { x: 200, opacity: 0 },
          { x: 0, opacity: 1 },
          '-=0.5'
        )
      })

      // Animate CTA Slide
      if (ctaRef.current) {
        ScrollTrigger.create({
          trigger: ctaRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          scrub: 1,
        })
        
        gsap.fromTo(ctaRef.current.querySelector('.cta-content'),
          { scale: 0.8, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 60%',
              end: 'top 20%',
              scrub: 1
            }
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative bg-black">
      {projects.map((project, index) => (
        <div
          key={index}
          ref={el => projectRefs.current[index] = el!}
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: project.color + '10' }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 project-image">
            <div className="relative w-full h-full opacity-20">
              <div 
                className="absolute inset-0 bg-gradient-to-b from-transparent to-black"
                style={{ backgroundColor: project.color + '40' }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="project-title">
              <h2 
                className="text-6xl md:text-8xl font-bold mb-4"
                style={{ color: project.color }}
              >
                {project.title}
              </h2>
              <p className="text-2xl text-gray-300 mb-2">{project.subtitle}</p>
            </div>
            
            <div className="project-content">
              <p className="text-xl text-gray-400 mb-8">{project.description}</p>
              <button 
                className="px-8 py-4 border-2 text-white hover:scale-105 transition-transform"
                style={{ borderColor: project.color }}
              >
                View Project
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* View All Projects CTA Slide */}
      <div 
        ref={ctaRef} 
        className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-black to-black" />
        </div>
        
        <div className="cta-content relative z-10 text-center max-w-4xl px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            More to Explore
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-12">
            I have worked on a diverse range of projects spanning AI, AR/VR, Fintech, and Full-Stack Web Development.
          </p>
          <Link href="/projects" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
            <span className="mr-2">View All Projects</span>
            <svg className="w-5 h-5 transition-transform duration-200 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
