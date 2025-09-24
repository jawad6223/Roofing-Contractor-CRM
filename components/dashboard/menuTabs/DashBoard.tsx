import { Home, FileText, TrendingUp, DollarSign, BarChart3, Users, UserPlus, Settings, Package, CheckCircle, Phone, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { DashBoardProps } from '@/types/DashboardTypes'
import { useState } from 'react'

export const DashBoard = ({ onTabChange }: DashBoardProps) => {
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

                {/* <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div className="flex flex-col">
                  <span className="text-xs font-medium underline text-gray-500">Last Month</span>
                  <CardTitle className="text-sm font-semibold text-[#286BBD]">Total Sales</CardTitle>
                  </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-purple-600 font-bold mb-1">$284,750</div>
                    <p className="text-sm text-gray-600 font-medium">
                      +15.3%
                    </p>
                  </CardContent>
                </Card> */}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <BarChart3 className="h-6 w-6 mr-2 text-[#286BBD]" />
                        Recent Activity
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTabChange('Leads')}
                        className="text-[#286BBD] hover:text-[#1d4ed8] hover:bg-[#286BBD]/10 flex items-center space-x-1"
                      >
                        <span className="text-sm">All Leads</span>
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleLeadClick(activity)}
                          className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className={`w-3 h-3 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.location} • {activity.time}</p>
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
                      <Button 
                        onClick={() => onTabChange('CRM')}
                        className="h-20 bg-gradient-to-r from-[#286BBD] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white flex flex-col items-center justify-center space-y-2"
                      >
                        <Users className="h-6 w-6" />
                        <span className="text-sm font-medium">CRM</span>
                      </Button>
                      <Button 
                        onClick={() => onTabChange('Teams')}
                        variant="outline" 
                        className="h-20 border-2 border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white flex flex-col items-center justify-center space-y-2"
                      >
                        <UserPlus className="h-6 w-6" />
                        <span className="text-sm font-medium">Teams</span>
                      </Button>
                      <Button 
                        onClick={() => onTabChange('Leads')}
                        variant="outline" 
                        className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2"
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-sm font-medium">Leads</span>
                      </Button>
                      <Button 
                        onClick={() => onTabChange('Settings')}
                        variant="outline" 
                        className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2"
                      >
                        <Settings className="h-6 w-6" />
                        <span className="text-sm font-medium">Settings</span>
                      </Button>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsLeadModalOpen(false)
                          onTabChange('Leads')
                        }}
                        className="text-[#286BBD] mr-6 border-[#286BBD] hover:bg-[#286BBD] hover:text-white flex items-center space-x-1"
                      >
                        <span className="text-sm">View All Leads</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
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
                            <h3 className="font-bold text-xl text-gray-900">{selectedLead.customerName}</h3>
                            <p className="text-[#286BBD] font-medium">{selectedLead.action}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                selectedLead.urgency === 'High' ? 'bg-red-100 text-red-800' :
                                selectedLead.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {selectedLead.urgency}
                              </span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                selectedLead.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
                              <Phone className="h-4 w-4 mr-2 text-[#286BBD]" />
                              Contact
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-700">{selectedLead.phone}</span>
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
                              Project
                            </h4>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Type:</span>
                                <span className="text-sm font-medium text-gray-900">{selectedLead.projectType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Value:</span>
                                <span className="text-sm font-bold text-green-600">{selectedLead.estimatedValue}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Time:</span>
                                <span className="text-sm text-gray-700">{selectedLead.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#286BBD]" />
                              Notes
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{selectedLead.notes}</p>
                          </div>

                          {/* <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                            <div className="space-y-2">
                              <Button className="w-full bg-[#286BBD] hover:bg-[#1d4ed8] text-white text-sm">
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </Button>
                              <Button variant="outline" className="w-full border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white text-sm">
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </Button>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
  )
}