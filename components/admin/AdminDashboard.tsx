"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { requestLeads } from "./menuTabs/Data";
import { sidebarItemsType } from "@/types/AdminTypes";
import { sidebarItems } from "./menuTabs/Data";
import {
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminDashboardProps } from "@/types/AdminTypes";

export default function AdminDashboard({ children }: AdminDashboardProps) {
  const { logoutAdmin, admin, getCurrentAdminName, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logoutAdmin();
  };

  const getActiveTab = () => {
    const pathSegments = pathname.split("/");
    const section = pathSegments[pathSegments.length - 1];

    if (pathname === "/admin" || section === "admin") {
      return "dashboard";
    }

    return section || "dashboard";
  };

  const activeTab = getActiveTab();
  console.log("activeTab", activeTab);

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
            aria-label="Close sidebar"
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
                  {loading ? "Loading..." : getCurrentAdminName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {loading ? "Loading..." : admin}
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-[#122E5F] border-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#286BBD]">
                    Confirm Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout? You will need to sign in
                    again to access your admin account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-[#286BBD]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Yes, Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex justify-start px-4 items-center gap-4 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
