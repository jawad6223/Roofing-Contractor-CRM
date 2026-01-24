import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 text-gray-900 relative overflow-hidden border-t border-blue-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#122E5F" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path 
            d="M0,60 C300,120 900,0 1200,60 L1200,0 L0,0 Z" 
            fill="url(#waveGradient)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid gap-12">
          
          {/* Logo and Company Info */}
          <div className="text-center">
            <div className="mb-2">
              <div className="relative w-80 h-20 mx-auto">
                <Image
                  src="/roofingF-logo.png"
                  alt="Roof Claim Pros Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            <p className="text-gray-600 text-center text-base lg:text-lg leading-relaxed mb-6 lg:whitespace-nowrap">
              Connecting licensed roofing contractors with qualified insurance claim leads since 2020
            </p>

          </div>

        </div>
          <div className="flex items-center justify-center space-x-2 lg:space-x-4 text-gray-800 mb-6">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-center">Licensed in All 50 States</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-center">A+ BBB Rating</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-center">$10M Liability Insurance</span>
            </div>
          </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-blue-300">
            <div className="text-center">
              <p className="text-gray-500 text-sm relative top-6">
                © 2026 Roof Claim Pros. All rights reserved.
              </p>
          </div>
        </div>
      </div>
    </footer>
  );
}