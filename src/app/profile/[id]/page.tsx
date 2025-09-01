'use client'

import { useAuthStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Profile() {
  const currentUser = useAuthStore((state) => state.user)
  const { id } = useParams()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetchUserProfile()
  }, [id])

  useEffect(() => {
    if (!profileUser?.id) return
    fetchUserPosts()
  }, [profileUser?.id])

  const fetchUserProfile = async () => {
    setUserLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url, created_at')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
      } else {
        setProfileUser(data)
      }
    } catch (error) {
      console.error('Exception fetching user profile:', error)
    } finally {
      setUserLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, media_url, title, created_at')
        .eq('user_id', profileUser.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user posts:', error)
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Exception fetching user posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Lade Profil...</p>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>
          <p>Profil nicht gefunden.</p>
          <Link href="/" className="text-blue-400 ml-2">← Zurück</Link>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profileUser.id

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={profileUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profileUser.username}
            alt={profileUser.username}
            className="w-16 h-16 rounded-full"
            onError={(e) => {
              e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profileUser.username
            }}
          />
          <div>
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            <p className="text-gray-500">{posts.length} Beiträge</p>
          </div>
        </div>
        {isOwnProfile && (
          <Link href="/profile/edit" className="text-blue-400 hover:underline">Profil bearbeiten</Link>
        )}
        <Link href="/" className="text-blue-400 hover:underline block mt-2">← Zurück</Link>
      </div>

      {loading ? (
        <p className="text-center py-8">Lade Beiträge...</p>
      ) : posts.length === 0 ? (
        <p className="text-center py-8 text-gray-500">Keine Beiträge vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {posts.map((post) => (
            <div key={post.id} className="aspect-square rounded overflow-hidden">
              <img src={post.media_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}