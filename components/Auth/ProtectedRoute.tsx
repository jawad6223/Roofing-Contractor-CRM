'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    
    if (requireAuth && !loggedInUser) {
      router.push(redirectTo)
    } else if (!requireAuth && loggedInUser) {
      router.push('/dashboard')
    } else {
      setShouldRender(true)
    }
    
    setIsLoading(false)
  }, [requireAuth, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!shouldRender) {
    return null
  }

  return <>{children}</>
}
