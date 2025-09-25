"use client";

import React, { useState } from 'react'
import { BarChart3, Activity, X, Phone, Mail, MapPin, User, ExternalLink, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dashboardCardType } from '@/types/AdminTypes';
import { dashboardCard, allLeads, contractors } from './Data';
import Link from 'next/link';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

export const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCard.map((stat: dashboardCardType, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium underline text-gray-500">{stat.time}</span>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#286BBD] font-medium">
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-[#122E5F] mr-2" />
                Recent Leads
              </CardTitle>
              <Link href="/admin/leads">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#286BBD] hover:text-[#1d4ed8] hover:bg-[#286BBD]/10 flex items-center space-x-1"
                >
                  <span className="text-sm">View All Leads</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allLeads.slice(0, 3).map((lead, index) => (
                <div 
                key={index} 
                onClick={() => handleLeadClick(lead)}
                className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-[#286BBD]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#286BBD]/10 to-[#2563eb]/10 flex items-center justify-center group-hover:from-[#286BBD]/20 group-hover:to-[#2563eb]/20 transition-all duration-200">
                    <User className="h-6 w-6 text-[#286BBD]" />
                  </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-base">{lead.firstName} {lead.lastName}</h4>

                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{lead.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex flex-col items-end space-y-1">
                    <div className="text-sm text-[#286BBD] flex items-center hover:text-[#1d4ed8] transition-colors">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-medium">{lead.phoneno}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center hover:text-gray-800 transition-colors">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="font-medium">{lead.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-[#122E5F] mr-2" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractors.slice(0, 3).map((contractor) => (
                <div
                  key={contractor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {contractor.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contractor.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                  <div className="flex flex-col items-end space-y-1">
                    <div className="text-sm text-[#286BBD] flex items-center hover:text-[#1d4ed8] transition-colors">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-medium">{contractor.phoneno}</span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center hover:text-gray-800 transition-colors">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="font-medium">{contractor.email}</span>
                    </div>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Details Modal */}
      <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-[#286BBD]">
                Lead Details
              </DialogTitle>
              <Link href="/admin/leads">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="text-[#286BBD] mr-6 border-[#286BBD] hover:bg-[#286BBD] hover:text-white flex items-center space-x-1"
                >
                  <span className="text-sm">View All Leads</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </DialogHeader>
          
          {selectedLead && (
            <div className="p-5">
      
            {/* Lead Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.firstName} {selectedLead.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Zip Code
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.zipCode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.phoneno}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                Insurance Company
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.company}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Insurance Company
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.company}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Policy Number
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {selectedLead.policy}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Purchase Date
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                  {new Date(selectedLead.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsLeadModalOpen(false)}
                className="px-4 py-2 text-sm"
              >
                Close
              </Button>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
