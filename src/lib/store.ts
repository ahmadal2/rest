// src/lib/store.ts
import { create } from 'zustand'
import { supabase } from './supabase'

export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  created_at?: string
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  signOut: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

// Create the store
export const useAuthStore = create<AuthState>()((set, get) => {
  // Initialize loading state
  set({ loading: true, user: null })
  
  // Function to fetch user data
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url, created_at')
        .eq('id', userId)
        .single()
      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Exception fetching user data:', error)
      return null
    }
  }
  
  // Check for existing session
  supabase.auth.getSession().then(async ({ data: { session } }) => {
    if (session?.user) {
      const userData = await fetchUserData(session.user.id)
      set({ 
        user: userData || { 
          id: session.user.id, 
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User', 
          email: session.user.email || '' // Fix: Leerer String als Standardwert
        },
        loading: false
      })
    } else {
      set({ user: null, loading: false })
    }
  })
  
  // Auth state change listener
  const { data: { subscription: _subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      fetchUserData(session.user.id).then(userData => {
        set({ 
          user: userData || { 
            id: session.user.id, 
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User', 
            email: session.user.email || '' // Fix: Leerer String als Standardwert
          },
          loading: false
        })
      })
    } else {
      set({ user: null, loading: false })
    }
  })
  
  return {
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    signOut: async () => {
      await supabase.auth.signOut()
      set({ user: null, loading: false })
    },
  }
})

// Export selector hooks
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthLoading = () => useAuthStore((state) => state.loading)