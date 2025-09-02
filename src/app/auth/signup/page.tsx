//signup//
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)
  const router = useRouter()

const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setRequiresConfirmation(false)

    try {
      // First, try to sign up the user
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      // Check if email confirmation is required
      if (data.user && !data.user.identities) {
        // This means the user already exists and needs to confirm their email
        setRequiresConfirmation(true)
        setSuccess(true)
      } else if (data.user) {
        // Try to sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          // Email confirmation is required
          setRequiresConfirmation(true)
          setSuccess(true)
        } else {
          // Successfully signed in
          router.push('/')
        }
      }
    } catch (error: unknown) {
      console.error('Signup error:', error)
      // Type guard to check if error has a message property
      if (error instanceof Error) {
        if (error.message.includes('already been registered')) {
          setError('This email address is already registered. Please sign in instead.')
        } else {
          setError(error.message || 'An error occurred during signup. Please try again.')
        }
      } else {
        setError('An error occurred during signup. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join Insta1 today
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}

        {success && !requiresConfirmation && (
          <div className="bg-green-100 text-green-700 p-3 rounded">
            Account created successfully! Redirecting...
          </div>
        )}

        {requiresConfirmation && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded">
            <p className="font-medium">Account created successfully!</p>
            <p className="mt-1">Please check your email ({email}) for a confirmation link.</p>
            <p className="mt-2 text-sm">After confirming your email, you can <Link href="/auth/signin" className="underline">sign in here</Link>.</p>
          </div>
        )}

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border focus:ring focus:ring-blue-200 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border focus:ring focus:ring-blue-200 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 rounded border focus:ring focus:ring-blue-200 dark:bg-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/auth/forgot-password" className="text-blue-600 dark:text-blue-400 text-sm">
            Forgot password?
          </Link>
        </div>

        <p className="text-center">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}