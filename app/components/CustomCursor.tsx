'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const tick = () => {
      const { x, y } = mousePos.current
      gsap.to(dot, { x: x - 4, y: y - 4, duration: 0.05, ease: 'none', overwrite: 'auto' })
      gsap.to(ring, { x: x - 20, y: y - 20, duration: 0.15, ease: 'power2.out', overwrite: 'auto' })
      rafRef.current = requestAnimationFrame(tick)
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'A' || t.tagName === 'BUTTON' || t.closest('a') || t.closest('button')) {
        gsap.to(ring, { width: 48, height: 48, x: mousePos.current.x - 24, y: mousePos.current.y - 24, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 0, duration: 0.2 })
      }
    }
    const onOut = (e: MouseEvent) => {
      const rel = e.relatedTarget as HTMLElement
      if (!rel || (!rel.closest('a') && !rel.closest('button'))) {
        gsap.to(ring, { width: 40, height: 40, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { opacity: 1, duration: 0.2 })
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        id="cursor-ring"
        ref={ringRef}
        style={{
          position: 'fixed', left: 0, top: 0, width: 40, height: 40,
          border: '1px solid rgba(56,189,248,0.7)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9997, willChange: 'transform',
          boxShadow: '0 0 12px rgba(56,189,248,0.3)',
        }}
      />
      <div
        id="cursor-dot"
        ref={dotRef}
        style={{
          position: 'fixed', left: 0, top: 0, width: 8, height: 8,
          background: 'radial-gradient(circle, #38bdf8, #818cf8)',
          borderRadius: '50%',
          pointerEvents: 'none', zIndex: 9997, willChange: 'transform',
          boxShadow: '0 0 8px rgba(56,189,248,0.9)',
        }}
      />
    </>
  )
}
