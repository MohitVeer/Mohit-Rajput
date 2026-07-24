import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '../lib/supabaseClient'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setChecked(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecked(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!supabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-muted-foreground">
        Supabase isn't configured for this deploy (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
      </div>
    )
  }

  if (!checked) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>
  }

  if (!session) {
    return <AdminLogin onSignedIn={() => {}} />
  }

  return <AdminDashboard onSignOut={() => setSession(null)} />
}
