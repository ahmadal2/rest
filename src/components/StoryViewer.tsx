'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight, Trash2, Pause, Play } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Define types for our data
interface User {
  id: string
  username: string
  avatar_url: string
}

interface Story {
  id: string
  media_url: string
  media_type: string
  created_at: string
  user_id: string
  users: User | null
}

interface StoryViewerProps {
  storyId: string
  stories: Story[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function StoryViewer({ storyId, stories, currentIndex, onClose, onNavigate }: StoryViewerProps) {
  const user = useAuthStore((state) => state.user) as User
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch user data if it's missing
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single()
        
      if (error) {
        console.error('Error fetching user data:', error.message || error)
        return null
      }
      
      return data
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception fetching user data:', error.message)
      } else {
        console.error('Exception fetching user data:', error)
      }
      return null
    }
  }

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
        console.error('Error fetching story:', error.message || error.details || error.hint || JSON.stringify(error))
      } else {
        // Handle the nested user data properly
        let storyData: Story = {
          ...data,
          users: data.users && data.users.length > 0 ? data.users[0] : null
        }
        
        // If user data is missing but we have a user_id, fetch the user data
        if (!storyData.users && storyData.user_id) {
          const userData = await fetchUserData(storyData.user_id)
          if (userData) {
            storyData = {
              ...storyData,
              users: userData
            }
          }
        }
        
        setStory(storyData)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Exception fetching story:', error.message)
      } else {
        console.error('Exception fetching story:', error)
      }
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
          return 100
        }
        return prev + 1
      })
    }, 50) // 5 seconds total (100 * 50ms = 5000ms)
  }

  // Handle navigation after progress completes
  useEffect(() => {
    if (progress >= 100) {
      // Auto-navigate to next story
      if (onNavigate && currentIndex < stories.length - 1) {
        setTimeout(() => {
          onNavigate(currentIndex + 1)
        }, 0)
      } else {
        setTimeout(() => {
          onClose()
        }, 0)
      }
    }
  }, [progress, onNavigate, currentIndex, stories.length, onClose])

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

  // Handle video playback
  useEffect(() => {
    if (story && story.media_type === 'video' && videoRef.current) {
      const video = videoRef.current
      
      const handleVideoLoaded = () => {
        setVideoLoading(false)
        if (!isPaused) {
          video.play().catch(e => console.error('Error playing video:', e))
        }
      }
      
      const handleVideoEnd = () => {
        // Auto-navigate to next story when video ends
        if (currentIndex < stories.length - 1) {
          onNavigate(currentIndex + 1)
        } else {
          onClose()
        }
      }
      
      video.addEventListener('loadeddata', handleVideoLoaded)
      video.addEventListener('ended', handleVideoEnd)
      
      return () => {
        video.removeEventListener('loadeddata', handleVideoLoaded)
        video.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [story, isPaused, currentIndex, stories.length, onNavigate, onClose])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < stories.length - 1) {
          onNavigate(currentIndex + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          onNavigate(currentIndex - 1)
        }
      } else if (e.key === ' ') {
        // Spacebar to pause/resume
        e.preventDefault()
        togglePause()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, stories.length, onNavigate, onClose])

  // Handle touch events for mobile swipe navigation
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      if (currentIndex < stories.length - 1) {
        onNavigate(currentIndex + 1)
      }
    } else if (touchEnd - touchStart > 75) {
      // Swipe right
      if (currentIndex > 0) {
        onNavigate(currentIndex - 1)
      }
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    
    if (story && story.media_type === 'video' && videoRef.current) {
      if (isPaused) {
        videoRef.current.play().catch(e => console.error('Error playing video:', e))
      } else {
        videoRef.current.pause()
      }
    }
    
    if (isPaused) {
      startProgress()
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
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
      console.error('Exception deleting story:', error)
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
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className={`h-full ${index === currentIndex ? 'bg-white' : 'bg-gray-600'}`}
              style={{ 
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
                transition: index === currentIndex ? 'width 0.05s linear' : 'none'
              }}
            />
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="absolute top-16 left-4 right-4 z-10 flex items-center">
        <img
          src={story.users?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (story.users?.username || story.user_id || 'user')}
          alt={story.users?.username || 'User'}
          className="w-10 h-10 rounded-full border-2 border-white"
          onError={(e) => {
            e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (story.users?.username || story.user_id || 'user')
          }}
        />
        <div className="ml-3">
          <p className="text-white font-semibold">{story.users?.username || 'Unknown User'}</p>
          <p className="text-gray-300 text-xs">
            {new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10 bg-black/50 rounded-full p-2"
        aria-label="Close story"
      >
        <X size={24} />
      </button>
      
      {/* Delete button for story owner */}
      {user && story.user_id === user.id && (
        <button 
          onClick={deleteStory}
          className="absolute top-4 left-4 text-white z-10 bg-black/50 rounded-full p-2"
          aria-label="Delete story"
        >
          <Trash2 size={24} />
        </button>
      )}
      
      {/* Pause/Play button */}
      <button 
        onClick={togglePause}
        className="absolute top-16 right-4 text-white z-10 bg-black/50 rounded-full p-2"
        aria-label={isPaused ? "Play story" : "Pause story"}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>
      
      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10 bg-black/50 rounded-full p-2"
          aria-label="Previous story"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      
      {currentIndex < stories.length - 1 && (
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 bg-black/50 rounded-full p-2"
          aria-label="Next story"
        >
          <ChevronRight size={24} />
        </button>
      )}
      
      {/* Story content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {story.media_type === 'image' ? (
          <img
            src={story.media_url}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={story.media_url}
              className="max-w-full max-h-full object-contain"
              controls={false}
              playsInline
              muted
            />
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}