import { MetadataRoute } from 'next'
import { profile } from '@/data/profile'
import { slugifyProjectTitle } from '@/lib/slug'

export default function sitemap(): MetadataRoute.Sitemap {
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

  const projectRoutes: MetadataRoute.Sitemap = profile.projects.map((project) => ({
    url: `${base}/project/${slugifyProjectTitle(project.title)}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes]
}
