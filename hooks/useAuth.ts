'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      setUser(loggedInUser)
    }
    setLoading(false)
  }, [])

  const login = (emailAddress: string) => {
    localStorage.setItem('loggedInUser', emailAddress)
    setUser(emailAddress)
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('loggedInUser')
    setUser(null)
    router.push('/')
  }

  const checkAuth = () => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    return loggedInUser
  }

  return {
    user,
    loading,
    login,
    logout,
    checkAuth
  }
}
