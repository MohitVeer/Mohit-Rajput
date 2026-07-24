import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

// Guard against a missing .env during local dev — the admin page renders
// a clear "not configured" state instead of a blank crash.
export const supabase = supabaseConfigured
  ? createClient(url as string, anonKey as string, { auth: { persistSession: true } })
  : null
