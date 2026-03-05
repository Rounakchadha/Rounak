'use client'
import { useEffect, useState } from 'react'

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export default function DecryptText({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) {
    const [displayText, setDisplayText] = useState(text)

    useEffect(() => {
        let interval: NodeJS.Timeout
        let loop: NodeJS.Timeout

        const trigger = () => {
            let iteration = 0
            clearInterval(interval)
            interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration || letter === " ") return text[index]
                            return LETTERS[Math.floor(Math.random() * 26)]
                        })
                        .join("")
                )
                if (iteration >= text.length) clearInterval(interval)
                iteration += 1 / 3
            }, 30)
        }

        const start = setTimeout(() => {
            trigger() // initial load
            loop = setInterval(trigger, 6000) // repeat every 6s
        }, delay * 1000)

        return () => {
            clearTimeout(start)
            clearInterval(interval)
            clearInterval(loop)
        }
    }, [text, delay])

    return <span className={className}>{displayText}</span>
}
