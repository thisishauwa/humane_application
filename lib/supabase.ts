import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type User = {
  id: string
  email: string
  created_at: string
}

export type Session = {
  user: User | null
  access_token: string | null
  refresh_token: string | null
} 