'use client'

import { useState, useEffect } from 'react'
import { useAuthUser, useAuthLoading } from '@/lib/store'
import Link from 'next/link'
import UploadModal from './UploadModal'

// Define types for our data
interface User {
  id: string
  username: string
  email: string
  avatar_url: string
}

export default function Header() {
  const user = useAuthUser() as User
  const loading = useAuthLoading()
  const [showModal, setShowModal] = useState(false)

  // Add debugging to see what's happening with auth state
  useEffect(() => {
    console.log('Header auth state:', { user, loading })
  }, [user, loading])

  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
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

          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
            ) : user ? (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Post
                </button>
                <Link 
                  href="/profile" 
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link 
                  href="/auth/signin" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </>
  )
}