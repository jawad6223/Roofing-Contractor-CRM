'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  MoreVertical,
  MapPin,
  Calendar,
  Settings,
  UserCheck,
  Target,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Bell,
  BarChart3,
  Activity,
  Menu,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock admin data
  const adminStats = [
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+12.5%',
      icon: FileText,
      color: 'bg-[#122E5F]'
    },
    {
      title: 'Active Contractors',
      value: '156',
      change: '+8.2%',
      icon: Users,
      color: 'bg-[#286BBD]'
    },
    {
      title: 'Total Revenue',
      value: '$284,750',
      change: '+15.3%',
      icon: DollarSign,
      color: 'bg-[#122E5F]'
    },
    {
      title: 'Conversion Rate',
      value: '78.4%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'bg-[#286BBD]'
    }
  ];

  const recentLeads = [
    {
      id: 'L001',
      homeowner: 'John Smith',
      location: 'Houston, TX',
      damageType: 'Hail Damage',
      claimAmount: '$28,500',
      status: 'Available',
      dateAdded: '2024-01-15',
      assignedTo: null
    },
    {
      id: 'L002',
      homeowner: 'Sarah Johnson',
      location: 'Dallas, TX',
      damageType: 'Wind Damage',
      claimAmount: '$35,200',
      status: 'Assigned',
      dateAdded: '2024-01-14',
      assignedTo: 'Mike Rodriguez'
    },
    {
      id: 'L003',
      homeowner: 'David Chen',
      location: 'Austin, TX',
      damageType: 'Storm Damage',
      claimAmount: '$42,100',
      status: 'Closed',
      dateAdded: '2024-01-13',
      assignedTo: 'Jennifer Martinez'
    },
    {
      id: 'L004',
      homeowner: 'Lisa Wilson',
      location: 'San Antonio, TX',
      damageType: 'Hail Damage',
      claimAmount: '$31,800',
      status: 'In Progress',
      dateAdded: '2024-01-12',
      assignedTo: 'Robert Wilson'
    }
  ];

  const contractors = [
    {
      id: 'C001',
      name: 'Mike Rodriguez',
      company: 'Elite Roofing Solutions',
      location: 'Houston, TX',
      leadsAssigned: 12,
      leadsCompleted: 9,
      conversionRate: '75%',
      totalEarnings: '$252,000',
      status: 'Active',
      joinDate: '2023-06-15'
    },
    {
      id: 'C002',
      name: 'Jennifer Martinez',
      company: 'Premier Roofing Co',
      location: 'Dallas, TX',
      leadsAssigned: 15,
      leadsCompleted: 13,
      conversionRate: '87%',
      totalEarnings: '$364,000',
      status: 'Active',
      joinDate: '2023-04-22'
    },
    {
      id: 'C003',
      name: 'Robert Wilson',
      company: 'Reliable Storm Solutions',
      location: 'Austin, TX',
      leadsAssigned: 8,
      leadsCompleted: 6,
      conversionRate: '75%',
      totalEarnings: '$168,000',
      status: 'Active',
      joinDate: '2023-08-10'
    }
  ];

  const leadPricing = [
    {
      category: 'Hail Damage',
      basePrice: '$89',
      premiumPrice: '$129',
      locations: 'All Texas'
    },
    {
      category: 'Wind Damage',
      basePrice: '$79',
      premiumPrice: '$119',
      locations: 'All Texas'
    },
    {
      category: 'Storm Damage',
      basePrice: '$99',
      premiumPrice: '$149',
      locations: 'All Texas'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-[#286BBD]/10 text-[#286BBD]';
      case 'assigned':
        return 'bg-[#122E5F]/10 text-[#122E5F]';
      case 'in progress':
        return 'bg-[#286BBD]/20 text-[#122E5F]';
      case 'closed':
        return 'bg-gray-100 text-gray-600';
      case 'active':
        return 'bg-[#286BBD]/10 text-[#286BBD]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-[#286BBD] font-medium">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
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
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 text-[#122E5F] mr-2" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{lead.homeowner}</p>
                    <p className="text-sm text-gray-600">{lead.location} • {lead.claimAmount}</p>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
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
                <div key={contractor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{contractor.name}</p>
                    <p className="text-sm text-gray-600">{contractor.conversionRate} conversion • {contractor.totalEarnings}</p>
                  </div>
                  <Badge className="bg-[#286BBD]/10 text-[#286BBD]">
                    {contractor.leadsCompleted} closed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLeadsManagement = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
          <p className="text-gray-600">Manage and assign leads to contractors</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#122E5F] hover:bg-[#0f2347] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          <Button variant="outline" className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="border-[#286BBD] text-[#286BBD]">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.homeowner}</div>
                        <div className="text-sm text-gray-500">{lead.id} • {lead.damageType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{lead.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{lead.claimAmount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{lead.assignedTo || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-[#286BBD] text-[#286BBD]">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-[#122E5F] text-[#122E5F]">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContractorsManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contractors Management</h2>
          <p className="text-gray-600">Monitor contractor performance and manage accounts</p>
        </div>
        <Button className="bg-[#122E5F] hover:bg-[#0f2347] text-white">
          <UserCheck className="h-4 w-4 mr-2" />
          Approve Contractor
        </Button>
      </div>

      {/* Contractors Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {contractors.map((contractor) => (
          <Card key={contractor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{contractor.name}</h3>
                  <p className="text-sm text-gray-600">{contractor.company}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {contractor.location}
                  </p>
                </div>
                <Badge className={getStatusColor(contractor.status)}>
                  {contractor.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leads Assigned</span>
                  <span className="text-sm font-medium text-gray-900">{contractor.leadsAssigned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium text-gray-900">{contractor.leadsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium text-[#286BBD]">{contractor.conversionRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="text-sm font-bold text-[#122E5F]">{contractor.totalEarnings}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 border-[#286BBD] text-[#286BBD]">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-[#122E5F] text-[#122E5F]">
                  <Target className="h-4 w-4 mr-1" />
                  Assign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPricingSettings = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Pricing Settings</h2>
          <p className="text-gray-600">Configure pricing for different lead categories and locations</p>
        </div>
        <Button className="bg-[#122E5F] hover:bg-[#0f2347] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Rule
        </Button>
      </div>

      {/* Pricing Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadPricing.map((pricing, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{pricing.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#122E5F]">{pricing.basePrice}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#286BBD]">{pricing.premiumPrice}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{pricing.locations}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-[#122E5F] text-[#122E5F]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-300 text-gray-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">General configurations and system settings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 text-[#122E5F] mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">New Lead Notifications</span>
              <div className="w-11 h-6 bg-[#122E5F] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Contractor Signup Alerts</span>
              <div className="w-11 h-6 bg-[#122E5F] rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Payment Notifications</span>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 text-[#122E5F] mr-2" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Contractors per Lead
              </label>
              <Input type="number" defaultValue="3" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lead Expiry (days)
              </label>
              <Input type="number" defaultValue="30" className="w-full" />
            </div>
            <Button className="w-full bg-[#122E5F] hover:bg-[#0f2347] text-white">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: FileText },
    { id: 'contractors', label: 'Contractors', icon: Users },
    { id: 'pricing', label: 'Lead Price Setting', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#122E5F]">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto mt-8 px-4 pb-8">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-[#122E5F] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#122E5F]'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage leads, contractors, and system settings</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-[#286BBD] text-[#286BBD]">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && renderDashboardOverview()}
            {activeTab === 'leads' && renderLeadsManagement()}
            {activeTab === 'contractors' && renderContractorsManagement()}
            {activeTab === 'pricing' && renderPricingSettings()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
}