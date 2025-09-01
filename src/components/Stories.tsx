'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import StoryViewer from './StoryViewer'

export default function Stories() {
  const user = useAuthStore((state) => state.user)
  const [stories, setStories] = useState<any[]>([])
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return
    fetchStories()
  }, [user])

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        id,
        media_url,
        user_id,
        users (id, username, avatar_url)
      `)
      .filter('expires_at', 'gt', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fehler bei Stories:', error)
    } else {
      setStories(data || [])
    }
  }

  // Add a function to handle story click
  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index)
  }

  const handleNavigate = (index: number) => {
    setSelectedStoryIndex(index)
  }

  return (
    <>
      <div className="flex space-x-4 overflow-x-auto pb-4 p-4 bg-black border-b border-gray-800">
        {user && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-blue-500 rounded-full p-0.5">
              <img
                src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username}
                alt="You"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username
                }}
              />
            </div>
            <span className="text-xs text-white mt-1">Your Story</span>
          </div>
        )}

        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleStoryClick(index)}
          >
            <div className="w-16 h-16 border-2 border-gradient rounded-full p-0.5 bg-gradient-to-r from-yellow-400 to-pink-600">
              <img
                src={story.users?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + story.users?.username}
                alt={story.users?.username || 'User'}
                className="w-full h-full rounded-full object-cover bg-white"
                onError={(e) => {
                  e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + story.users?.username
                }}
              />
            </div>
            <span className="text-xs text-white mt-1 truncate w-16 text-center">
              {story.users?.username || 'Unknown'}
            </span>
          </div>
        ))}
      </div>

      {selectedStoryIndex !== null && stories[selectedStoryIndex] && (
        <StoryViewer 
          storyId={stories[selectedStoryIndex].id} 
          stories={stories}
          currentIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)} 
          onNavigate={handleNavigate}
        />
      )}
    </>
  )
}