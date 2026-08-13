'use client'

import { motion } from 'framer-motion'
import { StaggeredMenu } from './StaggeredMenu'
import { Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '@/data/profile'

export default function Navigation() {
  const menuItems = [
    { label: 'About', ariaLabel: 'About', link: '#about' },
    { label: 'Work', ariaLabel: 'Work', link: '#projects' },
    { label: 'Contact', ariaLabel: 'Contact', link: '#contact' }
  ];

  const socialItems = [
    { label: 'LinkedIn', id: 'linkedin', link: profile.socials.linkedin },
    { label: 'GitHub', id: 'github', link: profile.socials.github },
    { label: 'Email', id: 'email', link: `mailto:${profile.socials.email}` },
    { label: 'WhatsApp', id: 'whatsapp', link: profile.socials.whatsapp }
  ];

  return (
    <>
      {/* Mobile Navigation (Staggered Menu) */}
      <div className="md:hidden">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering={true}
          menuButtonColor="#ffffff"
          openMenuButtonColor="#111"
          changeMenuColorOnOpen={true}
          colors={['#1a1a1a', '#333333']}
          accentColor="#5227FF"
          isFixed={true}
        />
      </div>

      {/* Desktop Navigation (Original) */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden md:block fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4"
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'none'
        }}
      >
        <div className="flex items-center w-full">
          {/* RC Logo on extreme left */}
          <div className="w-1/3 flex justify-start">
            <a href="/" className="text-xl sm:text-2xl font-bold text-gray-900">
              RC
            </a>
          </div>
          
          {/* Social Icons in the middle */}
          <div className="w-1/3 flex justify-center items-center gap-6">
            {socialItems.map((s, i) => {
              let Icon = null
              if (s.id === 'github') Icon = <Github className="w-5 h-5" />
              if (s.id === 'linkedin') Icon = <Linkedin className="w-5 h-5" />
              if (s.id === 'email') Icon = <Mail className="w-5 h-5" />
              if (s.id === 'whatsapp') Icon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path></svg>
              
              return (
                <a 
                  key={i} 
                  href={s.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-900 hover:text-emerald-700 transition-colors duration-200"
                  aria-label={s.label}
                >
                  {Icon}
                </a>
              )
            })}
          </div>

          {/* Navigation links on the right */}
          <div className="w-1/3 flex justify-end items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            <a 
              href="#about" 
              className="text-gray-900 text-sm sm:text-base font-medium hover:text-emerald-700 transition-colors duration-200"
            >
              About
            </a>
            <a 
              href="#projects" 
              className="text-gray-900 text-sm sm:text-base font-medium hover:text-emerald-700 transition-colors duration-200"
            >
              Work
            </a>
            <a 
              href="#contact" 
              className="text-gray-900 text-sm sm:text-base font-medium hover:text-emerald-700 transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
