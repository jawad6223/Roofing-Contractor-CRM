"use client";

import React, { useState } from "react";
import { Home, Settings, BarChart3, Menu, X, User, LogOut, UserPlus, ShoppingCart, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CrmDashboardProps } from "@/types/DashboardTypes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const CrmDashboard = ({ children }: CrmDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, getCurrentUserFullName, logout, loading } = useAuth();
  const currentUserFullName = getCurrentUserFullName();

  const getActiveTab = () => {
    const pathSegments = pathname.split("/");
    const section = pathSegments[pathSegments.length - 1];

    if (pathname === "/contractor" || section === "dashboard") {
      return "Dashboard";
    }

    switch (section) {
      case "dashboard":
        return "Dashboard";
      case "crm":
        return "CRM";
      case "leads":
        return "Leads";
      case "purchase-leads":
        return "Purchase Leads";
      case "lead-purchase-info":
        return "Lead Purchase Info";
      case "settings":
        return "Settings";
      case "teams":
        return "Teams";
      default:
        return "Dashboard";
    }
  };

  const activeTab = getActiveTab();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/contractor/dashboard" },
    { icon: BarChart3, label: "CRM", path: "/contractor/crm" },
    { icon: FileText, label: "Leads", path: "/contractor/leads" },
    { icon: ShoppingCart, label: "Purchase Leads", path: "/contractor/purchase-leads" },
    { icon: FileText, label: "Lead Purchase Info", path: "/contractor/lead-purchase-info" },
    { icon: Settings, label: "Settings", path: "/contractor/settings" },
    { icon: UserPlus, label: "Teams", path: "/contractor/teams" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
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
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.label
                    ? "bg-blue-50 text-[#286BBD] border-r-2 border-[#286BBD]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-2">
              <div className="w-8 h-8 bg-[#122E5F] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate capitalize">{currentUserFullName}</p>
                <p className="text-xs text-gray-500 truncate">{loading ? "Loading..." : user}</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#286BBD]">Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-[#286BBD]">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-[#122E5F] hover:bg-[#0f2347]/80" onClick={handleLogout}>Yes, Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-full overflow-hidden">
        {/* Top header */}
        <div className="bg-white shadow-sm border-b px-4 sm:px-6 flex-shrink-0">
            <div className="flex justify-start items-center gap-4 h-16">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Contractor Dashboard</h1>
            </div>
        </div>
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default CrmDashboard;
