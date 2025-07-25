'use client'

import { useEffect, useState, useCallback } from 'react'
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

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setError('')
      } else {
        setError('Authentication required')
        router.push('/login')
      }
    } catch {
      setError('Authentication error')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

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