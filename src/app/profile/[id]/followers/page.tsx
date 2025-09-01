'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Followers({ params }) {
  const [followers, setFollowers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFollowers()
  }, [params.id])

  const fetchFollowers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        users!followers_follower_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('following_id', params.id)

    if (error) {
      console.error('Fehler beim Laden der Follower:', error)
    } else {
      setFollowers(data.map(f => f.users) || [])
    }
    setLoading(false)
  }

  if (loading) return <p>Lädt...</p>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Follower</h1>
      {followers.length === 0 ? (
        <p>Keine Follower</p>
      ) : (
        <div className="space-y-4">
          {followers.map(user => (
            <Link key={user.id} href={`/profile/${user.id}`} className="flex items-center gap-3 p-3 bg-gray-900 rounded hover:bg-gray-800">
              <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full" />
              <span>{user.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}