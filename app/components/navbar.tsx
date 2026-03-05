'use client'

import { profile } from '@/data/profile'

export default function NavBar() {
    const links = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

    const handleScroll = (id: string) => {
        const el = document.getElementById(id.toLowerCase())
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className="sticky top-0 w-full h-[80px] border-b border-[#333] z-50 flex items-center justify-between px-6 md:px-12 xl:px-24 bg-black/40 backdrop-blur-xl">
            <div className="font-bold text-xl tracking-tighter text-[#f5f5f7]">
                RC.
            </div>
            <div className="hidden md:flex items-center gap-8 ml-[5vw]">
                {links.map((link) => (
                    <button
                        key={link}
                        onClick={() => handleScroll(link)}
                        className="text-sm font-medium text-[#86868b] uppercase tracking-widest hover:text-[#f5f5f7] transition-colors"
                    >
                        {link}
                    </button>
                ))}
            </div>
            <a
                href={`mailto:${profile.email}`}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#333] bg-black px-6 py-2 text-sm font-semibold transition-all duration-500 hover:bg-[#f5f5f7]"
            >
                <div className="relative flex overflow-hidden">
                    <span className="inline-block text-[#f5f5f7] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%] md:group-hover:-translate-y-[120%]">
                        LET'S TALK
                    </span>
                    <span className="absolute left-0 top-0 inline-block translate-y-[150%] text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 md:group-hover:translate-y-0">
                        LET'S TALK
                    </span>
                </div>
            </a>
        </nav>
    )
}
