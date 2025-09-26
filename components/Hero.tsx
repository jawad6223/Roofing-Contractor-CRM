'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Element } from 'react-scroll';
import { ContractorForm } from './ContractorForm';
import { stats, benefits } from './utils/data';
export function Hero() {

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Element name="free-inspection-form">
      {/* Background with construction/contractor imagery */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/BG-Image.png')`
            }}
          ></div>
        </div>
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-slate-900/70 to-blue-800/80"></div>
        
        {/* Geometric patterns for contractor feel */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Construction tools icons scattered */}
        <div className="absolute bottom-10 left-10 opacity-5 transform rotate-12">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
            <path d="M13.78 15.3L19.78 21.3L21.89 19.14L15.89 13.14L13.78 15.3M17.5 10.1C17.11 10.1 16.69 10.05 16.36 9.91L4.97 21.25L2.86 19.14L10.27 11.74C8.5 10.23 8.66 7.53 10.64 5.55C12.58 3.61 15.27 3.76 16.7 5.14L12.75 9.09L14.16 10.5L18.11 6.55C19.5 7.97 19.65 10.66 17.71 12.6C16.94 13.37 16.12 13.5 15.54 13.5C14.21 13.5 13.78 15.3 13.78 15.3Z"/>
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Mobile Header - Only visible on mobile, shown first */}
          <div className="lg:hidden col-span-full text-center lg:mb-8 order-1 relative z-10">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-[#122E5F] rounded-full text-sm font-medium mb-3">
              Join 2,000+ Successful Contractors
            </div>
            <h1 className="text-2xl font-bold text-white leading-tight mb-3">
              Get Premium Insurance Claim
              <span className="text-blue-200"> Leads That Actually Convert</span>
            </h1>
          </div>

          {/* Form - Second on mobile, Second on desktop */}
          <div className="lg:order-2 order-2 mb-2 lg:mb-0 relative z-10">
            <ContractorForm />
          </div>

          {/* Content - Text first on desktop */}
          <div className="lg:order-1 order-3 relative z-10">
            {/* Badge - Hidden on mobile */}
            <div className="hidden lg:inline-flex items-center px-4 py-2 bg-[#2563eb]/90 text-white rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              Join 2,000+ Successful Contractors
            </div>

            {/* Headline - Hidden on mobile */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Get Premium Insurance Claim
                <span className="text-blue-200"> Leads That Actually Convert</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 leading-relaxed">
                Stop chasing leads and start closing deals. Our pre-qualified homeowners have approved insurance claims and are ready to hire immediately.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#2563eb]/5 backdrop-blur-sm border border-[#2563eb]/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 lg:h-8 lg:w-8 text-[#2563eb]" />
                  </div>
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-200 mb-1">{stat.value}</div>
                  <div className="text-sm lg:text-base text-gray-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6  mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base lg:text-lg font-bold text-white mb-0.5">{benefit.title}</h3>
                    <p className="text-gray-200 text-sm lg:text-base leading-snug">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
      </Element>
    </div>
  );
}