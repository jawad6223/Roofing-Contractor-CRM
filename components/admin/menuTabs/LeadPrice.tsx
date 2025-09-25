"use client";

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DollarSign, Star, ShoppingCart } from 'lucide-react'
import { pricingTiers } from './Data'

export const LeadPrice = () => {
  const [editingTier, setEditingTier] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-[#286BBD]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-4">
          <DollarSign className="h-4 w-4 mr-2" />
          Lead Pricing Management
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pricing Tiers & Packages
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage pricing for different lead quality tiers and track revenue performance
        </p>
      </div>


      {/* Pricing Tiers */}
      <div>
       

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <div className="relative">
            {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-[#286BBD] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
            <Card 
              key={tier.id} 
              className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                tier.popular ? 'ring-2 ring-[#286BBD]' : ''
              }`}
            >
              
              {/* <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`}></div> */}
              
              <CardHeader className={`text-center pb-4 bg-gradient-to-br from-blue-50 to-blue-100 ${tier.popular ? 'pt-8' : 'pt-6'}`}>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </CardTitle>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                
                {editingTier === tier.id ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold text-gray-900">$</span>
                    <Input 
                      defaultValue={tier.price}
                      className="w-20 h-12 text-2xl font-bold text-center border-2 border-[#286BBD]"
                    />
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${tier.price}
                  </div>
                )}
                <p className="text-gray-600">per lead</p>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#286BBD] text-xs">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                
                  <Button
                    variant="outline"
                    className="w-full border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      </div>




    </div>
  )
}