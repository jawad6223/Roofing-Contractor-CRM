'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { reasons } from '@/lib/componentData';

export function WhyChooseUs() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex + 1 >= reasons.length ? prevIndex : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex > 0 ? prevIndex - 1 : 0;
    });
  };

  const visibleReasons = reasons.slice(currentIndex, currentIndex + 2);

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Roofing Background Image */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        ></div>
      </div>
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/80"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23122E5F' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563eb]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-6">
            Why Choose Our Platform
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Roof Claim Pros, we are dedicated to providing our contractors with the best possible service and results.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Side - Title and Description */}
          <div className="hidden lg:flex lg:col-span-4 lg:flex-col lg:justify-center lg:h-full mb-8 lg:mb-0">
            <h2 className="text-3xl lg:text-3xl font-bold text-gray-900">
              Our Advantages
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-justify mb-8">
              With our years of experience, attention to detail, and commitment to quality lead generation, we provide contractors with the tools and support needed for success.
            </p>
          </div>

          {/* Right Side - Feature Cards Slider */}
          <div className="lg:col-span-8 w-full">
            <div className="relative w-full">
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 w-full">
                {visibleReasons.map((reason, index) => (
                  <Card key={`${reason.title}-${currentIndex}-${index}`} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 h-full w-full">
                    <CardContent className="p-6 relative w-full">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#122E5F]/10 to-[#2563eb]/10 rounded-xl flex items-center justify-center mb-4">
                        <reason.icon className="h-6 w-6 text-[#122E5F]" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pr-12">
                        {reason.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm pr-12">
                        {reason.description}
                      </p>

                      {/* Navigation Arrow inside card */}
                      <div className="absolute top-4 right-4">
                        {index === 0 ? (
                          <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              currentIndex === 0 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-[#122E5F] hover:bg-[#183B7A] text-white'
                            }`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={nextSlide}
                            disabled={currentIndex + 2 >= reasons.length}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              currentIndex + 2 >= reasons.length
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#122E5F] hover:bg-[#183B7A] text-white'
                            }`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}