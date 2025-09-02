'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function createUserProfile(userId: string, email: string, username: string) {
  try {
    // Create a server-side Supabase client
    const supabase = await createServerSupabaseClient()
    
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
  } catch (error: unknown) {
    console.error('Exception creating user profile:', error)
    // Type guard to check if error has a message property
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    // Fallback for unknown error types
    return { success: false, error: 'An unknown error occurred' }
  }
}