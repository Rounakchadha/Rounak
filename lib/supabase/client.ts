import { createClient } from '@supabase/supabase-js'

// One shared client for both server-side reads (public pages) and
// client-side auth+writes (the /admin dashboard). supabase-js detects
// `window` itself and only persists a session in the browser, so this is
// safe to import from either a Server Component or a 'use client' one.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
