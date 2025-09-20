'use client'  // ✅ Diese Zeile muss ganz oben stehen
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Post from './Post'

// Define types for our data
interface User {
  id: string
  username: string
  email: string
  avatar_url: string
}

interface PostType {
  id: string
  title: string
  caption: string
  media_url: string
  user_id: string
  created_at: string
  users: User | null
}

// Interface for the raw data from Supabase
interface RawPostType {
  id: string
  title: string
  caption: string
  media_url: string
  user_id: string
  created_at: string
  users: Array<{
    id: string
    username: string
    email: string
    avatar_url: string
  }>
}

export default function Feed() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Fixed the any type issue
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // Fetch user data for a specific user ID with proper return type
  const fetchUserData = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url')
        .eq('id', userId)
        .single()
        
      if (error) {
        console.error('Error fetching user data:', error.message || error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Exception fetching user data:', error)
      return null
    }
  }

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
          users!posts_user_id_fkey (id, username, email, avatar_url)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Fehler beim Laden der Posts:', error.message || error)
        setError(error.message || 'Failed to load posts')
      } else {
        console.log('Posts fetched:', data)
        // Handle the nested user data properly
        const postsData: PostType[] = await Promise.all(
          (data as RawPostType[]).map(async (post: RawPostType) => {
            // Extract the first user from the array or null if empty
            let userData = post.users && post.users.length > 0 ? post.users[0] : null
            
            // If user data is missing but we have a user_id, fetch the user data
            if (!userData && post.user_id) {
              userData = await fetchUserData(post.user_id)
            }
            
            return {
              id: post.id,
              title: post.title,
              caption: post.caption,
              media_url: post.media_url,
              user_id: post.user_id,
              created_at: post.created_at,
              users: userData
            }
          })
        )
        
        setPosts(postsData || [])
      }
    } catch (error: unknown) {
      // Type guard to check if error has a message property
      if (error instanceof Error) {
        console.error('Exception beim Laden der Posts:', error.message)
        setError(error.message || 'Failed to load posts')
      } else {
        console.error('Exception beim Laden der Posts:', error)
        setError('Failed to load posts')
      }
    } finally {
      setLoading(false)
    }
  }

  // Set up real-time subscription for new posts
  const setupRealtimeSubscription = () => {
    // Create a channel for real-time updates
    const channel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        async (payload) => {
          console.log('New post received:', payload)
          const newPost = payload.new as {
            id: string
            title: string
            caption: string
            media_url: string
            user_id: string
            created_at: string
          }

          // Fetch user data for this post
          const userData = await fetchUserData(newPost.user_id)

          // Create a post object in the format we use
          const formattedPost: PostType = {
            id: newPost.id,
            title: newPost.title,
            caption: newPost.caption,
            media_url: newPost.media_url,
            user_id: newPost.user_id,
            created_at: newPost.created_at,
            users: userData
          }

          // Add the new post to the beginning of the posts array
          setPosts(prevPosts => [formattedPost, ...prevPosts])
        }
      )
      .subscribe()

    channelRef.current = channel
  }

  // Fixed the useEffect dependencies warning
  useEffect(() => {
    fetchPosts()
    setupRealtimeSubscription()

    // Clean up the subscription when the component unmounts
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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