'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollReveal({ text, className }: { text: string, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] })
    const clipPath = useTransform(scrollYProgress, [0, 1], ["polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"])

    return (
        <div ref={ref} className={`relative inline-block text-[var(--text-secondary)] ${className || ""}`}>
            {text}
            <motion.div
                style={{ clipPath }}
                className="absolute inset-0 text-[var(--text-primary)]"
                aria-hidden="true"
            >
                {text}
            </motion.div>
        </div>
    )
}
