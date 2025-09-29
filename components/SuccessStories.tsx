'use client';
import React, { useState } from 'react';
import { scroller } from 'react-scroll';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { stories } from '@/lib/componentData';

export function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex + 1 >= stories.length ? prevIndex : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex > 0 ? prevIndex - 1 : 0;
    });
  };

  const visibleStories = stories.slice(currentIndex, currentIndex + 2);

  return (
    <section className="py-8 lg:py-10 bg-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563eb]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-6">
            Real Results from Real Contractors
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how contractors like you have transformed their businesses with our premium lead system.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Side - Title and Description */}
          <div className="hidden lg:flex lg:col-span-4 lg:flex-col lg:justify-center lg:h-full mb-8 lg:mb-0">
            <h2 className="text-3xl lg:text-3xl font-bold text-gray-900">
              Contractor Success
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-justify mb-8">
              At Roof Claim Pros we take pride in providing high-quality solutions that meet the unique needs of our contractors. But don't just take our word for it – here's what some of our satisfied contractors have to say:
            </p>
          </div>

          {/* Right Side - Testimonial Slider */}
          <div className="lg:col-span-8 w-full">
            <div className="relative w-full">
              {/* Testimonial Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 w-full">
                {visibleStories.map((story, index) => (
                  <Card key={`${story.name}-${currentIndex}-${index}`} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 h-full w-full">
                    <CardContent className="p-6 relative w-full">
                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Star className="h-5 w-5 text-[#286BBD] fill-current" />
                        <span className="text-lg font-semibold text-[#122E5F]">{story.rating} Rating</span>
                      </div>

                      {/* Testimonial */}
                      <p className="text-gray-700 leading-relaxed mb-6 text-sm pr-12">
                        "{story.testimonial}"
                      </p>

                      {/* Author */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="font-semibold text-gray-900 text-sm">- {story.name}</div>
                        <div className="text-xs text-gray-600">{story.company}</div>
                        <div className="text-xs text-gray-500">{story.location}</div>
                      </div>

                      {/* Navigation Arrow inside card */}
                      <div className="absolute top-4 right-4">
                        {index === 0 ? (
                          <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentIndex === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#122E5F] hover:bg-[#183B7A] text-white'
                              }`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={nextSlide}
                            disabled={currentIndex + 2 >= stories.length}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentIndex + 2 >= stories.length
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
    </section>
  );
}