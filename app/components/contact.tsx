'use client'

import { useRef, useEffect } from 'react'
import { profile } from '@/data/profile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !pillRef.current || !bgRef.current) return

    const ctx = gsap.context(() => {
      // Text animations
      gsap.to('.tech-text-row-1', {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1
      })

      gsap.fromTo('.tech-text-row-2', 
        { xPercent: -50 },
        { 
          xPercent: 0,
          duration: 50,
          ease: 'none',
          repeat: -1
        }
      )

      gsap.to('.tech-text-row-3', {
        xPercent: -50,
        duration: 35,
        ease: 'none',
        repeat: -1
      })

      gsap.fromTo('.tech-text-row-4', 
        { xPercent: -50 },
        { 
          xPercent: 0,
          duration: 60,
          ease: 'none',
          repeat: -1
        }
      )

      gsap.to('.tech-text-row-5', {
        xPercent: -50,
        duration: 45,
        ease: 'none',
        repeat: -1
      })

      // Main scroll scene for morphing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
        }
      })

      // Initial states
      gsap.set(pillRef.current, {
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
      })
      gsap.set(bgRef.current, { backgroundColor: '#1e40af' })
      gsap.set('.mask-line', { yPercent: 100, opacity: 0 })
      
      // Button: set it hidden initially, no transform tricks
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { 
          opacity: 0,
          force3D: true
        })
      }
      gsap.set('.contact-info', { y: 20, opacity: 0 })

      // Timeline - Responsive pill size
      const isMobile = window.innerWidth < 768
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      
      let pillWidth = '70vw'
      let pillHeight = '50vh'
      
      if (isMobile) {
        pillWidth = '85vw'
        pillHeight = '65vh'
      } else if (isTablet) {
        pillWidth = '75vw'
        pillHeight = '55vh'
      }

      tl.to(pillRef.current, { width: pillWidth, height: pillHeight, borderRadius: '1000px' }, 0.3)
      tl.to(bgRef.current, { backgroundColor: '#ffffff' }, 0.3)
      tl.to('.mask-line', { yPercent: 0, opacity: 1, duration: 0.3, stagger: 0.08 }, 0.5)
      
      // Button: simple fade in, no movement
      if (buttonRef.current) {
        tl.to(buttonRef.current, { 
          opacity: 1, 
          duration: 0.2,
          ease: 'none'
        }, 0.85)
      }
      
      tl.to('.contact-info', { opacity: 1, y: 0, duration: 0.3 }, 0.95)
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 z-0"
      />

      {/* Morphing container with moving text */}
      <div className="absolute inset-0 flex items-center justify-center z-[1]">
        <div
          ref={pillRef}
          className="relative overflow-hidden"
          style={{
            backgroundColor: '#2563eb',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Moving Background Text */}
          <div 
            className="absolute inset-0 flex flex-col justify-center pointer-events-none"
            style={{ mixBlendMode: 'color-burn' }}
          >
            {/* Row 1 */}
            <div className="relative whitespace-nowrap overflow-hidden -rotate-12">
              <div className="tech-text-row-1 inline-flex">
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  REACT • NEXT.JS • TYPESCRIPT • NODE.JS • EXPRESS • MONGODB •
                </span>
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  REACT • NEXT.JS • TYPESCRIPT • NODE.JS • EXPRESS • MONGODB •
                </span>
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="relative whitespace-nowrap overflow-hidden rotate-6">
              <div className="tech-text-row-2 inline-flex">
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  PYTHON • DJANGO • FASTAPI • DOCKER • KUBERNETES • AWS •
                </span>
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  PYTHON • DJANGO • FASTAPI • DOCKER • KUBERNETES • AWS •
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="relative whitespace-nowrap overflow-hidden -rotate-9">
              <div className="tech-text-row-3 inline-flex">
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  GRAPHQL • REST API • POSTGRESQL • REDIS • FIREBASE •
                </span>
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  GRAPHQL • REST API • POSTGRESQL • REDIS • FIREBASE •
                </span>
              </div>
            </div>

            {/* Row 4 */}
            <div className="relative whitespace-nowrap overflow-hidden rotate-12">
              <div className="tech-text-row-4 inline-flex">
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  TAILWIND • SASS • WEBPACK • VITE • JEST • CYPRESS •
                </span>
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  TAILWIND • SASS • WEBPACK • VITE • JEST • CYPRESS •
                </span>
              </div>
            </div>

            {/* Row 5 */}
            <div className="relative whitespace-nowrap overflow-hidden -rotate-6">
              <div className="tech-text-row-5 inline-flex">
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  GIT • CI/CD • AGILE • MICROSERVICES • SERVERLESS • AI/ML •
                </span>
                <span className="text-[5vw] sm:text-[7vw] md:text-[8vw] font-black text-blue-400 px-4 sm:px-6 md:px-8">
                  GIT • CI/CD • AGILE • MICROSERVICES • SERVERLESS • AI/ML •
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main heading */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
        <div className="text-center">
          <div className="overflow-hidden">
            <h2 className="mask-line text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight">
              LET&apos;S BUILD
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="mask-line text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight">
              SOMETHING
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="mask-line text-[#4ECDC4] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight">
              AMAZING
            </h2>
          </div>
        </div>
      </div>

      {/* CTA button - NO TRANSFORMS, just fade */}
      <div className="absolute bottom-24 sm:bottom-28 md:bottom-32 lg:bottom-36 left-1/2 -translate-x-1/2 z-20 px-4">
        <a
          ref={buttonRef}
          href={`mailto:${profile.email}`}
          className="inline-block bg-black text-white px-6 sm:px-7 md:px-9 lg:px-10 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-black rounded-full shadow-lg hover:bg-gray-900 hover:shadow-xl transition-colors"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          GET IN TOUCH
        </a>
      </div>

      {/* Contact info */}
      <div className="contact-info absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-full px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-700">
          <a 
            href={`mailto:${profile.email}`} 
            className="font-semibold hover:text-[#4ECDC4] transition-colors text-center"
          >
            {profile.email}
          </a>
          {profile.phone && (
            <a 
              href={`tel:${profile.phone}`} 
              className="font-semibold hover:text-[#4ECDC4] transition-colors"
            >
              {profile.phone}
            </a>
          )}
          <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <a 
              href={profile.socials.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="font-semibold hover:text-[#4ECDC4] transition-colors"
            >
              LINKEDIN
            </a>
            <a 
              href={profile.socials.github} 
              target="_blank" 
              rel="noreferrer" 
              className="font-semibold hover:text-[#4ECDC4] transition-colors"
            >
              GITHUB
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
