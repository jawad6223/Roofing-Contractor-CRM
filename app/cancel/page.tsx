'use client'

import { useRouter } from 'next/navigation'

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg className="w-8 h-8 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">Payment Cancelled</h1>
          <p className="text-gray-600 mb-8 animate-fade-in">Your payment was not completed. Please try again when you&apos;re ready.</p>
          
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold transform transition-all duration-300 hover:bg-red-600 hover:scale-105 active:scale-95"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}
