import { supabase } from './supabase/client'

// Raw shape of a row in the `projects` table (see the Supabase migration).
export type ProjectRow = {
  id: string
  title: string
  slug: string
  description: string
  impact: string
  tech: string[]
  images: string[]
  marquee_images: string[]
  video_url: string | null
  link_live: string | null
  link_github: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Shape the existing site components already expect (they were built
// against the static data/profile.ts array) — mapping DB rows into this
// shape meant zero changes to component internals, only to where the data
// comes from.
export type Project = {
  id: string
  slug: string
  title: string
  description: string
  impact: string
  tech: string[]
  images?: string[]
  marqueeImages?: string[]
  video?: string
  links: { live?: string; github?: string }
}

function mapRow(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    impact: row.impact,
    tech: row.tech,
    images: row.images?.length ? row.images : undefined,
    marqueeImages: row.marquee_images?.length ? row.marquee_images : undefined,
    video: row.video_url ?? undefined,
    links: {
      live: row.link_live ?? '#',
      github: row.link_github ?? '#',
    },
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? mapRow(data) : null
}
