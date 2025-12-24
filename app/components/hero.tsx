'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [navbarPosition, setNavbarPosition] = useState<'bottom' | 'top'>('bottom')
  const [navbarStyle, setNavbarStyle] = useState<'white' | 'black'>('white')
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Staggered Menu Refs
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const preLayersRef = useRef<HTMLDivElement>(null)
  const preLayerElsRef = useRef<HTMLDivElement[]>([])
  const plusHRef = useRef<HTMLSpanElement>(null)
  const plusVRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const textInnerRef = useRef<HTMLSpanElement>(null)
  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)
  const spinTweenRef = useRef<gsap.core.Tween | null>(null)
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null)
  const colorTweenRef = useRef<gsap.core.Tween | null>(null)
  const busyRef = useRef(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const menuItems = [
    { label: 'Projects', link: '#projects', ariaLabel: 'View Projects' },
    { label: 'Work', link: '#experience', ariaLabel: 'View Work Experience' },
    { label: 'Contact', link: '#contact', ariaLabel: 'Contact Me' }
  ]

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'Email', link: 'mailto:hello@example.com' }
  ]

  // Custom smooth scroll function
  const smoothScrollTo = (targetY: number, duration?: number) => {
    const isMobile = window.innerWidth < 768
    const defaultDuration = isMobile ? 1500 : 2000
    const scrollDuration = duration || defaultDuration
    
    const startY = window.scrollY
    const distance = targetY - startY
    const startTime = performance.now()

    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / scrollDuration, 1)
      const easeProgress = easeInOutQuad(progress)
      
      window.scrollTo(0, startY + distance * easeProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  const scrollToSection = (sectionId: string) => {
    const isMobile = window.innerWidth < 768
    
    if (sectionId === 'projects') {
      const projectsSection = document.getElementById('projects')
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const offset = isMobile ? 300 : 600
        smoothScrollTo(rect.top + scrollTop + offset, isMobile ? 1500 : 2000)
      }
      return
    }
    
    if (sectionId === 'experience') {
      const experienceSection = document.getElementById('experience')
      if (experienceSection) {
        const rect = experienceSection.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const offset = isMobile ? 40 : 80
        smoothScrollTo(rect.top + scrollTop - offset, isMobile ? 1500 : 2000)
      }
      return
    }
    
    if (sectionId === 'contact') {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        const absoluteTop = rect.top + window.pageYOffset
        const multiplier = isMobile ? 1.5 : 2
        const finalPosition = absoluteTop + (window.innerHeight * multiplier)
        smoothScrollTo(finalPosition, isMobile ? 3000 : 6000)
      }
      return
    }
    
    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      smoothScrollTo(rect.top + scrollTop, isMobile ? 1500 : 2000)
    }
  }

  // Initialize menu GSAP animations
  useLayoutEffect(() => {
    if (!isMobile) return

    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      const plusH = plusHRef.current
      const plusV = plusVRef.current
      const icon = iconRef.current
      const textInner = textInnerRef.current
      
      if (!panel || !plusH || !plusV || !icon || !textInner) return

      let preLayers: HTMLDivElement[] = []
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'))
      }
      preLayerElsRef.current = preLayers

      gsap.set([panel, ...preLayers], { xPercent: 100 })
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })
      
      if (toggleBtnRef.current) {
        const color = navbarStyle === 'white' ? '#ffffff' : '#111827'
        gsap.set(toggleBtnRef.current, { color })
      }
      if (logoRef.current) {
        const color = navbarStyle === 'white' ? '#ffffff' : '#111827'
        gsap.set(logoRef.current, { color })
      }
    })
    
    return () => ctx.revert()
  }, [isMobile, navbarStyle])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-item'))
    const socialTitle = panel.querySelector('.sm-socials-title')
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 })
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 })
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 })
    }

    const tl = gsap.timeline({ paused: true })

    layers.forEach((layer, i) => {
      tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0)
    const panelDuration = 0.65

    tl.fromTo(
      panel,
      { xPercent: 100 },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    )

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.1
        },
        itemsStart
      )
      
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: 0.08
          },
          itemsStart + 0.1
        )
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart)
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.08
          },
          socialsStart + 0.04
        )
      }
    }

    openTlRef.current = tl
    return tl
  }, [])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTimeline()
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false
      })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    const all = [...layers, panel]
    closeTweenRef.current?.kill()
    
    closeTweenRef.current = gsap.to(all, {
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        busyRef.current = false
      }
    })
  }, [])

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current
    if (!icon) return
    spinTweenRef.current?.kill()
    
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out' })
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut' })
    }
  }, [])

  const animateColor = useCallback((opening: boolean) => {
    const btn = toggleBtnRef.current
    const logo = logoRef.current
    if (!btn || !logo) return
    colorTweenRef.current?.kill()
    
    const targetColor = opening ? '#111827' : (navbarStyle === 'white' ? '#ffffff' : '#111827')
    colorTweenRef.current = gsap.to([btn, logo], {
      color: targetColor,
      delay: 0.18,
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [navbarStyle])

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current
    if (!inner) return
    textCycleAnimRef.current?.kill()

    const targetYPercent = opening ? -50 : 0
    
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: targetYPercent,
      duration: 0.4,
      ease: 'power4.out'
    })
  }, [])

  const toggleMenu = useCallback(() => {
    const target = !menuOpenRef.current
    menuOpenRef.current = target
    setMenuOpen(target)
    
    if (target) {
      playOpen()
    } else {
      playClose()
    }
    
    animateIcon(target)
    animateColor(target)
    animateText(target)
  }, [playOpen, playClose, animateIcon, animateColor, animateText])

  const closeMenu = useCallback(() => {
    if (menuOpenRef.current) {
      menuOpenRef.current = false
      setMenuOpen(false)
      playClose()
      animateIcon(false)
      animateColor(false)
      animateText(false)
    }
  }, [playClose, animateIcon, animateColor, animateText])

  useEffect(() => {
    setIsMounted(true)
    
    const checkIfMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 768
      setIsMobile(isTouchDevice && isSmallScreen)
    }
    
    checkIfMobile()
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setNavbarPosition(scrolled ? 'top' : 'bottom')
      
      const heroHeight = window.innerHeight
      const shouldBeBlack = window.scrollY > heroHeight * 0.9
      setNavbarStyle(shouldBeBlack ? 'black' : 'white')
    }
    
    window.addEventListener('scroll', handleScroll)

    gsap.fromTo('.profile-photo',
      { scale: 0, opacity: 0, rotate: -180 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1.5, ease: 'back.out(1.7)', delay: 0.5 }
    )

    gsap.fromTo('.hero-text',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 1.2 }
    )

    gsap.to('.bg-text-row-1', {
      xPercent: -50,
      duration: 60,
      ease: 'none',
      repeat: -1
    })

    gsap.fromTo('.bg-text-row-2', 
      { xPercent: -50 },
      { 
        xPercent: 0,
        duration: 80,
        ease: 'none',
        repeat: -1
      }
    )

    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen && toggleBtnRef.current && logoRef.current) {
      const color = navbarStyle === 'white' ? '#ffffff' : '#111827'
      gsap.to([toggleBtnRef.current, logoRef.current], {
        color,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }, [navbarStyle, menuOpen])

  useEffect(() => {
    if (!menuOpen || !isMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen, isMobile, closeMenu])

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <AnimatePresence mode="wait">
          <motion.nav
            key={navbarPosition}
            initial={navbarPosition === 'bottom' 
              ? { bottom: 40, top: 'auto', opacity: 0 }
              : { top: -100, bottom: 'auto', opacity: 1 }
            }
            animate={navbarPosition === 'bottom'
              ? { bottom: 40, top: 'auto', opacity: 1 }
              : { top: 0, bottom: 'auto', opacity: 1 }
            }
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 ${
              navbarPosition === 'top' && navbarStyle === 'black' 
                ? 'bg-transparent' 
                : ''
            }`}
          >
            <div className={`${
              navbarPosition === 'top' && navbarStyle === 'black' 
                ? 'flex justify-between items-center' 
                : 'flex justify-end'
            }`}>
              {navbarPosition === 'top' && navbarStyle === 'black' && (
                <a 
                  href="/" 
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollTo(0, 2000)
                  }}
                  className="text-xl sm:text-2xl font-bold cursor-pointer text-gray-900"
                >
                  RC
                </a>
              )}
              
              <div className={`flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-sm sm:text-base font-medium transition-colors duration-300 ${
                navbarStyle === 'white' ? 'text-white' : 'text-gray-900'
              }`}>
                <a 
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('projects')
                  }}
                  className={`cursor-pointer transition-colors duration-200 ${
                    navbarStyle === 'white' ? 'hover:text-emerald-300' : 'hover:text-emerald-700'
                  }`}
                >
                  Projects
                </a>
                <a 
                  href="#experience"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('experience')
                  }}
                  className={`cursor-pointer transition-colors duration-200 ${
                    navbarStyle === 'white' ? 'hover:text-emerald-300' : 'hover:text-emerald-700'
                  }`}
                >
                  Work
                </a>
                <a 
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('contact')
                  }}
                  className={`cursor-pointer transition-colors duration-200 ${
                    navbarStyle === 'white' ? 'hover:text-emerald-300' : 'hover:text-emerald-700'
                  }`}
                >
                  Contact
                </a>
              </div>
            </div>
          </motion.nav>
        </AnimatePresence>
      )}

      {/* Mobile Staggered Menu */}
      {isMobile && (
        <div className="fixed left-0 right-0 z-50 pointer-events-none">
          {/* Prelayers */}
          <div ref={preLayersRef} className="absolute top-0 right-0 bottom-0 w-[80%] max-w-sm pointer-events-none z-[5]">
            <div className="sm-prelayer absolute top-0 right-0 h-[100vh] w-full bg-emerald-600" />
            <div className="sm-prelayer absolute top-0 right-0 h-[100vh] w-full bg-emerald-700" />
          </div>

          {/* Header with logo and toggle - ANIMATES POSITION */}
          <motion.header 
            className="fixed w-full flex items-center justify-between px-4 py-3 z-20"
            animate={{
              top: menuOpen ? 0 : (navbarPosition === 'bottom' ? 'auto' : 0),
              bottom: menuOpen ? 'auto' : (navbarPosition === 'bottom' ? 20 : 'auto')
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <a 
              ref={logoRef}
              href="/" 
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo(0, 2000)
              }}
              className="text-xl font-bold pointer-events-auto transition-colors duration-300"
              style={{
                color: navbarStyle === 'white' ? '#ffffff' : '#111827'
              }}
            >
              RC
            </a>

            <button
              ref={toggleBtnRef}
              className="relative inline-flex items-center gap-2 bg-transparent border-none font-medium pointer-events-auto transition-colors duration-300"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                color: navbarStyle === 'white' ? '#ffffff' : '#111827'
              }}
            >
              <span className="relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[3.5em]">
                <span ref={textInnerRef} className="flex flex-col leading-none">
                  <span className="block h-[1em] leading-none">Menu</span>
                  <span className="block h-[1em] leading-none">Close</span>
                </span>
              </span>
              
              <span ref={iconRef} className="relative w-[14px] h-[14px] flex-shrink-0 inline-flex items-center justify-center">
                <span 
                  ref={plusHRef} 
                  className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-full -translate-x-1/2 -translate-y-1/2"
                />
                <span 
                  ref={plusVRef} 
                  className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-full -translate-x-1/2 -translate-y-1/2"
                />
              </span>
            </button>
          </motion.header>

          {/* Menu Panel - Fixed to viewport */}
          <aside 
            ref={panelRef} 
            className="fixed top-0 right-0 w-[80%] max-w-sm h-screen bg-white flex flex-col pt-20 pb-8 px-6 overflow-y-auto z-10 pointer-events-auto"
          >
            <ul className="list-none m-0 p-0 flex flex-col gap-2 flex-1">
              {menuItems.map((item, idx) => (
                <li key={item.label} className="relative overflow-hidden leading-none">
                  <a
                    href={item.link}
                    onClick={(e) => {
                      e.preventDefault()
                      closeMenu()
                      const id = item.link.replace('#', '')
                      setTimeout(() => scrollToSection(id), 300)
                    }}
                    className="sm-panel-item relative inline-block text-gray-900 font-black text-[2.5rem] leading-none tracking-tight uppercase no-underline pr-[1.4em] hover:text-emerald-700 transition-colors"
                    style={{ '--sm-num-opacity': 0 } as React.CSSProperties}
                    data-index={idx + 1}
                  >
                    <span className="sm-panel-itemLabel inline-block">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-gray-200">
              <h3 className="sm-socials-title m-0 text-sm font-medium text-emerald-700">Socials</h3>
              <ul className="list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap">
                {socialItems.map((social, i) => (
                  <li key={social.label}>
                    <a
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link text-base font-medium text-gray-900 no-underline hover:text-emerald-700 transition-colors"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* Hide all cursors on mobile */}
      {isMobile && (
        <style jsx global>{`
          @media (max-width: 767px) {
            *, *::before, *::after {
              cursor: none !important;
            }
          }
        `}</style>
      )}

      {/* Hero Section */}
      <section ref={containerRef} className="relative min-h-screen bg-emerald-700 overflow-hidden">
        {/* Moving Background Text */}
        <div className="absolute inset-0 flex flex-col justify-center opacity-[0.03] pointer-events-none">
          <div className="relative whitespace-nowrap overflow-hidden">
            <div className="bg-text-row-1 inline-flex">
              <span className="text-[15vw] font-black text-white px-4 sm:px-8">
                DEVELOPER • ENGINEER • CREATOR • INNOVATOR •
              </span>
              <span className="text-[15vw] font-black text-white px-4 sm:px-8">
                DEVELOPER • ENGINEER • CREATOR • INNOVATOR •
              </span>
            </div>
          </div>
          
          <div className="relative whitespace-nowrap overflow-hidden">
            <div className="bg-text-row-2 inline-flex">
              <span className="text-[15vw] font-black text-white px-4 sm:px-8">
                FULL-STACK • FRONTEND • BACKEND • MOBILE •
              </span>
              <span className="text-[15vw] font-black text-white px-4 sm:px-8">
                FULL-STACK • FRONTEND • BACKEND • MOBILE •
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div 
          style={{ opacity }}
          className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8"
        >
          <div className="text-center max-w-4xl mx-auto w-full">
            {/* Profile Photo */}
            <div className="profile-photo relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mx-auto mb-6 sm:mb-8">
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-white/30 shadow-2xl">
                <Image
                  src="/profile-photo.jpg"
                  alt="Rounak Chadha"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 288px"
                />
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-green-400 rounded-full border-2 sm:border-4 border-emerald-700 animate-pulse" />
            </div>

            {/* Name */}
            <h1 className="hero-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 px-4">
              Rounak Chadha
            </h1>

            {/* Role */}
            <p className="hero-text text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-100 mb-6 sm:mb-8 font-light px-4">
              Full-Stack Developer & Software Engineer
            </p>

            {/* Description */}
            <p className="hero-text text-sm sm:text-base md:text-lg lg:text-xl text-emerald-50 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 opacity-90 px-4">
              I craft scalable digital solutions that bridge the gap between elegant design and powerful functionality. 
              Specializing in modern web technologies, AR/VR experiences, and AI-driven applications.
            </p>

            {/* CTA Buttons */}
            <div className="hero-text flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('projects')
                }}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-emerald-700 rounded-full font-medium hover:bg-emerald-50 transition-all shadow-lg text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>
              <motion.a
                href="/Rounak_Chadha.pdf"
                download="Rounak_Chadha.pdf"
                className="px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </motion.a>
            </div>
            
            {/* Social Links */}
            <div className="hero-text flex justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 px-4">
              <a 
                href="https://github.com" 
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:chadharounak@gmail.com" 
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Email"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
