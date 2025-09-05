'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CrmContractor() {
  const searchParams = useSearchParams();
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    emailAddress: ''
  });

  useEffect(() => {
    // Get user info from URL parameters
    const fullName = searchParams.get('name') || '';
    const emailAddress = searchParams.get('email') || '';
    
    setUserInfo({
      fullName,
      emailAddress
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center sm:px-5 p-2">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white rounded-2xl">
          <CardContent className="p-4 text-center">
            {/* Success Icon */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-7 w-7 text-[#286BBD]" />
            </div>

            {/* Success Message */}
            <h2 className="text-lg font-bold text-[#286BBD] mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Welcome to the Roof Claim Pros contractor network{userInfo.fullName ? `, ${userInfo.fullName}` : ''}!
            </p>

            {/* CRM Access Details */}
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <h3 className="text-sm font-bold text-[#286BBD] mb-2">Your CRM Access Details</h3>
              <div className="space-y-1 text-left text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#286BBD] font-medium">Username:</span>
                  <span className="text-blue-900 font-semibold text-xs">{userInfo.emailAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#286BBD] font-medium">CRM Login:</span>
                  <a href="https://project-two-mu-88.vercel.app/" target='_blank' className="text-blue-900 hover:underline underline-offset-4 transition-all font-semibold text-xs">https://project-two-mu-88.vercel.app/</a>
                </div>
              </div>
            </div>

            {/* CRM Access Button */}
            <Button 
              // onClick={() => window.open('https://project-two-mu-88.vercel.app/', '_blank')}
              className="w-full h-9 bg-[#122E5F] hover:bg-[#183B7A] text-white font-bold rounded-lg mb-3 text-sm"
            >
              <a href="https://project-two-mu-88.vercel.app/" target='_blank' className='text-white'>Access Your CRM Dashboard</a>
            </Button>

            {/* What's Next Section */}
            <div className="rounded-lg p-3 text-left mb-3">
              <h3 className="text-sm font-bold text-[#286BBD] mb-2">What's Next?</h3>
              <ul className="space-y-1 text-black text-xs leading-tight">
                <li className="flex items-center space-x-2">
                  <span className="text-[#286BBD]">•</span>
                  <span className='text-xs leading-tight'>Log into CRM with new credentials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#286BBD]">•</span>
                  <span>Your first 5 free leads will be available within 24 hours</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#286BBD]">•</span>
                  <span>Check email for setup instructions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#286BBD]">•</span>
                  <span>Start reviewing qualified prospects</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}