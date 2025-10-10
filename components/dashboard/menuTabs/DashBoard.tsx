"use client";

import {
  Home,
  FileText,
  TrendingUp,
  DollarSign,
  BarChart3,
  Users,
  UserPlus,
  User,
  Settings,
  Package,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  X,
  Eye,
  Hash,
  Building,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailPopup } from "@/components/ui/DetailPopup";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { purchasedLeads, sampleLeads } from "./Data";
import { sampleLeadType } from "@/types/DashboardTypes";
import Link from "next/link";

export const DashBoard = () => {
  const { getCurrentUserFullName } = useAuth();
  const currentUserFullName = getCurrentUserFullName();
  const [loadingLeads, setLoadingLeads] = useState<Set<number>>(new Set());
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsLeadModalOpen(false);
    setSelectedLead(null);
  };

  const leadFields = selectedLead ? [
    {
      label: "Full Name",
      value: `${selectedLead.firstName} ${selectedLead.lastName}`,
      icon: User
    },
    {
      label: "Phone",
      value: selectedLead.phoneno,
      icon: Phone
    },
    {
      label: "Email",
      value: selectedLead.email,
      icon: Mail,
      breakAll: true
    },
    {
      label: "Location",
      value: selectedLead.location,
      icon: MapPin
    },
    {
      label: "Insurance Company",
      value: selectedLead.company,
      icon: Building,
      whitespaceNowrap: true
    },
    {
      label: "Policy Number",
      value: selectedLead.policy,
      icon: Hash
    },
    {
      label: "Purchase Date",
      value: new Date(selectedLead.purchaseDate).toLocaleDateString(),
      icon: Calendar
    },
    {
      label: "Zip Code",
      value: selectedLead.zipCode,
      icon: MapPin
    }
  ] : [];

  async function handleBuyNow(lead: sampleLeadType) {
    // Add this lead to loading set
    setLoadingLeads((prev) => new Set(prev).add(lead.id));

    try {
      const response = await fetch("/api/create-single-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // leadAmount: lead.price,
          leadAmount: 50,
          leadName: `${lead.firstName} ${lead.lastName}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout error:", errorData.error);
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      // Remove this lead from loading set
      setLoadingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  }

  const handleLeadClick = (lead: any) => {
    console.log("lead", lead);
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };
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
              <h1 className="text-3xl font-bold capitalize">Welcome back, {currentUserFullName}! 👋</h1>
              <p className="text-blue-100 text-lg">Your business performance at a glance</p>
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  className="flex flex-col lg:flex-row items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-[#286BBD]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#286BBD]/10 to-[#2563eb]/10 flex items-center justify-center group-hover:from-[#286BBD]/20 group-hover:to-[#2563eb]/20 transition-all duration-200">
                      <User className="h-6 w-6 text-[#286BBD]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {activity.firstName} {activity.lastName}
                        </h4>
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
                      <div className="text-sm text-gray-600 flex items-center break-all hover:text-gray-800 transition-colors">
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
              <FileText className="h-6 w-6 mr-2 text-[#286BBD]" />
              Available Premium Leads
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">High-quality leads ready for purchase</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleLeads.map((lead: sampleLeadType) => (
                <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-sm font-bold text-gray-400 select-none">
                          {`${lead.firstName.slice(0, 2)}${'*'.repeat(Math.max(lead.firstName.length - 2, 0))} ${lead.lastName.slice(0, 2)}${'*'.repeat(Math.max(lead.lastName.length - 2, 0))}`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                        <span className="select-none">{`${lead.zipCode.slice(0, 2)}${'*'.repeat(Math.max(lead.zipCode.length - 2, 0))}`}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="select-none">{`${lead.phone.slice(0, 2)}${'*'.repeat(Math.max(lead.phone.length - 2, 0))}`}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="select-none">{`${lead.email.slice(0, 2)}${'*'.repeat(Math.max(lead.email.length - 2, 0))}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end space-x-3 md:ml-4">
                      <div className="text-left md:text-right">
                        {/* <div className="text-lg font-bold text-[#286BBD]">${lead.price}</div>
                        <div className="text-xs text-gray-500">per lead</div> */}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(lead)}
                        className={`text-white`}
                        disabled={loadingLeads.has(lead.id)}
                      >
                        {loadingLeads.has(lead.id) ? "Processing..." : "Buy Now"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/dashboard/leads">
                  <Button
                    variant="outline"
                    className="text-[#122E5F] border-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                  >
                    View All Leads
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailPopup
        isOpen={isLeadModalOpen}
        onClose={handleCloseModal}
        title="Lead Details"
        subtitle="Complete information for this lead"
        titleIcon={FileText}
        fields={leadFields}
      />
    </>
  );
};
