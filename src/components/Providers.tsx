'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // The auth listener is now handled in the store
  // This component is kept for potential future use but doesn't need to do anything
  
  return <>{children}</>
}