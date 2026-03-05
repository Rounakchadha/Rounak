'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Hide loader after 800ms to allow split animation to play, completing at 1.2s
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isLoading && (
                <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col">
                    {/* Top Half */}
                    <motion.div
                        className="h-1/2 w-full bg-[#060608] relative overflow-hidden"
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="absolute w-full h-[200%] top-0 left-0 flex items-center justify-center">
                            <span
                                className="font-display font-bold text-5xl tracking-tighter"
                                style={{
                                    color: 'var(--accent)',
                                    textShadow: '0 0 20px rgba(0,229,255,0.6)'
                                }}
                            >
                                RC
                            </span>
                        </div>
                    </motion.div>
                    {/* Bottom Half */}
                    <motion.div
                        className="h-1/2 w-full bg-[#060608] relative overflow-hidden"
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="absolute w-full h-[200%] bottom-0 left-0 flex items-center justify-center">
                            <span
                                className="font-display font-bold text-5xl tracking-tighter"
                                style={{
                                    color: 'var(--accent)',
                                    textShadow: '0 0 20px rgba(0,229,255,0.6)'
                                }}
                            >
                                RC
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
