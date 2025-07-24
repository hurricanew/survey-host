'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserInfo {
  id: string
  email: string
  name: string
  picture: string
  verified_email: boolean
}

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setError('Authentication required')
        router.push('/login')
      }
    } catch (err) {
      setError('Authentication error')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return { user, loading, error, logout }
}