'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { X, Image, Video } from 'lucide-react'

export default function UploadModal({ onClose }) {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const [step, setStep] = useState<'select' | 'post'>('select')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isStory, setIsStory] = useState(false) // Track if this is a story upload

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, story: boolean = false) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setIsStory(story)
      setStep('post')
    }
  }

  const handleSubmit = async () => {
    // Check if user is authenticated
    if (!user) {
      setError('You must be logged in to upload content.')
      return
    }
    
    // Only require title for posts, not stories
    if (!isStory && !title.trim()) {
      setError('Title is required.')
      return
    }
    
    setError('')
    setUploading(true)

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
          throw new Error('Error creating user profile: ' + insertError.message)
        }
      }

      const fileName = `${Date.now()}_${file!.name}`
      const filePath = isStory ? `stories/${fileName}` : `posts/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file!)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      const mediaUrl = publicUrlData.publicUrl

      if (isStory) {
        // Insert into stories table
        const { error: dbError } = await supabase.from('stories').insert({
          user_id: user.id,
          media_url: mediaUrl,
          media_type: file!.type.startsWith('image') ? 'image' : 'video',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        })

        if (dbError) throw dbError
      } else {
        // Insert into posts table
        const { error: dbError } = await supabase.from('posts').insert({
          user_id: user.id,
          title,
          caption,
          media_url: mediaUrl,
          media_type: file!.type.startsWith('image') ? 'image' : 'video',
          created_at: new Date().toISOString(),
        })

        if (dbError) throw dbError
      }

      alert(isStory ? 'Story successfully uploaded!' : 'Post successfully uploaded!')
      onClose()
      window.location.reload()
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed: ' + (err.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-screen overflow-y-auto border border-gray-700 shadow-2xl">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img 
                src="/images/a1i.png" 
                alt="Insta1 Logo" 
                className="w-full h-full rounded-full object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-white">
              {step === 'select' ? 'Create' : isStory ? 'New Story' : 'New Post'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {step === 'select' && (
          <div className="p-6 space-y-6">
            <label className="flex flex-col items-center p-8 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:bg-gray-700/50 transition-colors">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <img 
                  src="/images/a1i.png" 
                  alt="Insta1 Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-lg font-medium text-white">Select Photo or Video</span>
              <span className="text-gray-400 text-sm mt-1">Choose from your device</span>
              <input type="file" accept="image/*,video/*" onChange={(e) => handleFileChange(e, false)} className="hidden" />
            </label>

            <div className="flex space-x-4 text-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Image size={28} className="text-blue-400" />
                </div>
                <h3 className="font-medium text-white">Feed Post</h3>
                <p className="text-gray-400 text-sm mt-1">Share with followers</p>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={(e) => handleFileChange(e, false)} 
                  className="hidden" 
                  id="feed-post-upload"
                />
                <label 
                  htmlFor="feed-post-upload"
                  className="mt-2 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm cursor-pointer transition-colors"
                >
                  Select
                </label>
              </div>
              <div className="flex-1">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video size={28} className="text-purple-400" />
                </div>
                <h3 className="font-medium text-white">Story</h3>
                <p className="text-gray-400 text-sm mt-1">24-hour content</p>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={(e) => handleFileChange(e, true)} 
                  className="hidden" 
                  id="story-upload"
                />
                <label 
                  htmlFor="story-upload"
                  className="mt-2 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm cursor-pointer transition-colors"
                >
                  Select
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 'post' && (
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900/50 text-red-200 p-3 rounded-lg border border-red-800">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <div className="relative">
                {file?.type.startsWith('image') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="max-h-80 rounded-xl object-contain border border-gray-700"
                  />
                ) : (
                  <video 
                    src={URL.createObjectURL(file!)} 
                    controls 
                    className="max-h-80 rounded-xl object-contain border border-gray-700"
                  />
                )}
              </div>
            </div>

            {!isStory && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a title..."
                />
              </div>
            )}

            {!isStory && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Caption (optional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="What would you like to say?"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStep('select')}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                disabled={uploading}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading || loading || !user}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 transition-all"
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : isStory ? 'Share to Story' : 'Share'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}