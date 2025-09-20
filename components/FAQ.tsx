'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Shield, Clock, DollarSign, Users, CheckCircle, Star, HelpCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenItem(prev => prev === index ? null : index);
  };

  const faqs = [
    {
      question: "How quickly will I receive my first leads?",
      answer: "Your first 5 free leads will be delivered within 24-48 hours of account approval. We verify your license and insurance first to ensure quality for homeowners. After that, you'll receive 2-5 new leads per week based on your service area and capacity.",
      icon: Clock
    },
    {
      question: "What makes your leads different from other companies?",
      answer: "Our leads are pre-qualified with confirmed insurance claims and verified storm damage. Unlike other services that sell the same lead to 10+ contractors, we limit each lead to maximum 3 contractors in your area. Every homeowner has already filed their claim and been approved by their insurance company.",
      icon: Star
    },
    {
      question: "What's your money-back guarantee policy?",
      answer: "If you're not satisfied with your first 5 leads, we'll refund every penny within 30 days. No questions asked, no fine print. We're confident in our lead quality because 78% of our contractors close at least 3 out of their first 5 leads.",
      icon: Shield
    },
    {
      question: "How much can I expect to earn per lead?",
      answer: "Our contractors average $28,000 per closed deal, with most insurance claims ranging from $15,000 to $45,000. With a 78% average conversion rate, contractors typically earn $21,840 for every lead they receive ($28K × 78% conversion rate).",
      icon: DollarSign
    },
    {
      question: "Do you require contracts or monthly commitments?",
      answer: "No contracts, no monthly fees, no commitments. You only pay for leads you receive after your free trial. You can pause or cancel anytime, and you keep all the leads you've already received. Most contractors stay because the ROI is exceptional.",
      icon: CheckCircle
    },
    {
      question: "What areas do you service?",
      answer: "We currently service all major metropolitan areas in Texas, Oklahoma, Kansas, Nebraska, and Colorado - the primary hail belt regions. We're expanding to additional storm-prone states throughout 2025. Check if your area is covered during signup.",
      icon: Users
    },
    {
      question: "How do you verify the leads are legitimate?",
      answer: "Every lead goes through our 4-step verification: (1) Insurance policy verification, (2) Professional damage assessment with photos, (3) Homeowner qualification call, (4) Claim approval confirmation. We reject 60% of potential leads that don't meet our standards.",
      icon: Shield
    },
    {
      question: "Can I choose my service radius and lead volume?",
      answer: "Yes! You set your service radius (typically 25-50 miles) and preferred lead volume (2-10 leads per week). You can adjust these settings anytime in your CRM dashboard. We respect your capacity and won't overwhelm you with more leads than you can handle.",
      icon: Users
    }
  ];

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-br from-gray-50 via-blue-50/20 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='10' r='2'/%3E%3Ccircle cx='10' cy='50' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2563eb]/10 to-[#122E5F]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-6 border border-[#2563eb]/20">
            <HelpCircle className="h-4 w-4 mr-2" />
            Get All Your Questions Answered
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our premium lead service, answered by industry experts.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white group">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-blue-50/50 transition-all duration-300 rounded-lg group-hover:bg-blue-50/30"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openItem === index 
                        ? 'bg-gradient-to-br from-[#2563eb] to-[#122E5F] shadow-lg' 
                        : 'bg-[#122E5F]/10 group-hover:bg-[#2563eb]/20'
                    }`}>
                      <faq.icon className={`h-6 w-6 transition-colors duration-300 ${
                        openItem === index ? 'text-white' : 'text-[#122E5F]'
                      }`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 pr-4 group-hover:text-[#122E5F] transition-colors duration-300">{faq.question}</h3>
                  </div>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openItem === index 
                      ? 'bg-[#2563eb]/10 rotate-180' 
                      : 'bg-gray-100 group-hover:bg-[#2563eb]/10'
                  }`}>
                    {openItem === index ? (
                      <Minus className="h-5 w-5 text-[#122E5F]" />
                    ) : (
                      <Plus className="h-5 w-5 text-[#122E5F]" />
                    )}
                  </div>
                </button>
                
                {openItem === index && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="ml-16 pt-4 border-t border-gradient-to-r from-[#2563eb]/20 to-transparent">
                      <div className="bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg p-4 border-l-4 border-[#2563eb]">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-[#122E5F] to-[#2563eb] rounded-xl p-4 text-white">
          {/* Background Pattern */}
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="h-4 w-4 text-white" />
          </div>
          
          <h3 className="text-lg font-bold mb-2">Still Have Questions?</h3>
          <p className="text-sm text-blue-100 mb-3 max-w-2xl mx-auto">
            Get personalized answers from real industry experts who understand your roofing business.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center space-x-1 bg-white/15 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
              <Clock className="h-3 w-3 text-white" />
              <span className="text-xs font-medium text-white">2hr Response</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/15 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
              <Users className="h-3 w-3 text-white" />
              <span className="text-xs font-medium text-white">Expert Team</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/15 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/20">
              <Shield className="h-3 w-3 text-white" />
              <span className="text-xs font-medium text-white">No Pressure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}