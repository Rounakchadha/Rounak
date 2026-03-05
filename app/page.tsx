'use client'

import Hero from './components/hero'
import About from './components/about'
import Projects from './components/projects'
import Experience from './components/experience'
import Skills from './components/skills'
import TechnicalSkills from './components/tech-skills'
import Contact from './components/contact'
import SmoothScroll from './components/smoothScroll'
import NavBar from './components/navbar'

export default function Home() {
  return (
    <SmoothScroll>
      <div className="relative w-full bg-black min-h-screen">
        <div className="absolute top-0 left-0 w-full z-0 h-screen">
          <Hero />
        </div>

        {/* Main flow starts at bottom of screen, wrapping NavBar and content */}
        <div className="w-full relative z-20 pt-[calc(100vh-80px)] pointer-events-none">
          <div className="relative pointer-events-auto">
            <NavBar />

            <div className="relative w-full z-10 bg-black">
              <About />
              <Skills />
              <Experience />
              <Projects />
              <TechnicalSkills />
              <Contact />
            </div>
          </div>
        </div>
      </div>
    </SmoothScroll>
  )
}
