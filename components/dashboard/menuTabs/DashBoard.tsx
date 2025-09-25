"use client";

import { Home, FileText, TrendingUp, DollarSign, BarChart3, Users, UserPlus, User, Settings, Package, CheckCircle, Phone, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { purchasedLeads } from "./Data";
import Link from 'next/link'

export const DashBoard = () => {
  const { getCurrentUserFullName } = useAuth()
  const currentUserFullName = getCurrentUserFullName()
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  
  const recentActivity = [
    { 
      id: 1,
      action: 'Purchased lead', 
      location: 'Dallas, TX', 
      time: '2 hours ago', 
      status: 'success',
      customerName: 'John Smith',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      projectType: 'Roof Replacement',
      estimatedValue: '$15,000',
      urgency: 'High',
      notes: 'Urgent roof replacement needed due to storm damage. Insurance claim in progress.'
    },
    { 
      id: 2,
      action: 'Quote sent', 
      location: 'Houston, TX', 
      time: '5 hours ago', 
      status: 'pending',
      customerName: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      email: 'sarah.j@email.com',
      projectType: 'Roof Repair',
      estimatedValue: '$8,500',
      urgency: 'Medium',
      notes: 'Customer received quote, considering options. Price-conscious, comparing contractors.'
    },
    { 
      id: 3,
      action: 'Lead converted', 
      location: 'Austin, TX', 
      time: '1 day ago', 
      status: 'success',
      customerName: 'Mike Davis',
      phone: '+1 (555) 456-7890',
      email: 'mike.davis@email.com',
      projectType: 'New Construction',
      estimatedValue: '$25,000',
      urgency: 'Low',
      notes: 'Project completed successfully. Customer satisfied. Left 5-star review.'
    }
  ]

  const handleLeadClick = (lead: any) => {
    console.log('lead', lead)
    setSelectedLead(lead)
    setIsLeadModalOpen(true)
  }
  return (
    <>
              {/* Welcome section */}
              <div className="mb-8 relative overflow-hidden bg-gradient-to-br from-[#122E5F] via-[#286BBD] to-[#2563eb] rounded-2xl p-8 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold capitalize">
                        Welcome back, {currentUserFullName}! 👋
                      </h1>
                      <p className="text-blue-100 text-lg">
                        Your business performance at a glance
                      </p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-4 right-8 w-20 h-20 bg-white/5 rounded-full"></div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Total Leads</CardTitle>
                    <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#286BBD]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-[#286BBD] font-bold mb-1">2,847</div>
                    <p className="text-sm text-green-600 font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12.5%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Active Leads</CardTitle>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-green-600 font-bold mb-1">150</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Ready to use
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-red-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Closed Leads</CardTitle>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-red-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-red-600 font-bold mb-1">1,369</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Ready to use
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <BarChart3 className="h-6 w-6 mr-2 text-[#286BBD]" />
                        Recent Leads
                      </CardTitle>
                      <Link href="/dashboard/leads">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#286BBD] hover:text-[#1d4ed8] hover:bg-[#286BBD]/10 flex items-center space-x-1"
                        >
                          <span className="text-sm">All Leads</span>
                          <Users className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {purchasedLeads.slice(0, 3).map((activity, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleLeadClick(activity)}
                          className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-[#286BBD]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#286BBD]/10 to-[#2563eb]/10 flex items-center justify-center group-hover:from-[#286BBD]/20 group-hover:to-[#2563eb]/20 transition-all duration-200">
                              <User className="h-6 w-6 text-[#286BBD]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-base">{activity.firstName} {activity.lastName}</h4>

                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{activity.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex flex-col items-end space-y-1">
                              <div className="text-sm text-[#286BBD] flex items-center hover:text-[#1d4ed8] transition-colors">
                                <Phone className="h-4 w-4 mr-1" />
                                <span className="font-medium">{activity.phoneno}</span>
                              </div>
                              <div className="text-sm text-gray-600 flex items-center hover:text-gray-800 transition-colors">
                                <Mail className="h-4 w-4 mr-1" />
                                <span className="font-medium">{activity.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Package className="h-6 w-6 mr-2 text-[#286BBD]" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/dashboard/crm">
                        <Button 
                          className="h-20 bg-gradient-to-r from-[#286BBD] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white flex flex-col items-center justify-center space-y-2 w-full"
                        >
                          <Users className="h-6 w-6" />
                          <span className="text-sm font-medium">CRM</span>
                        </Button>
                      </Link>
                      <Link href="/dashboard/teams">
                        <Button 
                          variant="outline" 
                          className="h-20 border-2 border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white flex flex-col items-center justify-center space-y-2 w-full"
                        >
                          <UserPlus className="h-6 w-6" />
                          <span className="text-sm font-medium">Teams</span>
                        </Button>
                      </Link>
                      <Link href="/dashboard/leads">
                        <Button 
                          variant="outline" 
                          className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2 w-full"
                        >
                          <FileText className="h-6 w-6" />
                          <span className="text-sm font-medium">Leads</span>
                        </Button>
                      </Link>
                      <Link href="/dashboard/settings">
                        <Button 
                          variant="outline" 
                          className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2 w-full"
                        >
                          <Settings className="h-6 w-6" />
                          <span className="text-sm font-medium">Settings</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-xl font-bold text-[#286BBD]">
                        Lead Details
                      </DialogTitle>
                      <Link href="/dashboard/leads">
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
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-[#286BBD]/5 to-[#2563eb]/5 rounded-lg p-4 border border-[#286BBD]/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-[#286BBD]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</h3>
                            <p className="text-[#286BBD] font-medium">Purchased Lead</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                selectedLead.status === 'New' ? 'bg-green-100 text-green-800' :
                                selectedLead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {selectedLead.status}
                              </span>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#286BBD]/10 text-[#286BBD]">
                                {selectedLead.damageType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-[#286BBD]" />
                              Contact Information
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-700">{selectedLead.phoneno}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-700">{selectedLead.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-700">{selectedLead.location}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <Package className="h-4 w-4 mr-2 text-[#286BBD]" />
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
                                <span className="text-sm text-gray-600">Purchase Date:</span>
                                <span className="text-sm text-gray-700">{new Date(selectedLead.purchaseDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#286BBD]" />
                              Insurance Information
                            </h4>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Company:</span>
                                <span className="text-sm font-medium text-gray-900">{selectedLead.company}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Policy:</span>
                                <span className="text-sm font-medium text-gray-900">{selectedLead.policy}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Zip Code:</span>
                                <span className="text-sm font-medium text-gray-900">{selectedLead.zipCode}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                </DialogContent>
              </Dialog>
            </>
  )
}