'use client'
import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
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
    
    video.addEventListener('loadeddata', handleVideoLoaded)
    video.addEventListener('ended', handleVideoEnd)
    
    return () => {
      video.removeEventListener('loadeddata', handleVideoLoaded)
      video.removeEventListener('ended', handleVideoEnd)
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
  
  // Pause on hover/touch
  const handleMouseEnter = () => {
    setIsPaused(true)
    if (isVideo && videoRef.current) {
      videoRef.current.pause()
    }
  }
  
  const handleMouseLeave = () => {
    setIsPaused(false)
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(e => console.error('Error playing video:', e))
    }
  }
  
  if (!currentStory) {
    return null
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
        aria-label="Close story"
      >
        <X className="h-6 w-6" />
      </button>
      
      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button 
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Previous story"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      
      {currentIndex < stories.length - 1 && (
        <button 
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Next story"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
      
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
      <div className="absolute top-16 left-4 right-4 z-10 flex items-center">
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
      
      {/* Story content */}
      <div className="w-full h-full flex items-center justify-center">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={currentStory.media_url}
              className="max-h-full max-w-full object-contain"
              playsInline
              muted
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
      </div>
    </div>
  )
}