'use client'

import NavBar from '../components/navbar'
import SmoothScroll from '../components/smoothScroll'
import AllProjectsGallery from '../components/AllProjectsGallery'

export default function ProjectsPage() {
  return (
    <SmoothScroll>
      <div className="relative w-full bg-black min-h-screen text-white">
        <NavBar />
        <div className="pt-24">
          <AllProjectsGallery />
        </div>
      </div>
    </SmoothScroll>
  )
}
