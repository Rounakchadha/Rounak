import type { Metadata } from 'next'
import { profile } from '@/data/profile'
import { getAllProjects } from '@/lib/projects'
import NavBar from '../components/navbar'
import SmoothScroll from '../components/smoothScroll'
import AllProjectsGallery from '../components/AllProjectsGallery'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getAllProjects()
  return {
    title: 'Projects',
    description: `A collection of ${projects.length}+ full-stack, AI, and product engineering projects built by ${profile.name} — spanning fintech, healthcare, AR/VR, and analytics.`,
    alternates: {
      canonical: '/projects',
    },
    openGraph: {
      title: `Projects | ${profile.name}`,
      description: `A collection of ${projects.length}+ full-stack, AI, and product engineering projects built by ${profile.name}.`,
      url: `${profile.siteUrl}/projects`,
      type: 'website',
    },
  }
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <SmoothScroll>
      <div className="relative w-full bg-black min-h-screen text-white">
        <NavBar />
        <div className="pt-24">
          <AllProjectsGallery projects={projects} />
        </div>
      </div>
    </SmoothScroll>
  )
}
