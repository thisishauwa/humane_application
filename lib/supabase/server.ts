import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createClient = async (cookieStore: ReturnType<typeof cookies>) => {
  try {
    const cookieStoreResolved = await cookieStore
    
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStoreResolved.get(name)
            return cookie?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStoreResolved.set({ name, value, ...options })
            } catch (error) {
              console.error('Error setting cookie:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStoreResolved.set({ name, value: '', ...options })
            } catch (error) {
              console.error('Error removing cookie:', error)
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
} 