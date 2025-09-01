'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [session, setSession] = useState(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('users').select('count').single()
        
        if (error) {
          setStatus(`Error: ${error.message}`)
          return
        }
        
        setStatus(`Success: ${JSON.stringify(data)}`)
      } catch (err) {
        setStatus(`Exception: ${err.message}`)
      }
    }

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session error:', error)
        } else {
          setSession(session)
          console.log('Session:', session)
        }
      } catch (err) {
        console.error('Session exception:', err)
      }
    }

    testConnection()
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      <p>Status: {status}</p>
      <p>Session: {session ? 'Found' : 'Not found'}</p>
      {session && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}