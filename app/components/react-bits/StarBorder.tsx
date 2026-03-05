'use client'
import { ReactNode } from 'react'

export default function StarBorder({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div className={`relative group overflow-hidden ${className || ""}`}>
            {children}
            {/* Animated borders on hover using plain CSS keyframes for smooth continuous performance */}
            <span className="absolute left-0 bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent -translate-x-full group-hover:transition-none transition-all duration-300 ease-out 
                group-hover:animate-[starborder_1s_ease-in-out_infinite]" />
            <span className="absolute right-0 bottom-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent -translate-y-full group-hover:transition-none transition-all duration-300 ease-out 
                group-hover:animate-[starborder-v_1s_ease-in-out_infinite_0.25s]" />
            <span className="absolute top-0 right-0 h-[1px] w-full bg-gradient-to-l from-transparent via-[var(--accent)] to-transparent translate-x-full group-hover:transition-none transition-all duration-300 ease-out 
                group-hover:animate-[starborder-reverse_1s_ease-in-out_infinite_0.5s]" />
            <span className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-t from-transparent via-[var(--accent)] to-transparent translate-y-full group-hover:transition-none transition-all duration-300 ease-out 
                group-hover:animate-[starborder-v-reverse_1s_ease-in-out_infinite_0.75s]" />

            <style jsx>{`
                @keyframes starborder { 0% { transform: translateX(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(100%); opacity: 0; } }
                @keyframes starborder-v { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(100%); opacity: 0; } }
                @keyframes starborder-reverse { 0% { transform: translateX(100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(-100%); opacity: 0; } }
                @keyframes starborder-v-reverse { 0% { transform: translateY(100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-100%); opacity: 0; } }
            `}</style>
        </div>
    )
}
