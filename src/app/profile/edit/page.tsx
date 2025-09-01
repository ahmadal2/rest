'use client'

import { useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const [posts, setPosts] = useState<any[]>([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchProfileData()
  }, [user])

  const fetchProfileData = async () => {
    setLoading(true)

    // Posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('id, media_url')
      .eq('user_id', user.id)
    setPosts(postsData || [])

    // Follower
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_id', user.id)
    setFollowers(followersCount || 0)

    // Following
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('follower_id', user.id)
    setFollowing(followingCount || 0)

    // Ist der aktuelle User diesem Profil gefolgt?
    if (user.id !== user.id) {
      const {  data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', user.id)
        .single()
      setIsFollowing(!!data)
    }

    setLoading(false)
  }

  const handleFollow = async () => {
    await supabase.from('follows').insert({
      follower_id: user.id,
      following_id: user.id,
    })
    setIsFollowing(true)
    setFollowers(followers + 1)
  }

  const handleUnfollow = async () => {
    await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', user.id)
    setIsFollowing(false)
    setFollowers(followers - 1)
  }

  if (loading) return <p className="text-center py-8">Lädt...</p>

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Profil: {user.username}</h1>
      </div>

      <div className="p-6">
        {/* Statistiken */}
        <div className="flex gap-8 text-center mb-6">
          <div>
            <strong>{posts.length}</strong> Beiträge
          </div>
          <Link href={`/profile/${user.id}/followers`} className="hover:underline">
            <strong>{followers}</strong> Follower
          </Link>
          <Link href={`/profile/${user.id}/following`} className="hover:underline">
            <strong>{following}</strong> Following
          </Link>
        </div>

        {/* Follow-Button */}
        {user.id !== user.id && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-4 py-1 rounded text-sm ${
              isFollowing ? 'bg-gray-600' : 'bg-blue-600'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {posts.map((post) => (
            <img
              key={post.id}
              src={post.media_url}
              alt="Post"
              className="aspect-square object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  )
}