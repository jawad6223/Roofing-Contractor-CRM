'use client';
import React from 'react';
import { Calendar, Clock, CheckCircle, ArrowRight, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { scroller } from 'react-scroll';

export const AppointmentBook = () => {
  const appointmentBenefits = [
    {
      icon: CalendarCheck,
      title: 'Pre-Scheduled Meetings',
      description: 'Leads with confirmed appointment times that match your availability'
    },
    {
      icon: CheckCircle,
      title: 'Ready-to-Meet Prospects',
      description: 'Homeowners who have already confirmed their availability and are eager to meet'
    },
    {
      icon: Clock,
      title: 'Time-Saving Solution',
      description: 'Skip the back-and-forth scheduling and go straight to meeting qualified leads'
    }
  ];

  return (
    <section className="py-10 lg:py-14 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' fill-rule='nonzero'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563eb]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Streamlined Appointment Booking
          </div>
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3">
            Let Us Book The Appointment For You
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Purchase pre-scheduled appointments with qualified leads who have already confirmed their availability.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-900 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-0.5">Purchase Appointments</h4>
                    <p className="text-gray-900 text-xs">Buy pre-scheduled appointments based on your availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-900 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-0.5">Get Matched Leads</h4>
                    <p className="text-gray-900 text-xs">Receive leads with confirmed appointment times</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-900 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-0.5">Meet & Close Deals</h4>
                    <p className="text-gray-900 text-xs">Show up to pre-scheduled meetings with ready-to-hire homeowners</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 lg:p-6 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#2563eb] to-[#122E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Ready to Get Started?</h4>
                <p className="text-gray-600 text-xs mb-5">
                  Join thousands of contractors closing more deals with pre-scheduled appointments
                </p>
                <button
                  onClick={() =>
                    scroller.scrollTo('free-inspection-form', {
                      duration: 800,
                      delay: 0,
                      smooth: 'easeInOutQuart'
                    })
                  }
                  className="flex items-center justify-center px-5 py-2.5 bg-[#122E5F] text-white rounded-full shadow-lg hover:bg-[#0f2347] transition-all duration-300 font-semibold text-sm w-full"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
