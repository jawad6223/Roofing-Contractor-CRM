'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminProtectedRouteProps } from '@/types/AuthType'


export const AdminProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/adminLogin' 
}: AdminProtectedRouteProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const loggedInAdmin = localStorage.getItem('adminLoggedInUser')
    
    if (requireAuth && !loggedInAdmin) {
      router.push(redirectTo)
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