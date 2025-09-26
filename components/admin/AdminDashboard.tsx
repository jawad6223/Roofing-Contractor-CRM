"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requestLeads } from "./menuTabs/Data";
import { requestLeadType, sidebarItemsType } from "@/types/AdminTypes";
import { sidebarItems } from "./menuTabs/Data";
import {
  Users,
  Menu,
  X,
  LogOut,
  User,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminDashboardProps } from "@/types/AdminTypes";

export default function AdminDashboard({ children }: AdminDashboardProps) {
  const { logoutAdmin, admin, getCurrentAdminName, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLeadsRequestModal, setShowLeadsRequestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const handleLogout = () => {
    logoutAdmin();
  };

  const filteredLeads = requestLeads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.phoneno.includes(searchTerm) ||
      lead.zipCode.includes(searchTerm) ||
      lead.status.toLowerCase().includes(searchLower)
    );
  });

  const getActiveTab = () => {
    const pathSegments = pathname.split("/");
    const section = pathSegments[pathSegments.length - 1];

    if (pathname === "/admin" || section === "admin") {
      return "dashboard";
    }

    return section || "dashboard";
  };

  const activeTab = getActiveTab();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-full`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <Image
            src="/roofing-logo.png"
            alt="logo"
            width={160}
            height={160}
            className="object-contain cursor-pointer mt-2"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-2">
              {sidebarItems.map((item: sidebarItemsType) => (
                <Link
                  key={item.id}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === item.id
                      ? "bg-[#122E5F] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#122E5F]"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      activeTab === item.id ? "text-white" : "text-gray-500"
                    }`}
                  />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-2">
              <div className="w-8 h-8 bg-[#122E5F] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {loading ? 'Loading...' : getCurrentAdminName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {loading ? 'Loading...' : admin}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[#122E5F] border-[#122E5F] hover:bg-[#122E5F] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-full overflow-hidden">
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
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
              <Button
                onClick={() => setShowLeadsRequestModal(true)}
                className="bg-[#122E5F] hover:bg-[#0f2347] text-white"
              >
                <span>Leads Request</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
      {/* Leads Request Modal */}
      {showLeadsRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setShowLeadsRequestModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 z-50 border border-gray-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#122E5F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-[#122E5F]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Requested Leads
                </h2>
                <p className="text-sm text-gray-600">
                  Browse and manage lead requests
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search Leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#122E5F] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="assign" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="assign" className="text-sm font-medium">
                    Assign (
                    {
                      filteredLeads.filter((lead) => lead.status === "Assign")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-sm font-medium">
                    Pending (
                    {
                      filteredLeads.filter((lead) => lead.status === "Pending")
                        .length
                    }
                    )
                  </TabsTrigger>
                </TabsList>

                {/* Assign Tab */}
                <TabsContent value="assign">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="overflow-auto max-h-64">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Zip Code
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No. of Leads
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Send Leads
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLeads
                              .filter((lead) => lead.status === "Assign")
                              .map((lead: requestLeadType) => (
                                <tr key={lead.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                      <div className="text-sm font-bold text-[#122E5F]">
                                        {lead.firstName} {lead.lastName}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="text-sm font-medium text-gray-900">
                                        {lead.zipCode}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-black">
                                    <div className="flex items-center">
                                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                      {lead.phoneno}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      {lead.noOfLeads}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      {lead.receivedLeads}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-green-500">
                                      {lead.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Pending Tab */}
                <TabsContent value="pending">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="overflow-auto max-h-64">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Zip Code
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No. of Leads
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pending Leads
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLeads
                              .filter((lead) => lead.status === "Pending")
                              .map((lead: requestLeadType) => (
                                <tr key={lead.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                      <div className="text-sm font-bold text-[#122E5F]">
                                        {lead.firstName} {lead.lastName}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                      <span className="text-sm font-medium text-gray-900">
                                        {lead.zipCode}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-black">
                                    <div className="flex items-center">
                                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                      {lead.phoneno}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      {lead.noOfLeads}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      {lead.pendingLeads}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-yellow-500">
                                      {lead.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Close Button */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowLeadsRequestModal(false)}
                  className="px-6 py-2 bg-[#122E5F] hover:bg-[#0f2347] text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
