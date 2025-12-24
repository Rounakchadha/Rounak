'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const scrollProgress = useMotionValue(0)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Pin the entire experience section
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${profile.experience.length * 100}%`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          scrollProgress.set(progress)
          
          // Calculate current experience based on scroll progress
          const experienceIndex = Math.floor(progress * profile.experience.length)
          const clampedIndex = Math.min(experienceIndex, profile.experience.length - 1)
          setCurrentIndex(clampedIndex)
          
          // Animate experience content with slightly faster fade
          profile.experience.forEach((_, index) => {
            const experienceProgress = (progress * profile.experience.length) - index
            const opacity = Math.max(0, Math.min(1, 1 - Math.abs(experienceProgress - 0.5) * 2.5))
            const y = experienceProgress < 0 ? 50 : experienceProgress > 1 ? -50 : 0
            
            gsap.set(`.experience-${index}`, {
              opacity: opacity,
              y: y,
              duration: 0
            })
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [scrollProgress])

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (!timelineRef.current) return
    
    const timelineRect = timelineRef.current.getBoundingClientRect()
    const isMobile = window.innerWidth < 768
    const timelineSize = isMobile ? 250 : window.innerWidth < 1024 ? 320 : 400
    
    const relativeY = Math.max(0, Math.min(event.clientY - timelineRect.top, timelineSize))
    const progress = relativeY / timelineSize
    
    scrollProgress.set(progress)
    
    const experienceIndex = Math.floor(progress * profile.experience.length)
    const clampedIndex = Math.min(experienceIndex, profile.experience.length - 1)
    setCurrentIndex(clampedIndex)
  }

  const jumpToExperience = (index: number) => {
    const progress = index / (profile.experience.length - 1)
    scrollProgress.set(progress)
    setCurrentIndex(index)
  }

  return (
    <section 
      id="experience" 
      ref={containerRef}
      className="min-h-screen bg-white"
    >
      <div className="h-screen flex flex-col pt-16 sm:pt-14 md:pt-16 pb-6 sm:pb-8">
        <div className="w-full px-3 sm:px-6 md:px-8 lg:px-16 xl:px-32 flex-1 flex flex-col overflow-hidden">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col overflow-hidden">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 mb-4 sm:mb-6 md:mb-8 lg:mb-10"
            >
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase text-emerald-700 mb-2 sm:mb-4 md:mb-6">
                Experience
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600">
                My professional journey and key experiences
              </p>
            </motion.div>

            {/* Main content area - TIMELINE LEFT, CONTENT RIGHT */}
            <div className="flex-1 flex items-center min-h-0 overflow-hidden">
              <div className="w-full h-full">
                {/* Grid: Timeline column LEFT, Content column RIGHT */}
                <div className="grid grid-cols-[70px,1fr] sm:grid-cols-[100px,1fr] md:grid-cols-[140px,1fr] lg:grid-cols-[280px,1fr] xl:grid-cols-[320px,1fr] gap-4 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 h-full items-center">
                  
                  {/* LEFT SIDE - Interactive Timeline */}
                  <div className="space-y-3 sm:space-y-5 md:space-y-6 lg:space-y-8 flex flex-col items-center justify-center h-full">
                    
                    {/* Interactive Timeline */}
                    <div className="relative flex justify-center">
                      <div 
                        ref={timelineRef}
                        className="relative cursor-pointer select-none h-[220px] sm:h-[250px] md:h-[300px] lg:h-[380px]"
                        onClick={handleTimelineClick}
                      >
                        {/* Background line */}
                        <div className="w-0.5 sm:w-1 md:w-1.5 lg:w-2 h-full bg-gray-200 rounded-full absolute left-1/2 transform -translate-x-1/2" />
                        
                        {/* Progress line */}
                        <motion.div 
                          className="w-0.5 sm:w-1 md:w-1.5 lg:w-2 bg-emerald-700 rounded-full absolute left-1/2 transform -translate-x-1/2"
                          style={{
                            height: useTransform(scrollProgress, [0, 1], ['0%', '100%'])
                          }}
                        />
                        
                        {/* Experience markers */}
                        {profile.experience.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation()
                              jumpToExperience(index)
                            }}
                            className={`absolute w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-2 md:border-[3px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${
                              currentIndex === index 
                                ? 'bg-emerald-700 border-emerald-700 scale-125' 
                                : 'bg-white border-gray-400 hover:border-emerald-700 hover:scale-110'
                            }`}
                            style={{
                              top: `${(index / (profile.experience.length - 1)) * 100}%`
                            }}
                            aria-label={`Jump to experience ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Experience Counter */}
                    <div className="text-center">
                      <span className="text-[10px] sm:text-sm md:text-base font-mono text-gray-500">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(profile.experience.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Current Experience Title - Desktop only */}
                    <motion.div 
                      className="text-center hidden lg:block px-2"
                      key={currentIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-base xl:text-lg font-bold text-gray-900 break-words">
                        {profile.experience[currentIndex]?.role}
                      </h3>
                      <p className="text-sm text-emerald-700 break-words">
                        {profile.experience[currentIndex]?.company}
                      </p>
                    </motion.div>
                  </div>

                  {/* RIGHT SIDE - Experience Content */}
                  <div className="relative h-full flex items-center overflow-hidden">
                    {profile.experience.map((exp, index) => (
                      <div
                        key={index}
                        className={`experience-${index} absolute inset-0 flex items-center overflow-y-auto`}
                        style={{ opacity: 0 }}
                      >
                        <div className="w-full py-4">
                          
                          {/* Duration Badge */}
                          <div className="inline-block px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] sm:text-xs md:text-sm font-medium mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                            {exp.duration}
                          </div>
                          
                          {/* Role & Company */}
                          <h3 className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-1 sm:mb-2 md:mb-2.5 lg:mb-3 leading-tight break-words pr-2">
                            {exp.role}
                          </h3>
                          
                          <p className="text-xs sm:text-base md:text-lg lg:text-xl text-emerald-700 font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 break-words pr-2">
                            {exp.company} • {exp.location}
                          </p>
                          
                          {/* Responsibilities */}
                          <div className="space-y-1.5 sm:space-y-2.5 md:space-y-3 lg:space-y-4 pr-2">
                            {exp.bullets.map((bullet, i) => (
                              <div key={i} className="flex items-start gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4">
                                <span className="text-emerald-700 text-sm sm:text-base md:text-lg lg:text-xl font-bold flex-shrink-0 mt-0.5">
                                  →
                                </span>
                                <span className="text-[11px] sm:text-sm md:text-base lg:text-lg text-gray-700 leading-snug sm:leading-relaxed break-words">
                                  {bullet}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
