'use client'

import { useRouter } from 'next/navigation'

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="text-center max-w-lg w-full relative z-10">
        {/* Main Cancel Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 border border-white/20">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce">
            <svg className="h-10 w-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-black mb-4 bg-red-500 hover:bg-red-600 bg-clip-text text-transparent">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
            Your payment was not completed
          </p>

          {/* Status Card */}
          <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <h3 className="text-base font-bold text-gray-800">
                Transaction Status
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-3">
              ❌ Your payment has been <span className="text-red-500 font-bold">cancelled</span> and no charges were made
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              🔄 You can try again anytime when you're ready to purchase leads
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/purchase-leads')}
              className="w-full bg-[#122E5F] hover:bg-[#0f2347] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center">
                Try Again
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-8 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
