'use client'

export default function Aurora() {
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0"
            style={{ mixBlendMode: 'screen', filter: 'blur(100px)' }}
        >
            <div
                className="absolute rotate-[20deg] w-[60vw] h-[60vh] rounded-full top-[-10%] left-[-10%]"
                style={{
                    background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                    animation: 'aurora-1 25s ease-in-out infinite alternate'
                }}
            />
            <div
                className="absolute rotate-[-15deg] w-[50vw] h-[50vh] rounded-full bottom-[-10%] right-[-10%]"
                style={{
                    background: 'radial-gradient(circle, var(--accent-green) 0%, transparent 70%)',
                    animation: 'aurora-2 30s ease-in-out infinite alternate-reverse'
                }}
            />

            <style jsx>{`
                @keyframes aurora-1 {
                    0% { transform: translate(0, 0) scale(1) rotate(20deg); opacity: 0.1; }
                    50% { transform: translate(10%, 15%) scale(1.2) rotate(40deg); opacity: 0.2; }
                    100% { transform: translate(-5%, 5%) scale(0.9) rotate(0deg); opacity: 0.1; }
                }
                @keyframes aurora-2 {
                    0% { transform: translate(0, 0) scale(1) rotate(-15deg); opacity: 0.05; }
                    50% { transform: translate(-10%, -10%) scale(1.1) rotate(5deg); opacity: 0.15; }
                    100% { transform: translate(5%, -5%) scale(0.95) rotate(-30deg); opacity: 0.05; }
                }
            `}</style>
        </div>
    )
}
