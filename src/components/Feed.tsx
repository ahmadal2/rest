'use client'  // ✅ Diese Zeile muss ganz oben stehen

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Post from './Post'

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts...')
      setLoading(true)
      setError(null)
      
      // Fixed the relationship reference to use the correct foreign key
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          caption,
          media_url,
          user_id,
          created_at,
          users!posts_user_id_fkey (id, username, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fehler beim Laden der Posts:', error.message || error)
        setError(error.message || 'Failed to load posts')
      } else {
        console.log('Posts fetched:', data)
        setPosts(data || [])
      }
    } catch (error: any) {
      console.error('Exception beim Laden der Posts:', error.message || error)
      setError(error.message || 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center p-4">Lade...</p>
  
  if (error) return <p className="text-center p-4 text-red-500">Fehler beim Laden der Posts: {error}</p>

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {posts.length > 0 ? (
        posts.map(post => (
          <Post key={post.id} post={post} />
        ))
      ) : (
        <div className="col-span-full text-center p-8">
          <p className="text-gray-500">No posts available</p>
        </div>
      )}
    </main>
  )
}