'use client'

import { useState, useEffect } from 'react'
import { profile } from '@/data/profile'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function NavBar() {
    const links = ['About', 'Experience', 'Projects', 'Skills', 'Contact']
    const pathname = usePathname()
    const router = useRouter()
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const [isAtBottom, setIsAtBottom] = useState(false)

    // Detect if the navbar is at the bottom of the screen (on the landing page)
    useEffect(() => {
        if (pathname !== '/') {
            setIsAtBottom(false)
            return
        }

        const handleScroll = () => {
            // The navbar starts at 100vh - 80px on the homepage
            // If we haven't scrolled past it, it's at the bottom.
            if (window.scrollY < window.innerHeight - 100) {
                setIsAtBottom(true)
            } else {
                setIsAtBottom(false)
            }
        }

        handleScroll() // Initial check
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname])

    const handleScroll = (id: string) => {
        if (pathname === '/') {
            const el = document.getElementById(id.toLowerCase())
            if (el) {
                if (id.toLowerCase() === 'projects') {
                    // To show the first project 'open' in the 3D scroll timeline,
                    // we need to scroll exactly past the "PROJECTS" title slide.
                    // The calculation for the first card's "straight" point is 1.05 * windowHeight into the section.
                    const top = el.getBoundingClientRect().top + window.scrollY + (window.innerHeight * 1.05)
                    window.scrollTo({ top, behavior: 'smooth' })
                } else {
                    el.scrollIntoView({ behavior: 'smooth' })
                }
            }
        } else {
            router.push('/#' + id.toLowerCase())
        }
    }

    return (
        <nav className="sticky top-0 w-full h-[80px] border-b border-[#333] z-50 flex items-center justify-between px-6 md:px-12 xl:px-24 bg-black/40 backdrop-blur-xl">
            <Link href="/" className="font-bold text-xl tracking-tighter text-[#f5f5f7] cursor-pointer hover:text-white transition-colors">
                RC.
            </Link>
            
            <div className="hidden md:flex items-center gap-8 ml-[5vw]">
                {links.map((link) => (
                    <div 
                        key={link} 
                        className="relative flex items-center h-[80px]" // Make hover hit area the full height of the navbar
                        onMouseEnter={() => setHoveredLink(link)}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                        <button
                            onClick={() => handleScroll(link)}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors ${
                                hoveredLink === link ? 'text-[#f5f5f7]' : 'text-[#86868b]'
                            }`}
                        >
                            {link}
                        </button>
                        
                        {link === 'Projects' && (
                            <AnimatePresence>
                                {hoveredLink === 'Projects' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: isAtBottom ? 10 : -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: isAtBottom ? 10 : -10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className={`absolute left-0 ${isAtBottom ? 'bottom-[80px] pb-4' : 'top-[80px] pt-4'} w-56 z-50`}
                                    >
                                        <div className="rounded-xl bg-[#111]/90 backdrop-blur-xl border border-[#333] p-2 relative overflow-hidden flex flex-col shadow-2xl">
                                            
                                            <Link 
                                                href="/#projects" 
                                                onClick={(e) => { 
                                                    setHoveredLink(null); 
                                                    if (pathname === '/') {
                                                        e.preventDefault();
                                                        handleScroll('projects');
                                                    }
                                                }}
                                                className="group relative p-4 rounded-lg hover:bg-[#222] transition-colors"
                                            >
                                                <div className="relative flex overflow-hidden font-semibold text-sm tracking-widest uppercase">
                                                    <span className="inline-block text-[#86868b] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                                                        FEATURED
                                                    </span>
                                                    <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                                                        FEATURED
                                                    </span>
                                                </div>
                                                <span className="block text-[#555] text-xs mt-1 lowercase font-mono">/homepage</span>
                                            </Link>
                                            
                                            <div className="h-[1px] w-full bg-[#222] my-1" />
                                            
                                            <Link 
                                                href="/projects" 
                                                onClick={() => setHoveredLink(null)}
                                                className="group relative p-4 rounded-lg hover:bg-[#222] transition-colors"
                                            >
                                                <div className="relative flex overflow-hidden font-semibold text-sm tracking-widest uppercase">
                                                    <span className="inline-block text-[#86868b] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                                                        ALL PROJECTS
                                                    </span>
                                                    <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                                                        ALL PROJECTS
                                                    </span>
                                                </div>
                                                <span className="block text-[#555] text-xs mt-1 lowercase font-mono">/archive</span>
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                ))}
            </div>

            <a
                href={`mailto:${profile.email}`}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#333] bg-black px-6 py-2 text-sm font-semibold transition-all duration-500 hover:bg-[#f5f5f7]"
            >
                <div className="relative flex overflow-hidden">
                    <span className="inline-block text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
                        LET'S TALK
                    </span>
                    <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                        LET'S TALK
                    </span>
                </div>
            </a>
        </nav>
    )
}
