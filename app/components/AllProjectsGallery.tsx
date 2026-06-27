'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '@/data/profile'

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

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  )
}

const ProjectRow = ({ project, index }: { project: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group py-8 md:py-12 border-b border-[#333] flex flex-col hover:bg-[#0a0a0a] transition-colors px-6 -mx-6 rounded-3xl cursor-pointer overflow-hidden"
    >
      {/* Top Header Row (Always visible) */}
      <motion.div layout className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        {/* Left Column: Index & Title */}
        <div className="flex-1 max-w-3xl">
          <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-2">
            <span className="text-[#86868b] font-mono text-sm md:w-8">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#f5f5f7] group-hover:text-white transition-colors">
              {project.title.split('—')[0].trim()}
            </h2>
          </div>
          
          <AnimatePresence>
            {!isHovered && project.title.includes('—') && (
              <motion.div 
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:pl-12"
              >
                <h3 className="text-lg md:text-xl text-[#a1a1a6] font-medium">
                  {project.title.split('—')[1].trim()}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Tech Stack */}
        <motion.div layout className="w-full md:w-1/3 flex flex-wrap content-start gap-2 pt-2 md:pt-1">
          {project.tech.map((t: string, i: number) => (
            <span 
              key={i} 
              className="px-3 py-1.5 text-xs font-medium bg-[#111] text-[#a1a1a6] rounded-md border border-[#222] group-hover:bg-[#1a1a1a] group-hover:text-[#f5f5f7] transition-colors"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Expanded Content (Visible only on hover/click) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:pl-12 flex flex-col lg:flex-row gap-12"
          >
            {/* Expanded Text & Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-1/2 flex flex-col justify-between"
            >
              <div>
                {project.title.includes('—') && (
                  <h3 className="text-xl md:text-2xl text-[#f5f5f7] font-semibold mb-4">
                    {project.title.split('—')[1].trim()}
                  </h3>
                )}
                <p className="text-[#86868b] text-base md:text-lg leading-relaxed mb-6">
                  {project.description}
                </p>
                {project.impact && (
                  <div className="mb-8 p-6 rounded-2xl bg-[#111] border border-[#222]">
                    <span className="text-[#f5f5f7] font-semibold block mb-2 text-sm uppercase tracking-widest">Impact & Results</span>
                    <span className="text-[#a1a1a6]">{project.impact}</span>
                  </div>
                )}
              </div>

              {/* Masking Effect Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {project.links?.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#f5f5f7] bg-[#f5f5f7] px-8 py-3 text-sm font-semibold transition-all duration-500 hover:bg-black hover:border-[#333]"
                  >
                    <div className="relative flex overflow-hidden">
                      <span className="inline-block text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-y-[150%]">
                        VIEW LIVE SITE
                      </span>
                      <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0">
                        VIEW LIVE SITE
                      </span>
                    </div>
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#333] bg-transparent px-8 py-3 text-sm font-semibold transition-all duration-500 hover:bg-[#1a1a1a]"
                  >
                    <div className="relative flex overflow-hidden">
                      <span className="inline-block text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:-translate-y-[150%]">
                        SOURCE CODE
                      </span>
                      <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0">
                        SOURCE CODE
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Placard / Image Area */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-1/2 aspect-video rounded-[2rem] overflow-hidden bg-[#111] border border-[#222] relative group/placard"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] z-0" />
              
              {project.video ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/placard:opacity-100 group-hover/placard:scale-105 transition-all duration-700"
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              ) : project.images && project.images.length > 0 ? (
                <AutoCarousel images={project.images} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-[12vw] lg:text-[8vw] font-black text-[#ffffff05] uppercase tracking-tighter leading-none">
                    {project.title.substring(0, 2)}
                  </h3>
                </div>
              )}
              
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AllProjectsGallery() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-32 text-[#f5f5f7]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Ideas that actually compiled.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#86868b] max-w-3xl font-medium"
          >
            A not-so-comprehensive archive of {profile.projects.length} midnight side quests, AI experiments, and production-ready applications.
          </motion.p>
        </div>

        {/* The List */}
        <div className="flex flex-col border-t border-[#333]">
          {profile.projects.map((project, index) => (
            <ProjectRow key={index} project={project} index={index} />
          ))}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-32 pt-16 border-t border-[#222] flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#f5f5f7] tracking-tight mb-2">Enough scrolling, let's talk.</h3>
            <p className="text-[#86868b]">Always open to discussing product design or new opportunities.</p>
          </div>
          <div className="flex items-center gap-6 font-medium">
            {profile.socials.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-[#86868b] hover:text-[#f5f5f7] transition-colors px-4 py-2 rounded-full hover:bg-[#111]">
                GitHub
              </a>
            )}
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#86868b] hover:text-[#f5f5f7] transition-colors px-4 py-2 rounded-full hover:bg-[#111]">
                LinkedIn
              </a>
            )}
            {profile.socials.email && (
              <a href={`mailto:${profile.socials.email}`} className="text-[#86868b] hover:text-[#f5f5f7] transition-colors px-4 py-2 rounded-full hover:bg-[#111]">
                Email
              </a>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
