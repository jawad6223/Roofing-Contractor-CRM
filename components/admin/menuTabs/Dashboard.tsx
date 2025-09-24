import React, { useState } from 'react'
import { BarChart3, Activity, X, Phone, Mail, MapPin, Calendar, ExternalLink, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminStats, recentLeads, contractors } from './Data';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

export const Dashboard = ({ onTabChange }: DashboardProps) => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminStats.map((stat, index) => (
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
              {onTabChange && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange('leads')}
                  className="text-[#286BBD] hover:text-[#1d4ed8] hover:bg-[#286BBD]/10 flex items-center space-x-1"
                >
                  <span className="text-sm">View All Leads</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleLeadClick(lead)}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {lead.homeowner}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lead.location} • {lead.claimAmount}
                    </p>
                  </div>
                  <Badge className="bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20">
                    {lead.status}
                  </Badge>
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
                      {contractor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {contractor.conversionRate} conversion •{" "}
                      {contractor.totalEarnings}
                    </p>
                  </div>
                  <Badge className="bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20">
                    {contractor.leadsCompleted} closed
                  </Badge>
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
              {onTabChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsLeadModalOpen(false);
                    onTabChange('leads');
                  }}
                  className="text-[#286BBD] mr-6 border-[#286BBD] hover:bg-[#286BBD] hover:text-white flex items-center space-x-1"
                >
                  <span className="text-sm">View All Leads</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#286BBD]/5 to-[#2563eb]/5 rounded-lg p-4 border border-[#286BBD]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#286BBD]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900">{selectedLead.homeowner}</h3>
                    <p className="text-[#286BBD] font-medium">Lead ID: {selectedLead.id}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        selectedLead.status === 'Available' ? 'bg-green-100 text-green-800' :
                        selectedLead.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        selectedLead.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedLead.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#286BBD]" />
                      Location
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-700">{selectedLead.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-700">Added: {new Date(selectedLead.dateAdded).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-[#286BBD]" />
                      Project Details
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Damage Type:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedLead.damageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Claim Amount:</span>
                        <span className="text-sm font-bold text-green-600">{selectedLead.claimAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Assigned To:</span>
                        <span className="text-sm font-medium text-[#286BBD]">{selectedLead.assignedTo || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
