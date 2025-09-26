import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Shield, Users } from 'lucide-react';
import { packages } from '@/lib/componentData';

export function PricingPackages() {
  

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23122E5F' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-[#2563eb]/10 text-[#122E5F] rounded-full text-sm font-semibold mb-4">
            No Setup Fees • Pay Per Lead Only
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Package
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with free leads, then pay only for qualified prospects. No monthly fees, no contracts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              pkg.popular ? 'ring-2 ring-[#2563eb] bg-white' : 'bg-white'
            }`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#2563eb] text-white px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <CardContent className="p-6 text-center">
                {/* Package Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{pkg.name}</h3>
                
                {/* Free Leads */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-[#122E5F] mb-1">{pkg.freeLeads} FREE</div>
                  <div className="text-sm text-gray-600">Premium Leads</div>
                </div>
                
                {/* Price Per Lead */}
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{pkg.pricePerLead}</div>
                  <div className="text-sm text-gray-600">per lead after</div>
                </div>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-[#2563eb] flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Button 
                  className={`w-full h-10 font-bold text-sm rounded-lg transition-colors ${
                    pkg.popular 
                      ? 'bg-[#122E5F] hover:bg-[#183B7A] text-white' 
                      : 'bg-gray-100 hover:bg-[#122E5F] hover:text-white text-gray-900'
                  }`}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Guarantee */}
        <div className="text-center bg-white rounded-xl p-6 shadow-lg border border-[#2563eb]/10">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#122E5F]" />
              <span className="text-sm font-medium text-gray-700">Money-Back Guarantee</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#122E5F]" />
              <span className="text-sm font-medium text-gray-700">2,000+ Contractors</span>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-[#122E5F]" />
              <span className="text-sm font-medium text-gray-700">No Setup Fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}