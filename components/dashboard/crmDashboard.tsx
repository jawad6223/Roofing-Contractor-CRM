'use client'

import React, { useState } from 'react'
import { Home, Users, FileText, Calendar, Settings, BarChart3, MessageSquare, Menu, X, User, Search, LogOut, ShoppingCart, MapPin, CreditCard, Bell, UserPlus, DollarSign, TrendingUp, Package, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

const CrmDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const { user, logout } = useAuth()

  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: BarChart3, label: 'CRM' },
    { icon: Users, label: 'Leads' },
    // { icon: FileText, label: 'My Leads' },
    { icon: Settings, label: 'Settings' },
    { icon: UserPlus, label: 'Teams' },
  ]

  const handleLogout = () => {
    logout()
  }

  console.log('user',user);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '[]');
  const currentUserInfo = userInfo.find((info: { emailAddress: string, fullName: string }) => 
    info.emailAddress === user
  );
  const currentUserFullName = currentUserInfo?.fullName || user;
  console.log('currentUserFullName',currentUserFullName);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              {/* <span className="text-white font-bold text-sm">R</span> */}
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Roofing CRM</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-[#286BBD]" />
          </Button>
        </div>

        <div className="flex flex-col h-[calc(100vh-120px)]">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.label
                    ? 'bg-blue-50 text-[#286BBD] border-r-2 border-[#286BBD]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-white h-[100px]">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-2">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate capitalize">
                {currentUserFullName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user}
                  {/* {user}@roofingcrm.com */}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[#286BBD]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 text-gray-900 rounded-md"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-4 sm:p-6">
          {/* Dynamic content based on active tab */}
          {activeTab === 'Dashboard' && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Purchased Leads</CardTitle>
                    <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#286BBD]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-[#286BBD] font-bold mb-1">24</div>
                    <p className="text-sm text-green-600 font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +2 this month
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Available Credits</CardTitle>
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

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">ROI Performance</CardTitle>
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-purple-600 font-bold mb-1">285%</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Excellent returns
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-[#286BBD]">Conversion Rate</CardTitle>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-orange-600 font-bold mb-1">78%</div>
                    <p className="text-sm text-gray-600 font-medium">
                      Above average
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2 text-[#286BBD]" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: 'Purchased lead', location: 'Dallas, TX', time: '2 hours ago', status: 'success' },
                        { action: 'Quote sent', location: 'Houston, TX', time: '5 hours ago', status: 'pending' },
                        { action: 'Lead converted', location: 'Austin, TX', time: '1 day ago', status: 'success' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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
                        onClick={() => setActiveTab('Leads')}
                        className="h-20 bg-gradient-to-r from-[#286BBD] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white flex flex-col items-center justify-center space-y-2"
                      >
                        <Users className="h-6 w-6" />
                        <span className="text-sm font-medium">Browse Leads</span>
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('CRM')}
                        variant="outline" 
                        className="h-20 border-2 border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white flex flex-col items-center justify-center space-y-2"
                      >
                        <ShoppingCart className="h-6 w-6" />
                        <span className="text-sm font-medium">Buy Package</span>
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('My Leads')}
                        variant="outline" 
                        className="h-20 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 flex flex-col items-center justify-center space-y-2"
                      >
                        <FileText className="h-6 w-6" />
                        <span className="text-sm font-medium">My Leads</span>
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('Settings')}
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
            </>
          )}

          {activeTab === 'CRM' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-[#286BBD]/10 text-[#286BBD] rounded-full text-sm font-semibold mb-4">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Lead Packages
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Choose Your Package
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Select the perfect package for your business needs. All packages include premium, pre-qualified leads.
                </p>
              </div>
              
              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                    <p className="text-gray-600">Perfect for new contractors</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">$299</div>
                      <p className="text-gray-600">10 Premium Leads</p>
                      <p className="text-sm text-gray-500">$29.90 per lead</p>
                    </div>
                    <div className="space-y-3 mb-8 text-left">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Insurance verified leads</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Basic CRM access</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Email support</span>
                      </div>
                    </div>
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#286BBD] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#286BBD] to-[#2563eb]"></div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#286BBD] text-white px-4 py-2 mt-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="w-16 h-16 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-[#286BBD]" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                    <p className="text-gray-600">Best value for growing businesses</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">$599</div>
                      <p className="text-gray-600">25 Premium Leads</p>
                      <p className="text-sm text-gray-500">$23.96 per lead</p>
                      <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        Save 20%
                      </div>
                    </div>
                    <div className="space-y-3 mb-8 text-left">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Everything in Starter</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Priority support</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Territory protection</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Advanced analytics</span>
                      </div>
                    </div>
                    <Button className="w-full h-12 bg-[#286BBD] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Choose Professional
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
                    <p className="text-gray-600">For established contractors</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">$999</div>
                      <p className="text-gray-600">50 Premium Leads</p>
                      <p className="text-sm text-gray-500">$19.98 per lead</p>
                      <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        Save 33%
                      </div>
                    </div>
                    <div className="space-y-3 mb-8 text-left">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Everything in Professional</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Dedicated account manager</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Custom territory setup</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">Phone support</span>
                      </div>
                    </div>
                    <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Go Enterprise
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Trust indicators */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Why Choose Our Packages?</h3>
                  <p className="text-gray-600">Join thousands of successful contractors</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">78% Conversion Rate</h4>
                    <p className="text-sm text-gray-600">Industry-leading lead quality</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">24hr Delivery</h4>
                    <p className="text-sm text-gray-600">Fresh leads delivered fast</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">$28K Avg Value</h4>
                    <p className="text-sm text-gray-600">High-value insurance claims</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Leads' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Available Leads
                  </h1>
                  <p className="text-gray-600">Premium leads within your 25-mile service radius</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">5 New Leads Today</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              {/* <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Radius:</span>
                    <select className="text-sm border rounded px-2 py-1">
                      <option>25 miles</option>
                      <option>50 miles</option>
                      <option>75 miles</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Min Value:</span>
                    <select className="text-sm border rounded px-2 py-1">
                      <option>Any</option>
                      <option>$15,000+</option>
                      <option>$25,000+</option>
                      <option>$35,000+</option>
                    </select>
                  </div>
                </div>
              </div> */}
              
              {/* Lead Cards */}
              <div className="space-y-4">
                {[
                  { id: 1, type: 'Hail Damage', location: 'Dallas, TX', distance: '15 miles', value: '$28,000', urgency: 'High', posted: '2 hours ago' },
                  { id: 2, type: 'Wind Damage', location: 'Houston, TX', distance: '22 miles', value: '$35,000', urgency: 'Medium', posted: '4 hours ago' },
                  { id: 3, type: 'Storm Damage', location: 'Austin, TX', distance: '18 miles', value: '$42,000', urgency: 'High', posted: '6 hours ago' },
                  { id: 4, type: 'Hail Damage', location: 'Fort Worth, TX', distance: '12 miles', value: '$25,000', urgency: 'Low', posted: '8 hours ago' },
                  { id: 5, type: 'Wind Damage', location: 'Plano, TX', distance: '20 miles', value: '$31,000', urgency: 'Medium', posted: '1 day ago' }
                ].map((lead) => (
                  <Card key={lead.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-white to-blue-50/30">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                            <Home className="h-6 w-6 text-[#286BBD]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {lead.type} Repair
                            </h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{lead.location} • {lead.distance} away</span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="text-right">
                          <div className="text-3xl font-bold text-[#286BBD] mb-1">$89</div>
                          <p className="text-sm text-gray-500">per lead</p>
                        </div> */}
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Insurance approved claim for complete roof replacement. Homeowner has received adjuster approval and is ready to hire immediately. All permits and documentation ready.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          ✓ Insurance Approved
                        </Badge>
                        <Badge variant="outline" className="border-[#286BBD] text-[#286BBD]">
                          {lead.value} Est. Value
                        </Badge>
                        <Badge variant={lead.urgency === 'High' ? 'destructive' : lead.urgency === 'Medium' ? 'default' : 'secondary'}>
                          {lead.urgency} Priority
                        </Badge>
                        <span className="text-sm text-gray-500">Posted {lead.posted}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>2 contractors competing</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Expires in 18 hours</span>
                          </div>
                        </div>
                        {/* <Button className="bg-gradient-to-r from-[#286BBD] to-[#2563eb] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold px-6">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Lead
                        </Button> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'My Leads' && (
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                My Purchased Leads
              </h1>
              <p className="text-gray-600 mb-8">Manage your purchased leads and track progress.</p>
              
              <div className="space-y-4">
                {[1, 2, 3].map((lead) => (
                  <Card key={lead} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                            Storm Damage Repair - Lead #{lead}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">Houston, TX • 18 miles away</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">Purchased 2 days ago</div>
                          <div className="text-lg font-bold text-green-600">$32,000 value</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Name:</span>
                            <p className="font-medium">John Smith</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Phone:</span>
                            <p className="font-medium">(555) 123-4567</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <p className="font-medium">john@email.com</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge className="bg-blue-100 text-blue-800">Contacted</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">Quote Sent</Badge>
                        <Badge variant="outline">Follow-up Scheduled</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button size="sm" variant="outline" className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Send Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule Visit
                          </Button>
                        </div>
                        <Button size="sm" className="bg-[#286BBD] hover:bg-[#1d4ed8]">
                          View Full Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Lead Management Tips */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Lead Management Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p className="text-gray-700">• Contact leads within 5 minutes for best results</p>
                    <p className="text-gray-700">• Follow up 3-5 times before marking as unresponsive</p>
                    <p className="text-gray-700">• Schedule in-person visits within 24-48 hours</p>
                    <p className="text-gray-700">• Send professional quotes within same day</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Settings
                </h1>
                <p className="text-lg text-gray-600">Manage your account preferences and business settings</p>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#286BBD]/5 to-[#2563eb]/5">
                    <CardTitle className="flex items-center text-[#286BBD] text-xl">
                      <User className="h-5 w-5 mr-2" />
                      Profile Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-[#286BBD] rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 capitalize">{currentUserFullName}</h3>
                      <p className="text-sm text-gray-600">{user}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <Input value={currentUserFullName} className="text-gray-900 h-11" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <Input value={currentUserFullName} className="text-gray-900 h-11" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Service Radius</label>
                        <div className="relative">
                          <Input placeholder="25" className="text-gray-900 h-11 pr-16" />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">miles</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
                        <Input placeholder="123 Main St, Dallas, TX 75201" className="text-gray-900 h-11" />
                      </div>
                    </div>
                    <Button className="w-full h-11 bg-[#286BBD] hover:bg-[#1d4ed8] font-semibold">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardTitle className="flex items-center text-[#286BBD] text-xl">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">Email Notifications</span>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-[#286BBD] rounded" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">SMS Notifications</span>
                          <p className="text-sm text-gray-600">Get text alerts for urgent updates</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-[#286BBD] rounded" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">New Lead Alerts</span>
                          <p className="text-sm text-gray-600">Instant notifications for new leads</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-[#286BBD] rounded" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">Weekly Reports</span>
                          <p className="text-sm text-gray-600">Performance summaries</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 text-[#286BBD] rounded" />
                      </div>
                    </div>
                    <Button className="w-full h-11 bg-[#286BBD] hover:bg-[#1d4ed8] font-semibold">
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="xl:col-span-2 border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <CardTitle className="flex items-center text-[#286BBD] text-xl">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-[#286BBD] transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Visa • Expires 12/25</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Primary</Badge>
                      </div>
                      <Button variant="outline" className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-[#286BBD] hover:bg-[#286BBD]/5">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Add New Payment Method
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">💳 Payment Security</h4>
                      <p className="text-sm text-gray-700">All payment information is encrypted and secure. We never store your full card details.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'Teams' && (
            <div className="space-y-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Team Management
              </h1>
              <p className="text-gray-600 mb-8">Add and manage team members who can view and manage leads.</p>
              
              <div className="mb-6">
                <Button className="bg-[#286BBD] hover:bg-[#1d4ed8]">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Sales Manager', status: 'Active' },
                  { name: 'Mike Davis', email: 'mike@company.com', role: 'Lead Coordinator', status: 'Active' },
                  { name: 'Lisa Chen', email: 'lisa@company.com', role: 'Project Manager', status: 'Pending' }
                ].map((member, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-[#286BBD] rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-sm font-medium text-[#286BBD]">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            className={member.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {member.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Team Permissions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Team Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p className="text-gray-700">• <strong>Sales Manager:</strong> Full access to leads and CRM</p>
                    <p className="text-gray-700">• <strong>Lead Coordinator:</strong> View and manage leads only</p>
                    <p className="text-gray-700">• <strong>Project Manager:</strong> Access to purchased leads</p>
                    <p className="text-gray-700">• <strong>Admin:</strong> Full system access and settings</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}


        </main>
      </div>
    </div>
  )
}

export default CrmDashboard