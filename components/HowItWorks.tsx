"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { scroller } from 'react-scroll';
import { ArrowRight, CheckCircle, Clock, Shield, Star } from 'lucide-react';
import { steps } from './utils/data';

export function HowItWorks() {
  

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23122E5F' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563eb]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-6">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From signup to your first closed deal in as little as 24 hours. Our streamlined process gets you earning faster.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#2563eb] to-[#122E5F] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-[#2563eb]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
                    <step.icon className="h-8 w-8 text-[#122E5F]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{step.description}</p>

                </CardContent>
              </Card>

              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-[#2563eb]/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center my-5">
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

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-[#122E5F] to-[#2563eb] rounded-xl p-4 text-white">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star className="h-4 w-4 text-white fill-current" />
          </div>
          <h3 className="text-lg font-bold mb-2">Ready to Start Closing Premium Deals?</h3>
          <p className="text-sm text-blue-100 mb-3 max-w-2xl mx-auto">
            Join 2,000+ contractors earning $28K+ per job with our pre-qualified insurance leads.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center space-x-1 bg-white/15 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
              <CheckCircle className="h-3 w-3 text-white" />
              <span className="text-xs font-medium text-white">5 Free Leads</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/15 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
              <Clock className="h-3 w-3 text-white" />
              <span className="text-xs font-medium text-white">24hr Setup</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/15 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
              <Shield className="h-3 w-3 text-white" />
              <span className="text-xs font-medium text-white">$0 Upfront</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}