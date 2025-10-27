"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function ThankYouPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const userInfoObj = JSON.parse(userInfo);
      setUserInfo(userInfoObj);
    }
  }, []);

  return (
    <div className="h-screen bg-[#F5F5F5] flex items-center justify-center p-4 overflow-hidden">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 max-w-xl w-full">
        {/* Decorative confetti */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="absolute top-0 left-0 w-32 h-32 opacity-30" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="6" fill="#60a5fa" />
              <circle cx="80" cy="30" r="4" fill="#fbbf24" />
              <circle cx="60" cy="80" r="5" fill="#34d399" />
              <circle cx="90" cy="60" r="3" fill="#f472b6" />
              <circle cx="10" cy="70" r="4" fill="#818cf8" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-30" viewBox="0 0 100 100">
              <circle cx="80" cy="80" r="6" fill="#60a5fa" />
              <circle cx="20" cy="70" r="4" fill="#fbbf24" />
              <circle cx="40" cy="20" r="5" fill="#34d399" />
              <circle cx="10" cy="40" r="3" fill="#f472b6" />
              <circle cx="90" cy="30" r="4" fill="#818cf8" />
            </svg>
          </div>
        {/* Registration Success Message */}
        <div className="p-8 text-center">
        <div className="relative mb-2 flex justify-center">
              <Image 
                src="/roofingF-logo.png" 
                alt="Roofing CRM Logo" 
                width={200} 
                height={50}
                className="object-contain drop-shadow-lg"
              />
            </div>
            {/* Success Icon */}  
            <div className="relative z-20 text-center mb-5">
              <div className="w-20 h-20 bg-[#122E5F] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow">
                <Mail className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <p className="text-gray-500">
                We&apos;ve sent a verification email to
                <span className="font-semibold text-[#286BBD] block my-2">{userInfo?.emailAddress}</span>
              </p>
              <p className="text-gray-500 mt-5">
                Please check your email and click the verification link
                <br/>
                to activate your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col items-center space-y-4">
              <button
                type="button"
                className="bg-gradient-to-r from-[#122E5F] to-[#041738] hover:from-[#183B7A] hover:to-[#122E5F] transition-colors duration-200 text-white px-6 py-3 font-semibold rounded-xl shadow-md text-lg flex items-center gap-2 w-full justify-center"
              >
                <Mail className="h-5 w-5 text-white" />
                <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">Verify Email</a>
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-white hover:bg-gray-50 text-[#122E5F] border-2 border-[#122E5F] px-6 py-3 font-semibold rounded-xl shadow-md text-lg w-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              >
                Return to Homepage
              </button>
            </div>
          </div>
          </div>
    </div>
  );
}
