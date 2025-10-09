"use client";

import { CheckCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        <div className="relative z-10 text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-200 via-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow">
            <CheckCircle className="h-10 w-10 text-green-600 drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight drop-shadow-sm">
            Welcome {userInfo?.fullName ? `${userInfo?.fullName}!` : "to the Pros!"}
          </h1>
          <p className="text-lg text-gray-700 mb-2 font-medium">Your account has been created successfully.</p>
          <p className="text-gray-500 mb-2">
            We&apos;re excited to have you join <span className="font-semibold text-[#286BBD]">Roof Claim Pros</span>.
            <br />
            Get ready to access premium leads and grow your business!
          </p>
        </div>

        {/* Call to Action */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-gray-700 font-semibold mb-2 text-base">Ready to get started?</span>
          <button
            type="button"
            className="bg-gradient-to-r from-[#122E5F] to-[#041738] hover:from-[#183B7A] hover:to-[#122E5F] transition-colors duration-200 text-white px-6 py-3 font-semibold rounded-xl shadow-md text-lg flex items-center gap-2 mb-3"
            onClick={() => router.push("/login")}
          >
            <LogIn className="h-5 w-5 text-white" />
            Access Your Dashboard
          </button>
          <span className="text-xs text-gray-400">You can now log in with your new credentials.</span>
        </div>
      </div>
      <style jsx global>{`
        html,
        body {
          overflow: hidden;
          height: 100%;
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
}
