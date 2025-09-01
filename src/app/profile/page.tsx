'use client'

import { useAuthUser, useAuthLoading, useAuthStore } from '@/lib/store'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Profile() {
  const user = useAuthUser()
  const loading = useAuthLoading()
  const [posts, setPosts] = useState<any[]>([])
  const [username, setUsername] = useState('')
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    setUsername(user.username || '')
    setNewUsername(user.username || '')
    setAvatarUrl(user.avatar_url || '')
    fetchUserPosts()
  }, [user])

  // Fetch fresh user data when component mounts
  useEffect(() => {
    if (!user) return
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url, created_at')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setUsername(data.username || '')
        setNewUsername(data.username || '')
        setAvatarUrl(data.avatar_url || '')
        // Update the store with fresh data
        useAuthStore.getState().setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchUserPosts = async () => {
    if (!user) return
    const { data } = await supabase
      .from('posts')
      .select('id, media_url, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setPosts(data || [])
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const startEditingUsername = () => {
    setNewUsername(username)
    setEditingUsername(true)
  }

  const saveUsername = async () => {
    if (!newUsername.trim() || newUsername === username) {
      setEditingUsername(false)
      return
    }

    setSaving(true)
    setSaveMessage('')

    try {
      // Update username in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ username: newUsername })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update username in auth user
      const { error: authError } = await supabase.auth.updateUser({
        data: { username: newUsername }
      })

      if (authError) throw authError

      // Update local state
      setUsername(newUsername)
      useAuthStore.getState().setUser({ ...user, username: newUsername })
      setEditingUsername(false)
      setSaveMessage('Username updated successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error updating username:', error)
      setSaveMessage('Error updating username. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Add function to handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setSaveMessage('Uploading avatar...')

    try {
      // Upload file to Supabase storage
      const fileName = `${user.id}/avatar_${Date.now()}.${file.name.split('.').pop()}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update user record with new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (authError) throw authError

      // Update local state
      setAvatarUrl(publicUrl)
      useAuthStore.getState().setUser({ ...user, avatar_url: publicUrl })
      setSaveMessage('Avatar updated successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setSaveMessage('Error uploading avatar. Please try again.')
    }
  }

  // Add function to trigger file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Add delete post functionality
  const deletePost = async (postId: string) => {
    if (!user) return
    
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.')
    if (!confirmed) return
    
    try {
      // First delete associated likes and comments
      await supabase.from('likes').delete().eq('post_id', postId)
      await supabase.from('comments').delete().eq('post_id', postId)
      
      // Then delete the post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Error deleting post:', error.message || error)
        alert('Failed to delete post. Please try again.')
        return
      }
      
      // Update the posts list
      setPosts(posts.filter(post => post.id !== postId))
      setSaveMessage('Post deleted successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Exception deleting post:', error.message || error)
      alert('Failed to delete post. Please try again.')
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Loading Profile</h1>
          <p className="text-gray-400">Please wait while we load your profile data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Access Denied</h1>
          <p className="text-gray-300 text-center mb-8">You need to be logged in to view your profile.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium text-center transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium text-center transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img 
                  src="/images/a1i.png" 
                  alt="Insta1 Logo" 
                  className="w-full h-full rounded-full object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
                Insta1
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with upload functionality */}
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 cursor-pointer"
                onClick={triggerFileInput}
              >
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-bold">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div 
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer"
                onClick={triggerFileInput}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {editingUsername ? (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full max-w-xs"
                      placeholder="Enter new username"
                    />
                  </div>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={saveUsername}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingUsername(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-2xl font-bold">{username}</h1>
                    <button
                      onClick={startEditingUsername}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-400">Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              )}
              
              {saveMessage && (
                <div className={`mt-2 px-4 py-2 rounded-lg ${saveMessage.includes('Error') ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
                  {saveMessage}
                </div>
              )}
            </div>
            
            <div className="bg-gray-700/50 rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-gray-400">Posts</p>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Posts</h2>
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Explore more
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map(post => (
              <div key={post.id} className="group relative bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={post.media_url} 
                    alt={post.title || "Post"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="w-full">
                    <h3 className="text-white font-medium truncate">{post.title}</h3>
                    <p className="text-gray-300 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* Delete button for post owner */}
                <button 
                  onClick={() => deletePost(post.id)}
                  className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 text-center border border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
              <p className="text-gray-400 mb-6">You haven't posted anything yet. Share your first moment with the community!</p>
              <Link 
                href="/" 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Your First Post
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}