'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function createUserProfile(userId: string, email: string, username: string) {
  try {
    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase.from('users').insert({
      id: userId,
      email,
      username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    })

    if (error) {
      console.error('Error creating user profile:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception creating user profile:', error)
    return { success: false, error: error.message }
  }
}