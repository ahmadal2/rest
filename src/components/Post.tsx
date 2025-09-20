'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Heart, MessageCircle, Send, Trash2, Play } from 'lucide-react'

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

// Add this interface for the raw comment data from Supabase
interface RawComment {
  id: string
  text: string
  user_id: string
  users: Array<{
    username: string
  }>
}

interface Comment {
  id: string
  text: string
  user_id: string
  users: {
    username: string
  }
}

export default function Post({ post: initialPost }: { post: PostType }) {
  const user = useAuthStore((state) => state.user) as User
  const [post, setPost] = useState<PostType>(initialPost)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Check if media is a video
  useEffect(() => {
    if (post.media_url) {
      const extension = post.media_url.split('.').pop()?.toLowerCase()
      setIsVideo(['mp4', 'webm', 'ogg', 'mov'].includes(extension || ''))
    }
  }, [post.media_url])
  
  // Move all function declarations before useEffect hooks
  const fetchLikes = async () => {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('post_id', post.id)
        
      if (error) {
        console.error('Error fetching likes:', error.message || error)
        return
      }
      
      setLikes(count || 0)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception fetching likes:', error.message)
      } else {
        console.error('Exception fetching likes:', error)
      }
    }
  }
  
  const fetchCommentCount = async () => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('post_id', post.id)
        
      if (error) {
        console.error('Error fetching comment count:', error.message || error)
        return
      }
      
      setCommentCount(count || 0)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception fetching comment count:', error.message)
      } else {
        console.error('Exception fetching comment count:', error)
      }
    }
  }
  
  const checkIfLiked = async () => {
    if (!user || !post?.id) return
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', post.id)
        .single()
        
      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error checking if liked:', error.message || error)
      }
      
      setLiked(!!data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception checking if liked:', error.message)
      } else {
        console.error('Exception checking if liked:', error)
      }
    }
  }
  
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, text, user_id, users(username)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })
        
      if (error) {
        console.error('Error fetching comments:', error.message || error)
        return
      }
      
      // Handle the nested user data properly
      const commentsData: Comment[] = (data as RawComment[]).map((comment: RawComment) => ({
        id: comment.id,
        text: comment.text,
        user_id: comment.user_id,
        users: comment.users && comment.users.length > 0 
          ? comment.users[0] 
          : { username: 'Unknown' }
      }))
      
      setComments(commentsData || [])
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception fetching comments:', error.message)
      } else {
        console.error('Exception fetching comments:', error)
      }
    }
  }
  
  // Fetch user data if it's missing
  const fetchUserData = async () => {
    if (post.users) return // User data already exists
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url')
        .eq('id', post.user_id)
        .single()
        
      if (error) {
        console.error('Error fetching user data:', error.message || error)
        return
      }
      
      if (data) {
        setPost(prevPost => ({
          ...prevPost,
          users: data
        }))
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception fetching user data:', error.message)
      } else {
        console.error('Exception fetching user data:', error)
      }
    }
  }
  
  const toggleLike = async () => {
    if (!user || !post?.id) return
    try {
      // Ensure user exists in database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (userError) {
        // If user doesn't exist, create them
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            username: user.username || user.email?.split('@')[0] || 'User',
            email: user.email
          })
        
        if (insertError) {
          console.error('Error creating user:', insertError.message || insertError)
          return
        }
      }
      
      if (liked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id)
          
        if (error) {
          console.error('Error unliking post:', error.message || error)
          return
        }
        
        setLikes(likes - 1)
      } else {
        const { error } = await supabase.from('likes').insert({
          user_id: user.id,
          post_id: post.id,
        })
        
        if (error) {
          console.error('Error liking post:', error.message || error)
          return
        }
        
        setLikes(likes + 1)
      }
      setLiked(!liked)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception toggling like:', error.message)
      } else {
        console.error('Exception toggling like:', error)
      }
    }
  }
  
  const addComment = async () => {
    if (!newComment.trim() || !user || !post?.id) return
    try {
      // Ensure user exists in database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (userError) {
        // If user doesn't exist, create them
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            username: user.username || user.email?.split('@')[0] || 'User',
            email: user.email
          })
        
        if (insertError) {
          console.error('Error creating user:', insertError.message || insertError)
          return
        }
      }
      
      const { error } = await supabase.from('comments').insert({
        user_id: user.id,
        post_id: post.id,
        text: newComment,
      })
      
      if (error) {
        console.error('Error adding comment:', error.message || error)
        return
      }
      
      setNewComment('')
      fetchComments()
      fetchCommentCount()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception adding comment:', error.message)
      } else {
        console.error('Exception adding comment:', error)
      }
    }
  }
  
  // Add delete comment functionality
  const deleteComment = async (commentId: string) => {
    if (!user) return
    
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id) // Ensure user can only delete their own comments
      
      if (error) {
        console.error('Error deleting comment:', error.message || error)
        return
      }
      
      fetchComments()
      fetchCommentCount()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception deleting comment:', error.message)
      } else {
        console.error('Exception deleting comment:', error)
      }
    }
  }
  
  // Add delete post functionality
  const deletePost = async () => {
    if (!user || post.user_id !== user.id) return
    
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.')
    if (!confirmed) return
    
    try {
      // First delete associated likes and comments
      await supabase.from('likes').delete().eq('post_id', post.id)
      await supabase.from('comments').delete().eq('post_id', post.id)
      
      // Then delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Error deleting post:', error.message || error)
        alert('Failed to delete post. Please try again.')
        return
      }
      
      // Refresh the page to reflect changes
      window.location.reload()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception deleting post:', error.message)
      } else {
        console.error('Exception deleting post:', error)
      }
      alert('Failed to delete post. Please try again.')
    }
  }
  
  // Handle video loading
  const handleVideoLoaded = () => {
    setVideoLoading(false)
  }
  
  // Toggle video play/pause
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }
  
  useEffect(() => {
    if (!post?.id) return
    fetchLikes()
    fetchComments()
    fetchCommentCount()
    checkIfLiked()
    fetchUserData() // Fetch user data if missing
  }, [post?.id, user])
  
  // Realtime: Live-Likes
  useEffect(() => {
    if (!post?.id) return
    const channel = supabase
      .channel(`likes-${post.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'likes',
        filter: `post_id=eq.${post.id}`,
      }, fetchLikes)
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'likes',
        filter: `post_id=eq.${post.id}`,
      }, fetchLikes)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [post?.id])
  
  // Realtime: Live-Comments
  useEffect(() => {
    if (!post?.id) return
    const channel = supabase
      .channel(`comments-${post.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${post.id}`,
      }, fetchCommentCount)
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${post.id}`,
      }, fetchCommentCount)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [post?.id])
  
  // Handle case where post data might be undefined
  if (!post) {
    return <div className="bg-black rounded-lg overflow-hidden border border-gray-800 p-4">Invalid post data</div>
  }
  
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* User Info */}
      <div className="p-4 flex items-center gap-3 justify-between bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {post.users?.id && post.users.id !== '' ? (
            <Link href={`/profile/${post.users.id}`}>
              <img
                src={post.users.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-700"
                onError={(e) => {
                  e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=profile'
                }}
              />
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
          )}
          {post.users?.id && post.users.id !== '' ? (
            <Link href={`/profile/${post.users.id}`} className="text-white font-semibold text-sm hover:text-blue-400 transition-colors">
              {post.users.username || 'Unknown User'}
            </Link>
          ) : (
            <span className="text-white font-medium text-sm">
              {post.user_id ? 'Loading...' : 'Gelöschter Nutzer'}
            </span>
          )}
        </div>
        
        {/* Delete button for post owner */}
        {user && post.user_id === user.id && (
          <button 
            onClick={deletePost}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-700"
            aria-label="Delete post"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
      {/* Media */}
      <div className="relative">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={post.media_url}
              className="w-full aspect-video object-cover cursor-pointer"
              onLoadedData={handleVideoLoaded}
              onClick={toggleVideoPlay}
              controls
              playsInline
              muted
            />
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </>
        ) : (
          <img
            src={post.media_url || '/images/placeholder.png'}
            alt="Post"
            className="w-full aspect-video object-cover cursor-pointer transition-opacity duration-300 hover:opacity-90"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.png'
            }}
          />
        )}
      </div>
      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLike} 
            className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors duration-200 ${liked ? 'animate-pulse' : ''}`} 
            disabled={!user}
            aria-label={liked ? "Unlike post" : "Like post"}
          >
            <Heart className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={() => setShowComments(!showComments)} 
            className={`flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors duration-200 ${showComments ? 'text-blue-500' : ''}`}
            aria-label="Toggle comments"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="flex gap-4 mt-1 pt-2 border-t border-gray-800">
          <p className="text-white text-sm font-medium">
            <span className="font-bold">{likes}</span> {likes === 1 ? 'Like' : 'Likes'}
          </p>
          <p className="text-white text-sm font-medium">
            <span className="font-bold">{commentCount}</span> {commentCount === 1 ? 'Comment' : 'Comments'}
          </p>
        </div>
        <p className="text-white font-medium mt-1">
          <span className="font-bold">{post.users?.username || 'Unbekannt'}:</span> {post.title || 'No title'}
        </p>
        {post.caption && <p className="text-gray-300 text-sm mt-2">{post.caption}</p>}
      </div>
      {/* Comments */}
      {showComments && (
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 rounded-lg">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center italic">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2 mb-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {c.users?.username || 'Unbekannt'}
                    </p>
                    <p className="text-gray-300 text-sm mt-1 break-words">
                      {c.text || ''}
                    </p>
                  </div>
                  {user && c.user_id === user.id && (
                    <button 
                      onClick={() => deleteComment(c.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-700"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addComment()}
              disabled={!user}
            />
            <button
              onClick={addComment}
              className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 hover:bg-blue-700 transition-colors"
              disabled={!user || !newComment.trim()}
              aria-label="Send comment"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}