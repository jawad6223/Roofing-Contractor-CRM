"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Users, FileText, DollarSign, Bell, Settings, BarChart3, Menu, X, LogOut, User, } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dashboard, Leads, Contractors, LeadPrice, Setting } from "./menuTabs/Index";
import Image from "next/image";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout()
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "[]");
  const currentUserInfo = userInfo.find(
    (info: { emailAddress: string; fullName: string }) =>
      info.emailAddress === user
  );
  const currentUserFullName = currentUserInfo?.fullName || user;
  console.log("currentUserFullName", currentUserFullName);

  const renderDashboardOverview = () => (
    <Dashboard onTabChange={setActiveTab} />
  );

  const renderLeadsManagement = () => (
    <Leads />
  );

  const renderContractorsManagement = () => (
    <Contractors onTabChange={setActiveTab} />
  );

  const renderPricingSettings = () => (
    <LeadPrice />
  );

  const renderSettings = () => (
    <Setting />
  );

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "leads", label: "Leads", icon: FileText },
    { id: "contractors", label: "Contractors", icon: Users },
    { id: "pricing", label: "Lead Pricing Hub", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
  ];

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
          <Image src="/roofing-logo.png" alt="logo" width={160} height={160} className="object-contain cursor-pointer mt-2" />
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
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
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
                </button>
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
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@roofingcrm.com
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
                  <p className="text-sm text-gray-600">
                    Manage leads, contractors, and system settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "dashboard" && renderDashboardOverview()}
            {activeTab === "leads" && renderLeadsManagement()}
            {activeTab === "contractors" && renderContractorsManagement()}
            {activeTab === "pricing" && renderPricingSettings()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
}