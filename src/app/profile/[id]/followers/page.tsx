'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface User {
  id: string
  username: string
  avatar_url: string
}

interface Follower {
  follower_id: string
  users: User
}

// Page-Funktion direkt mit Typen für params
export default function FollowersPage() {
  const { id } = useParams<{ id: string }>()
  const [followers, setFollowers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFollowers = async () => {
    setLoading(true)
    try {
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
        .eq('following_id', id)

      if (error) console.error(error)
      else setFollowers(data?.map((f: Follower) => f.users) || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchFollowers()
    }
  }, [id])

  if (loading) return <p>Lädt...</p>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Follower</h1>
      {followers.length === 0 ? (
        <p>Keine Follower</p>
      ) : (
        <div className="space-y-4">
          {followers.map(user => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-3 p-3 bg-gray-900 rounded hover:bg-gray-800"
            >
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.username}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                }}
              />
              <span>{user.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
