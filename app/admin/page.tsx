'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { ProjectRow } from '@/lib/projects'
import { slugifyProjectTitle } from '@/lib/slug'

type FormState = {
  id?: string
  title: string
  description: string
  impact: string
  tech: string // comma-separated in the form, split into an array on save
  link_live: string
  link_github: string
  featured: boolean
  mediaType: 'none' | 'video' | 'images' | 'marquee_images'
  video_url: string
  images: string[]
  marquee_images: string[]
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  impact: '',
  tech: '',
  link_live: '',
  link_github: '',
  featured: false,
  mediaType: 'none',
  video_url: '',
  images: [],
  marquee_images: [],
}

function rowToForm(row: ProjectRow): FormState {
  let mediaType: FormState['mediaType'] = 'none'
  if (row.video_url) mediaType = 'video'
  else if (row.marquee_images?.length) mediaType = 'marquee_images'
  else if (row.images?.length) mediaType = 'images'

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    impact: row.impact,
    tech: row.tech.join(', '),
    link_live: row.link_live ?? '',
    link_github: row.link_github ?? '',
    featured: row.featured,
    mediaType,
    video_url: row.video_url ?? '',
    images: row.images ?? [],
    marquee_images: row.marquee_images ?? [],
  }
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthChecked(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!authChecked) {
    return <div className="min-h-screen bg-black" />
  }

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] px-6 py-12 md:px-12">
      {session ? <Dashboard /> : <LoginForm />}
    </div>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2997ff]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#121212] border border-[#333] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2997ff]"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f5f5f7] text-black font-semibold rounded-lg px-4 py-3 text-sm disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

function Dashboard() {
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FormState | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) alert(error.message)
    else load()
  }

  const handleToggleFeatured = async (row: ProjectRow) => {
    const { error } = await supabase
      .from('projects')
      .update({ featured: !row.featured })
      .eq('id', row.id)
    if (error) alert(error.message)
    else load()
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= projects.length) return
    const a = projects[index]
    const b = projects[targetIndex]
    const { error } = await supabase.from('projects').upsert([
      { id: a.id, sort_order: b.sort_order },
      { id: b.id, sort_order: a.sort_order },
    ])
    if (error) alert(error.message)
    else load()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setEditing({ ...EMPTY_FORM })}
            className="bg-[#f5f5f7] text-black font-semibold rounded-lg px-4 py-2 text-sm"
          >
            + Add Project
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="border border-[#333] rounded-lg px-4 py-2 text-sm text-[#86868b] hover:text-[#f5f5f7]"
          >
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-[#86868b]">Loading…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center gap-4 bg-[#121212] border border-[#222] rounded-xl px-4 py-3"
            >
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="text-[#86868b] hover:text-[#f5f5f7] disabled:opacity-20 text-xs leading-none"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === projects.length - 1}
                  className="text-[#86868b] hover:text-[#f5f5f7] disabled:opacity-20 text-xs leading-none"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>

              <div className="w-16 h-10 rounded-md bg-[#0a0a0a] border border-[#222] overflow-hidden shrink-0 flex items-center justify-center">
                {row.images?.[0] || row.marquee_images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.images?.[0] ?? row.marquee_images?.[0]} alt="" className="w-full h-full object-cover" />
                ) : row.video_url ? (
                  <span className="text-[10px] text-[#555]">VIDEO</span>
                ) : (
                  <span className="text-[10px] text-[#555]">—</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{row.title}</div>
                <div className="text-xs text-[#86868b] truncate">{row.tech.join(', ')}</div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#86868b] shrink-0">
                <input
                  type="checkbox"
                  checked={row.featured}
                  onChange={() => handleToggleFeatured(row)}
                />
                Featured
              </label>

              <button
                onClick={() => setEditing(rowToForm(row))}
                className="text-sm text-[#2997ff] shrink-0"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="text-sm text-red-400 shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProjectFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            load()
          }}
        />
      )}
    </div>
  )
}

function ProjectFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: FormState
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormState>(initial)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFiles = async (files: FileList, target: 'images' | 'marquee_images' | 'video_url') => {
    setUploading(true)
    setError(null)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(path, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('project-media').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
      if (target === 'video_url') {
        setForm((f) => ({ ...f, video_url: urls[0] }))
      } else {
        setForm((f) => ({ ...f, [target]: [...f[target], ...urls] }))
      }
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (target: 'images' | 'marquee_images', url: string) => {
    setForm((f) => ({ ...f, [target]: f[target].filter((u) => u !== url) }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      title: form.title.trim(),
      slug: slugifyProjectTitle(form.title),
      description: form.description.trim(),
      impact: form.impact.trim(),
      tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean),
      link_live: form.link_live.trim() || null,
      link_github: form.link_github.trim() || null,
      featured: form.featured,
      video_url: form.mediaType === 'video' ? form.video_url || null : null,
      images: form.mediaType === 'images' ? form.images : [],
      marquee_images: form.mediaType === 'marquee_images' ? form.marquee_images : [],
    }

    if (form.id) {
      const { error } = await supabase.from('projects').update(payload).eq('id', form.id)
      setSaving(false)
      if (error) return setError(error.message)
    } else {
      // New projects go to the end of the list.
      const { data: maxRow } = await supabase
        .from('projects')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle()
      const nextSortOrder = (maxRow?.sort_order ?? -1) + 1

      const { error } = await supabase.from('projects').insert({ ...payload, sort_order: nextSortOrder })
      setSaving(false)
      if (error) return setError(error.message)
    }

    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#121212] border border-[#333] rounded-2xl max-w-2xl w-full p-6 md:p-8 my-8">
        <h2 className="text-xl font-bold mb-6">{form.id ? 'Edit Project' : 'Add Project'}</h2>

        <div className="flex flex-col gap-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="admin-input"
            />
          </Field>

          <Field label="Impact / Results">
            <textarea
              value={form.impact}
              onChange={(e) => setForm({ ...form, impact: e.target.value })}
              rows={2}
              className="admin-input"
            />
          </Field>

          <Field label="Tech (comma-separated)">
            <input
              value={form.tech}
              onChange={(e) => setForm({ ...form, tech: e.target.value })}
              placeholder="React, Node.js, PostgreSQL"
              className="admin-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL">
              <input
                value={form.link_live}
                onChange={(e) => setForm({ ...form, link_live: e.target.value })}
                placeholder="https://…"
                className="admin-input"
              />
            </Field>
            <Field label="GitHub URL">
              <input
                value={form.link_github}
                onChange={(e) => setForm({ ...form, link_github: e.target.value })}
                placeholder="https://…"
                className="admin-input"
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Show on homepage (featured)
          </label>

          <Field label="Media type">
            <select
              value={form.mediaType}
              onChange={(e) => setForm({ ...form, mediaType: e.target.value as FormState['mediaType'] })}
              className="admin-input"
            >
              <option value="none">None</option>
              <option value="video">Video</option>
              <option value="images">Image carousel</option>
              <option value="marquee_images">Scrolling image marquee</option>
            </select>
          </Field>

          {form.mediaType === 'video' && (
            <Field label="Video">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && uploadFiles(e.target.files, 'video_url')}
                className="text-sm"
              />
              {form.video_url && (
                <video src={form.video_url} controls className="mt-2 w-full rounded-lg max-h-48" />
              )}
            </Field>
          )}

          {(form.mediaType === 'images' || form.mediaType === 'marquee_images') && (
            <Field label={form.mediaType === 'images' ? 'Images' : 'Marquee images'}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && uploadFiles(e.target.files, form.mediaType as 'images' | 'marquee_images')}
                className="text-sm"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form[form.mediaType as 'images' | 'marquee_images'].map((url) => (
                  <div key={url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-[#333]" />
                    <button
                      onClick={() => removeImage(form.mediaType as 'images' | 'marquee_images', url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </Field>
          )}

          {uploading && <p className="text-sm text-[#86868b]">Uploading…</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="bg-[#f5f5f7] text-black font-semibold rounded-lg px-5 py-2.5 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="border border-[#333] rounded-lg px-5 py-2.5 text-sm text-[#86868b] hover:text-[#f5f5f7]"
          >
            Cancel
          </button>
        </div>
      </div>

      <style jsx global>{`
        .admin-input {
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 0.5rem;
          padding: 0.6rem 0.9rem;
          font-size: 0.875rem;
          color: #f5f5f7;
          width: 100%;
        }
        .admin-input:focus {
          outline: none;
          border-color: #2997ff;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#86868b] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
