'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

export default function StoryViewer({ storyId, stories, currentIndex, onClose, onNavigate }) {
  const user = useAuthStore((state) => state.user)
  const [story, setStory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (storyId) {
      fetchStory()
      startProgress()
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [storyId])

  useEffect(() => {
    if (story && story.media_type === 'video' && videoRef.current) {
      videoRef.current.play()
    }
  }, [story])

  const fetchStory = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          media_url,
          media_type,
          created_at,
          user_id,
          users (id, username, avatar_url)
        `)
        .eq('id', storyId)
        .single()

      if (error) {
        console.error('Error fetching story:', error)
      } else {
        setStory(data)
      }
    } catch (error) {
      console.error('Exception fetching story:', error)
    } finally {
      setLoading(false)
    }
  }

  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    
    setProgress(0)
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current)
          }
          // Auto-navigate to next story
          if (onNavigate && currentIndex < stories.length - 1) {
            onNavigate(currentIndex + 1)
          } else {
            onClose()
          }
          return 100
        }
        return prev + 1
      })
    }, 50) // 5 seconds total (100 * 50ms = 5000ms)
  }

  const handlePrev = () => {
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1)
      startProgress()
    }
  }

  const handleNext = () => {
    if (onNavigate && currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1)
      startProgress()
    } else {
      onClose()
    }
  }

  const handleRestart = () => {
    setProgress(0)
    startProgress()
  }

  // Add delete story functionality
  const deleteStory = async () => {
    if (!user || !story || story.user_id !== user.id) return
    
    const confirmed = window.confirm('Are you sure you want to delete this story? This action cannot be undone.')
    if (!confirmed) return
    
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', story.id)
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Error deleting story:', error.message || error)
        alert('Failed to delete story. Please try again.')
        return
      }
      
      // Navigate to next or previous story, or close if none left
      if (currentIndex < stories.length - 1) {
        onNavigate(currentIndex + 1)
      } else if (currentIndex > 0) {
        onNavigate(currentIndex - 1)
      } else {
        onClose()
      }
    } catch (error) {
      console.error('Exception deleting story:', error.message || error)
      alert('Failed to delete story. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white">Loading story...</div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white">Story not found</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10 bg-black/50 rounded-full p-1"
      >
        <X size={24} />
      </button>
      
      {/* Delete button for story owner */}
      {user && story.user_id === user.id && (
        <button 
          onClick={deleteStory}
          className="absolute top-4 left-4 text-white z-10 bg-black/50 rounded-full p-1"
        >
          <Trash2 size={24} />
        </button>
      )}
      
      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
        />
      )}
      
      <button 
        onClick={handleRestart}
        className="absolute left-1/3 top-0 bottom-0 w-1/3 z-10"
      />
      
      {currentIndex < stories.length - 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
        />
      )}

      {/* Story content */}
      <div className="relative max-w-md w-full h-full flex items-center justify-center">
        {story.media_type === 'video' ? (
          <video 
            ref={videoRef}
            src={story.media_url} 
            controls={false}
            autoPlay
            loop={false}
            className="max-h-full max-w-full object-contain"
            onClick={handleNext}
          />
        ) : (
          <img 
            src={story.media_url} 
            alt="Story" 
            className="max-h-full max-w-full object-contain"
            onClick={handleNext}
          />
        )}
      </div>
      
      {/* User info */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center">
        <img
          src={story.users?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + story.users?.username}
          alt={story.users?.username || 'User'}
          className="w-8 h-8 rounded-full mr-2 border-2 border-white"
          onError={(e) => {
            e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + story.users?.username
          }}
        />
        <span className="text-white font-medium">{story.users?.username || 'Unknown'}</span>
        <span className="text-gray-300 text-sm ml-2">
          {new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}