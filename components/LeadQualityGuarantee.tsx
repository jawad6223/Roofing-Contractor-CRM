'use client'
import React from 'react';
import { scroller } from 'react-scroll';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Clock, DollarSign, Star, ArrowRight } from 'lucide-react';

export function LeadQualityGuarantee() {
  const guaranteeStats = [
    { value: '78%', label: 'Average Conversion Rate', icon: Star },
    { value: '$28K', label: 'Average Job Value', icon: DollarSign },
    { value: '24hr', label: 'Lead Freshness', icon: Clock },
    { value: '100%', label: 'Money Back Guarantee', icon: Shield }
  ];

  const verificationProcess = [
    {
      step: '01',
      title: 'Insurance Verification',
      description: 'We verify active insurance policies and confirm claim approval status.'
    },
    {
      step: '02',
      title: 'Damage Assessment',
      description: 'Professional evaluation confirms legitimate storm damage requiring repairs.'
    },
    {
      step: '03',
      title: 'Homeowner Screening',
      description: 'We qualify homeowners for timeline, budget, and decision-making authority.'
    },
    {
      step: '04',
      title: 'Lead Delivery',
      description: 'Qualified leads are delivered to you within 24 hours with full documentation.'
    }
  ];

  return (
    <section className="py-8 lg:py-12 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' fill-rule='nonzero'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563eb]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-6">
            Why Our Leads Convert at 78%
          </div>
          <h2 className="whitespace-nowrap text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2">
            Lead Quality Guarantee
          </h2>
          <p className="text-justify text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We guarantee every lead is insurance-approved, damage-confirmed, and ready to hire. 
            If you're not satisfied with your first 5 leads, we'll refund every penny.
          </p>
        </div>

        {/* What Makes Our Leads Different */}
        <div className="text-center mb-16">
          <h3 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-8">
            What Makes Our Leads Different
          </h3>
          
          {/* Auto-running slider */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee space-x-8 w-max">
              {/* First set of items */}
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Insurance Approved</h4>
                <p className="text-gray-600 text-sm">Claims already filed and approved by insurance companies</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Damage Verified</h4>
                <p className="text-gray-600 text-sm">Professional inspection confirms legitimate storm damage</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Ready to Hire</h4>
                <p className="text-gray-600 text-sm">Homeowners are pre-qualified and decision-ready</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Fresh & Exclusive</h4>
                <p className="text-gray-600 text-sm">Delivered within 24 hours, shared with max 3 contractors</p>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Insurance Approved</h4>
                <p className="text-gray-600 text-sm">Claims already filed and approved by insurance companies</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Damage Verified</h4>
                <p className="text-gray-600 text-sm">Professional inspection confirms legitimate storm damage</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Ready to Hire</h4>
                <p className="text-gray-600 text-sm">Homeowners are pre-qualified and decision-ready</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Fresh & Exclusive</h4>
                <p className="text-gray-600 text-sm">Delivered within 24 hours, shared with max 3 contractors</p>
              </div>

              {/* Third set for better seamless effect */}
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Insurance Approved</h4>
                <p className="text-gray-600 text-sm">Claims already filed and approved by insurance companies</p>
              </div>
              <div className="flex-shrink-0 text-center w-64">
                <div className="w-20 h-20 bg-[#2563eb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-10 w-10 text-[#122E5F]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Damage Verified</h4>
                <p className="text-gray-600 text-sm">Professional inspection confirms legitimate storm damage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Stats */}
        <div className="hidden">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {guaranteeStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-[#2563eb]/5 to-[#122E5F]/5 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#2563eb]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-[#2563eb]" />
                </div>
                <div className="text-3xl font-bold text-[#2563eb] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>

        {/* Verification Process */}
        <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Our 4-Step Verification Process
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every lead goes through our rigorous qualification process before reaching your inbox.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {verificationProcess.map((process, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-gradient-to-r from-[#2563eb] to-[#122E5F] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-lg font-bold shadow-lg">
                    {process.step}
                  </div>

                  {/* Content */}
                  <h4 className="text-lg font-bold text-[#286BBD] mb-1">{process.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{process.description}</p>
                </div>

                {/* Arrow for desktop */}
                {index < verificationProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 transform z-10">
                    <ArrowRight className="h-8 w-8 text-[#2563eb]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
       <div className="flex justify-center mt-10">
               <button
               onClick={() =>
                scroller.scrollTo('free-inspection-form', {
                  duration: 800,
                  delay: 0,
                  smooth: 'easeInOutQuart'
                })
              }
               className="flex items-center px-6 py-3 bg-[#DAFF59] text-black rounded-full shadow-lg hover:bg-[#d2fa35] transition-all duration-300 font-semibold text-lg">
                 <ArrowRight className="mr-2" />
                 Sign Up Now
               </button>
             </div>
      </div>
    </section>
  );
}