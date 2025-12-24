'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    // Update mouse position without re-rendering
    const updateMousePosition = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    // Smooth follow with GSAP
    const animateCursor = () => {
      gsap.to(cursor, {
        x: mousePos.current.x - 16,
        y: mousePos.current.y - 16,
        duration: 0.3,
        ease: 'power2.out'
      })

      gsap.to(dot, {
        x: mousePos.current.x - 2,
        y: mousePos.current.y - 2,
        duration: 0.1,
        ease: 'power2.out'
      })

      requestAnimationFrame(animateCursor)
    }

    // Handle hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-hover')
      ) {
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const relatedTarget = e.relatedTarget as HTMLElement
      
      // Only scale down if we're not moving to another hoverable element
      if (
        relatedTarget &&
        !relatedTarget.closest('a') &&
        !relatedTarget.closest('button') &&
        relatedTarget.tagName !== 'A' &&
        relatedTarget.tagName !== 'BUTTON' &&
        !relatedTarget.classList.contains('cursor-hover')
      ) {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    
    animateCursor()

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return (
    <>
      {/* Outer cursor ring */}
      <div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ 
          left: 0, 
          top: 0,
          willChange: 'transform'
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ 
          left: 0, 
          top: 0,
          willChange: 'transform'
        }}
      />
    </>
  )
}
