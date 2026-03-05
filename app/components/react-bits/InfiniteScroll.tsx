'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function InfiniteScroll({ text, speed = 1, className }: { text: string, speed?: number, className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        const xPercent = { value: 0 }
        let request: number

        const update = () => {
            xPercent.value -= speed * 0.05
            if (xPercent.value <= -50) xPercent.value = 0
            gsap.set(containerRef.current, { xPercent: xPercent.value })
            request = requestAnimationFrame(update)
        }
        request = requestAnimationFrame(update)
        return () => cancelAnimationFrame(request)
    }, [speed])

    return (
        <div className="overflow-hidden whitespace-nowrap flex py-6 border-y border-[var(--border)] bg-[var(--bg-surface)]">
            <div ref={containerRef} className="flex gap-8 m-0 p-0 pr-8">
                <div className={className || "font-display text-[var(--font-hero)] text-[var(--text-tertiary)] opacity-[0.15] tracking-wide uppercase select-none"}>
                    {text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}
                </div>
                <div className={className || "font-display text-[var(--font-hero)] text-[var(--text-tertiary)] opacity-[0.15] tracking-wide uppercase select-none"}>
                    {text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}
                </div>
            </div>
        </div>
    )
}
