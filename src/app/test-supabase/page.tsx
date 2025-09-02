// src/app/test-supabase/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('')

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('users').select('count').single()
      
      if (error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus(`Success: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      // Fix: Check if err is an Error instance before accessing message
      setStatus(`Exception: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
      <button 
        onClick={testConnection}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Connection
      </button>
      <div className="mt-4 p-4 bg-gray-800 rounded">
        {status}
      </div>
    </div>
  )
}