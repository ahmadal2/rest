// src/app/auth/callback/route.tsx
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/ssr'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(new URL(`/auth/signin?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDescription || '')}`, request.url))
  }

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      console.log('Exchanging code for session:', code)
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError.message || exchangeError)
        return NextResponse.redirect(new URL('/auth/signin?error=auth_failed&message=Failed to authenticate', request.url))
      }
      
      // Get user data from the session
      const user = data?.session?.user
      console.log('Session user:', user?.id)
      
      if (user) {
        try {
          // Check if user profile already exists
          const serverSupabase = createServerSupabaseClient()
          const { data: existingUser, error: fetchError } = await serverSupabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single()
          
          console.log('Existing user check:', { existingUser, fetchError })
          
          // If user profile doesn't exist, create it
          if (!existingUser && !fetchError) {
            const username = user.user_metadata?.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`
            console.log('Creating new user profile:', { id: user.id, email: user.email, username })
            
            const { error: insertError } = await serverSupabase.from('users').insert({
              id: user.id,
              email: user.email,
              username: username,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            })
            
            if (insertError) {
              console.error('Error creating user profile:', insertError.message || insertError)
            } else {
              console.log('User profile created successfully')
            }
          } else if (existingUser) {
            console.log('User profile already exists')
          } else if (fetchError) {
            console.error('Error checking for existing user:', fetchError.message || fetchError)
          }
        } catch (profileError) {
          console.error('Exception handling user profile:', profileError.message || profileError)
        }
      }
    } catch (exchangeError) {
      console.error('Exception exchanging code for session:', exchangeError.message || exchangeError)
      return NextResponse.redirect(new URL('/auth/signin?error=auth_failed&message=Authentication failed', request.url))
    }
  }

  // Redirect to home page after successful authentication
  console.log('Redirecting to home page')
  return NextResponse.redirect(new URL('/', request.url))
}