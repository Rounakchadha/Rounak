'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function BlurText({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-10%" })
    const words = text.split(" ")

    return (
        <div ref={ref} className={`flex flex-wrap ${className || ""}`}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
                    animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: delay + i * 0.1, ease: 'easeOut' }}
                    className="mr-2 mb-1"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    )
}
