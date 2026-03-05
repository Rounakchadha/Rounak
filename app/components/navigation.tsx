'use client'

import { motion } from 'framer-motion'

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4"
      style={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        backdropFilter: 'none'
      }}
    >
      <div className="flex justify-between items-center">
        {/* RC Logo on extreme left */}
        <a href="/" className="text-xl sm:text-2xl font-bold text-gray-900">
          RC
        </a>
        
        {/* Navigation links on the right */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
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
  )
}
