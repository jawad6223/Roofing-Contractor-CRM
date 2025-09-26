'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-40 h-40 mt-2 sm:w-40 sm:h-40 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/roofing-logo.png"
                    alt="Logo"
                    fill
                    className="object-contain cursor-pointer"
                  />
                </div>
          </Link>

          <div className="flex items-center">
              {/* Contractor Login */}
              <button
                onClick={() => router.push('/login')}
                className="flex items-center space-x-2 bg-[#122E5F] hover:bg-[#0f2347] text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-medium shadow-sm"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-semibold">Login</span>
              </button>
            </div>
        </div>
      </div>
    </nav>
  );
}