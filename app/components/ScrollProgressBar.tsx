'use client'

import { useEffect, useRef } from 'react'

export default function ScrollProgressBar() {
    const barRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const bar = barRef.current
        if (!bar) return
        const update = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight
            bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%'
        }
        window.addEventListener('scroll', update, { passive: true })
        update()
        return () => window.removeEventListener('scroll', update)
    }, [])

    return (
        <div
            ref={barRef}
            id="scroll-progress-bar"
            style={{
                width: '0%',
                position: 'fixed',
                top: 0,
                left: 0,
                height: '2px',
                background: 'linear-gradient(to right, var(--accent), var(--accent-green))',
                boxShadow: 'var(--glow-accent)',
                zIndex: 9999,
                transition: 'width 0.1s ease-out'
            }}
            aria-hidden="true"
        />
    )
}
