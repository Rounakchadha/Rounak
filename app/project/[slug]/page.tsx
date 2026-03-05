import { profile } from '@/data/profile'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    return profile.projects.map((project) => ({
        slug: project.title.split('—')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }))
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
    const project = profile.projects.find(
        p => p.title.split('—')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.slug
    )

    if (!project) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6 md:px-12 xl:px-24">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/#projects"
                    className="inline-flex items-center text-[#86868b] hover:text-[#f5f5f7] transition-colors mb-16"
                >
                    ← Back to Portfolio
                </Link>

                <h1 className="text-5xl md:text-7xl font-bold text-[#f5f5f7] tracking-tight mb-8">
                    {project.title.split('—')[0].trim()}
                </h1>

                <div className="flex flex-wrap gap-3 mb-16">
                    {project.tech.map((t: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-[#121212] rounded-full text-sm font-medium text-[#a1a1a6] border border-[#333]">
                            {t}
                        </span>
                    ))}
                </div>

                <div className="space-y-12 text-[#a1a1a6] text-xl leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-[#f5f5f7] mb-6 border-b border-[#333] pb-4">
                            Overview
                        </h2>
                        <p>{project.description}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-[#f5f5f7] mb-6 border-b border-[#333] pb-4">
                            Impact & Results
                        </h2>
                        <p>{project.impact}</p>
                    </section>

                    <div className="flex gap-6 pt-12 border-t border-[#333]">
                        {project.links?.live && (
                            <a
                                href={project.links.live}
                                target="_blank"
                                rel="noreferrer"
                                className="px-8 py-4 bg-[#f5f5f7] text-black font-semibold rounded-full hover:bg-white transition-colors"
                            >
                                View Live Project
                            </a>
                        )}
                        {project.links?.github && (
                            <a
                                href={project.links.github}
                                target="_blank"
                                rel="noreferrer"
                                className="px-8 py-4 bg-transparent border border-[#555] text-[#f5f5f7] font-semibold rounded-full hover:bg-[#1a1a1a] transition-colors"
                            >
                                View Code
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
