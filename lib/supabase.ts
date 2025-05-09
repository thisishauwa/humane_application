import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const supabase = createClientComponentClient<Database>()

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