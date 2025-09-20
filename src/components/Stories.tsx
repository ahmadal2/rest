'use client'
import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Trash2, Pause, Play, Volume2, VolumeX, Share } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

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

export default function StoryViewer({ 
  storyId, 
  stories, 
  currentIndex, 
  onClose, 
  onNavigate 
}: StoryViewerProps) {
  const user = useAuthStore((state) => state.user) as User
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const currentStory = stories[currentIndex]
  
  // Check if media is a video
  useEffect(() => {
    if (currentStory?.media_type === 'video') {
      setIsVideo(true)
    } else {
      setIsVideo(false)
    }
  }, [currentStory])
  
  // Handle story progress
  useEffect(() => {
    if (isPaused || !currentStory) return
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Reset progress
    setProgress(0)
    
    // Set up new interval
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Auto navigate to next story
          if (currentIndex < stories.length - 1) {
            onNavigate(currentIndex + 1)
          } else {
            onClose()
          }
          return 0
        }
        return prev + 1
      })
    }, 50) // Update every 50ms for smooth animation
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex, currentStory, isPaused, stories.length, onNavigate, onClose])
  
  // Handle video events
  useEffect(() => {
    if (!isVideo || !videoRef.current) return
    
    const video = videoRef.current
    
    const handleVideoLoaded = () => {
      setVideoLoading(false)
      if (!isPaused) {
        video.play().catch(e => console.error('Error playing video:', e))
      }
    }
    
    const handleVideoEnd = () => {
      // Auto navigate to next story when video ends
      if (currentIndex < stories.length - 1) {
        onNavigate(currentIndex + 1)
      } else {
        onClose()
      }
    }
    
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }
    
    video.addEventListener('loadeddata', handleVideoLoaded)
    video.addEventListener('ended', handleVideoEnd)
    video.addEventListener('timeupdate', handleTimeUpdate)
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoLoaded)
      video.removeEventListener('ended', handleVideoEnd)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [isVideo, currentIndex, stories.length, onNavigate, onClose, isPaused])
  
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
  
  // Toggle pause/play
  const togglePause = () => {
    setIsPaused(!isPaused)
    
    if (isVideo && videoRef.current) {
      if (isPaused) {
        videoRef.current.play().catch(e => console.error('Error playing video:', e))
      } else {
        videoRef.current.pause()
      }
    }
    
    if (isPaused) {
      // Restart progress if it was completed
      if (progress >= 100) {
        setProgress(0)
      }
    }
  }
  
  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)
    
    if (isVideo && videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }
  
  // Delete story function
  const deleteStory = async () => {
    if (!user || !currentStory || currentStory.user_id !== user.id) return
    
    const confirmed = window.confirm('Are you sure you want to delete this story? This action cannot be undone.')
    if (!confirmed) return
    
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', currentStory.id)
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
  
  // Share story function
  const shareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentStory.users?.username || 'User'}'s Story`,
          text: 'Check out this story!',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }
  
  if (!currentStory) {
    return null
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress indicators */}
      <div className="absolute top-4 left-0 right-0 flex justify-center space-x-1 px-4 z-10">
        {stories.map((_, index) => (
          <div 
            key={index} 
            className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden"
          >
            <div 
              className={`h-full ${index === currentIndex ? 'bg-white' : 'bg-gray-600'}`}
              style={{ 
                width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%',
                transition: index === currentIndex ? 'width 0.05s linear' : 'none'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* User info */}
      <div className="absolute top-16 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={currentStory.users?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (currentStory.users?.username || currentStory.user_id)}
            alt={currentStory.users?.username || 'User'}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div className="ml-3">
            <p className="text-white font-semibold">{currentStory.users?.username || 'Unknown User'}</p>
            <p className="text-gray-300 text-xs">
              {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2">
          {isVideo && (
            <button 
              onClick={toggleMute}
              className="text-white bg-black bg-opacity-50 rounded-full p-2"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          )}
          
          <button 
            onClick={shareStory}
            className="text-white bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Share story"
          >
            <Share className="h-5 w-5" />
          </button>
          
          {user && currentStory.user_id === user.id && (
            <button 
              onClick={deleteStory}
              className="text-white bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Delete story"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="text-white bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close story"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button 
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Previous story"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      
      {currentIndex < stories.length - 1 && (
        <button 
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Next story"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
      
      {/* Story content */}
      <div className="w-full h-full flex items-center justify-center" onClick={togglePause}>
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={currentStory.media_url}
              className="max-h-full max-w-full object-contain"
              playsInline
              muted={isMuted}
              loop={false}
              onLoadedData={() => setVideoLoading(false)}
            />
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </>
        ) : (
          <img
            src={currentStory.media_url}
            alt="Story"
            className="max-h-full max-w-full object-contain"
          />
        )}
        
        {/* Pause/Play indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              {isPaused ? <Play className="h-8 w-8 text-white" /> : <Pause className="h-8 w-8 text-white" />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}