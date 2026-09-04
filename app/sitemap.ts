import { MetadataRoute } from 'next'
import { profile } from '@/data/profile'
import { getAllProjects } from '@/lib/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = profile.siteUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${base}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  const projects = await getAllProjects()
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/project/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
