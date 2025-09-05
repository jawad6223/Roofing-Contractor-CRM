'use client'

import React, { useState } from 'react'
import { Home, Users, FileText, Calendar, Settings, BarChart3, MessageSquare, Menu, X, User, Search, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

const CrmDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Clients', active: false },
    { icon: FileText, label: 'Projects', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: Users, label: 'Team', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: MessageSquare, label: 'Notifications', active: false },
    { icon: Settings, label: 'Preferences', active: false },
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${item.active
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
          {/* Welcome section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-[#286BBD] capitalize">{currentUserFullName}</span>! 👋
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Here's what's happening with your roofing business today.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#286BBD]">Total Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#286BBD] font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#286BBD]">Active Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#286BBD] font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  +3 new this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#286BBD]">Revenue</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#286BBD] font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#286BBD]">Pending Quotes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-[#286BBD] font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  3 need follow-up
                </p>
              </CardContent>
            </Card>
          </div>


        </main>
      </div>
    </div>
  )
}

export default CrmDashboard
