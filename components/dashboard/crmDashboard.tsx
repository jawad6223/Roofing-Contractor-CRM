"use client";

import React, { useState } from "react";
import {
  Home, Users, Settings, BarChart3, Menu, X, User, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { DashBoard, CRM, Leads, Setting, Team } from "./menuTabs/index";

const CrmDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { user, getCurrentUserFullName, logout } = useAuth();
  const currentUserFullName = getCurrentUserFullName();

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const menuItems = [
    { icon: Home, label: "Dashboard" },
    { icon: BarChart3, label: "CRM" },
    { icon: Users, label: "Leads" },
    { icon: Settings, label: "Settings" },
    { icon: UserPlus, label: "Teams" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 lg:flex lg:flex-col lg:h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.label
                    ? "bg-blue-50 text-[#286BBD] border-r-2 border-[#286BBD]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-2">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate capitalize">
                  {currentUserFullName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user}</p>
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
      <div className="flex-1 lg:ml-0 flex flex-col h-full overflow-hidden">
        {/* Top header */}
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-1 flex-shrink-0">
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
                    Contractor Dashboard
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "Dashboard" && (
            <DashBoard onTabChange={handleTabChange} />
          )}

          {activeTab === "CRM" && <CRM />}

          {activeTab === "Leads" && <Leads />}

          {activeTab === "Settings" && <Setting />}

          {activeTab === "Teams" && <Team />}
        </main>
      </div>
    </div>
  );
};

export default CrmDashboard;