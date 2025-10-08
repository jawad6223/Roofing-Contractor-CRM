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
          
        </div>
      </div>




    </div>
  )
}