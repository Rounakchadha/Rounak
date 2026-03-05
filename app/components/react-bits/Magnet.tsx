'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

export default function Magnet({ children, className }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
    const xSpring = useSpring(x, springConfig)
    const ySpring = useSpring(y, springConfig)

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        x.set(middleX * 0.2)
        y.set(middleY * 0.2)
    }

    const reset = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: xSpring, y: ySpring }}
            className={`inline-block ${className || ""}`}
        >
            {children}
        </motion.div>
    )
}
