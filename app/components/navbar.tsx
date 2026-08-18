'use client'

import { useState, useEffect } from 'react'
import { profile } from '@/data/profile'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { resolveSectionId, scrollToSection } from '@/lib/scrollToSection'
import { StaggeredMenu } from './StaggeredMenu'

export default function NavBar() {
    const links = ['About', 'Services', 'Experience', 'Projects', 'Skills', 'Contact']
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
            if (window.scrollY < window.innerHeight - 100) {
                setIsAtBottom(true)
            } else {
                setIsAtBottom(false)
            }
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [pathname])

    const handleScroll = (id: string) => {
        if (pathname === '/') {
            scrollToSection(id)
        } else {
            router.push('/#' + resolveSectionId(id))
        }
    }

    return (
        <>
            {/* Mobile Header -> entirely replaced by StaggeredMenu */}
            <div className="md:hidden h-[80px]">
                <StaggeredMenu
                    position="right"
                    items={[
                        { label: 'About', ariaLabel: 'About', link: '#about' },
                        { label: 'Services', ariaLabel: 'Services', link: '#services' },
                        { label: 'Experience', ariaLabel: 'Experience', link: '#experience' },
                        { label: 'Projects', ariaLabel: 'Projects', link: '#projects' },
                        { label: 'Skills', ariaLabel: 'Skills', link: '#skills' },
                        { label: 'Contact', ariaLabel: 'Contact', link: '#contact' }
                    ]}
                    socialItems={[]}
                    displaySocials={false}
                    displayItemNumbering={true}
                    menuButtonColor="#f5f5f7"
                    openMenuButtonColor="#f5f5f7"
                    changeMenuColorOnOpen={true}
                    colors={['#1a1a1a', '#333333']}
                    accentColor="#86868b"
                    isFixed={true}
                />
            </div>

            {/* Desktop Header -> completely unchanged original structure */}
            <nav className="hidden md:block sticky top-0 w-full border-b border-[#333] z-50 bg-black/40 backdrop-blur-xl">
                <div className="w-full h-[80px] flex items-center justify-between px-6 md:px-12 xl:px-24">
                <Link href="/" className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                    <img src="/logo-mark.png" alt="Rounak Chadha" className="h-7" />
                </Link>
                
                <div className="hidden md:flex items-center gap-8 ml-[5vw]">
                    {links.map((link) => (
                        <div 
                            key={link} 
                            className="relative flex items-center h-[80px]"
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

                <div className="flex items-center gap-3">
                    <a
                        href={`mailto:${profile.email}`}
                        className="group relative hidden md:inline-flex items-center justify-center overflow-hidden rounded-full border border-[#333] bg-black px-6 py-2 text-sm font-semibold transition-all duration-500 hover:bg-[#f5f5f7]"
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
                </div>
                </div>
            </nav>
        </>
    )
}
