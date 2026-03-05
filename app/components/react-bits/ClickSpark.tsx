'use client'
import { useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ClickSpark({ children, className }: { children: ReactNode, className?: string }) {
    const [sparks, setSparks] = useState<{ id: number, x: number, y: number }[]>([])

    const handleClick = useCallback((e: React.MouseEvent) => {
        const { clientX, clientY } = e
        const id = Date.now()
        setSparks(prev => [...prev.slice(-3), { id, x: clientX, y: clientY }]) // Keep max 4 sparks at a time
        setTimeout(() => {
            setSparks(prev => prev.filter(s => s.id !== id))
        }, 600)
    }, [])

    return (
        <div onClick={handleClick} className={`relative inline-block ${className || ""}`}>
            {children}
            {typeof window !== 'undefined' && document.body && (
                <AnimatePresence>
                    {sparks.map(spark => (
                        <div
                            key={spark.id}
                            style={{ position: 'fixed', left: spark.x, top: spark.y, zIndex: 99999, pointerEvents: 'none' }}
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        scale: [0, 1.5, 0],
                                        x: (Math.cos(i * 60 * Math.PI / 180) * 50),
                                        y: (Math.sin(i * 60 * Math.PI / 180) * 50),
                                        opacity: 0
                                    }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                    className="absolute w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                    style={{ boxShadow: 'var(--glow-accent)' }}
                                />
                            ))}
                        </div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    )
}
