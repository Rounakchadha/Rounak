'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { profile } from '@/data/profile'

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const headingClipPath = useTransform(scrollYProgress, [0.1, 0.3], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"])
    const headingY = useTransform(scrollYProgress, [0.1, 0.3], [50, 0])

    // We want the text to "light up" as we scroll.
    // We'll split the summary into chunks to animate them.
    const words = profile.summary.split(' ')

    return (
        <section
            id="about"
            ref={containerRef}
            className="relative min-h-screen bg-[#121212] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center py-32 px-6 md:px-12 xl:px-24"
        >
            <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">

                <p className="font-semibold tracking-[0.2em] text-[#86868b] uppercase text-sm mb-16 self-start md:self-center">
                    Overview
                </p>

                <div className="flex flex-col items-center w-full">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold tracking-tight text-[#f5f5f7] mb-8 w-full text-center"
                        style={{ clipPath: headingClipPath, y: headingY }}
                    >
                        FULL STACK DEVELOPER
                    </motion.h1>

                    <div className="w-full max-w-5xl">
                        <h2 className="text-xl md:text-3xl lg:text-4xl font-medium leading-[1.6] tracking-tight text-center md:text-justify w-full [text-align-last:center] md:[text-align-last:left]">
                            {words.map((word, i) => {
                                // Calculate a staggered highlight effect based on scroll position
                                const start = 0.2 + (i / words.length) * 0.4
                                const end = start + 0.1
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                const y = useTransform(scrollYProgress, [start, end], [10, 0])

                                return (
                                    <span key={i}>
                                        <motion.span
                                            className="inline-block"
                                            style={{ opacity, y }}
                                        >
                                            {word}
                                        </motion.span>
                                        {i < words.length - 1 && " "}
                                    </span>
                                )
                            })}
                        </h2>
                    </div>
                </div>

                {/* Stats / Highlights grid appearing after text */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 border-t border-[#333] pt-16">
                    {profile.highlights.map((highlight, index) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const statOpacity = useTransform(scrollYProgress, [0.4 + (index * 0.05), 0.5 + (index * 0.05)], [0, 1])
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const statY = useTransform(scrollYProgress, [0.4 + (index * 0.05), 0.5 + (index * 0.05)], [20, 0])

                        return (
                            <motion.div
                                key={index}
                                style={{ opacity: statOpacity, y: statY }}
                                className="flex flex-col items-start md:items-center text-left md:text-center"
                            >
                                <div className="text-[#2997ff] text-2xl md:text-3xl font-bold mb-2">
                                    {/* Extract leading number if present for impact */}
                                    {highlight.match(/^[\d+%]+/) ? highlight.match(/^[\d+%]+/)?.[0] : "•"}
                                </div>
                                <div className="text-[#86868b] text-sm md:text-base font-medium leading-snug">
                                    {highlight.replace(/^[\d+%]+\s*/, '')}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
