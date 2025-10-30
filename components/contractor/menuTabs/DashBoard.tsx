"use client";
import { useEffect, useRef } from "react";
import { Home, FileText, DollarSign, BarChart3, Users, User, CheckCircle, Phone, Mail, MapPin, Hash, Building, Search, } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailPopup } from "@/components/ui/DetailPopup";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { purchasedLeadType, premiumLeadType } from "@/types/DashboardTypes";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { fetchContractorLeads, fetchMatchLeads } from "./Data";
import { fetchLeadPrice } from "@/lib/leadPrice";
import { freeLeadsAssign } from "@/lib/freeLeadsAssign";
import LoadingDots from "@/lib/LoadingDots";

export const DashBoard = () => {
  const { getCurrentUserFullName } = useAuth();
  const currentUserFullName = getCurrentUserFullName();
  const [loadingLeads, setLoadingLeads] = useState<Set<number>>(new Set());
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contractorLeads, setContractorLeads] = useState<any[]>([]);
  const [premiumLeads, setPremiumLeads] = useState<any[]>([]);
  const [pricePerLead, setPricePerLead] = useState<number>(0);
  const hasRun = useRef(false);
    const handleCloseModal = () => {
    setIsLeadModalOpen(false);
    setSelectedLead(null);
  };

  useEffect(() => {
    const fetchLeadPriceData = async () => {
      const leadPriceData = await fetchLeadPrice();
      if (leadPriceData) {
        setPricePerLead((leadPriceData)['Price Per Lead']);
      }
    };
    fetchLeadPriceData();
  }, []);

  const leadFields = selectedLead
    ? [
        {
          label: "Full Name",
          value: `${selectedLead["First Name"]} ${selectedLead["Last Name"]}`,
          icon: User,
        },
        {
          label: "Phone",
          value: selectedLead["Phone Number"],
          icon: Phone,
        },
        {
          label: "Email",
          value: selectedLead["Email Address"],
          icon: Mail,
          breakAll: true,
        },
        {
          label: "Property Address",
          value: selectedLead["Property Address"],
          icon: MapPin,
        },
        {
          label: "Insurance Company",
          value: selectedLead["Insurance Company"],
          icon: Building,
          whitespaceNowrap: true,
        },
        {
          label: "Policy Number",
          value: selectedLead["Policy Number"],
          icon: Hash,
        },
      ]
    : [];

  const fetchContractorLeadsData = async () => {
    setIsLoading(true);
    const contractorLeadsData = await fetchContractorLeads();
    if (contractorLeadsData) {
      setContractorLeads(contractorLeadsData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchContractorLeadsData();
  }, []);

  useEffect(() => {
    const fetchMatchLeadsData = async () => {
      setIsLoading(true);
      const matchingLeads = await fetchMatchLeads();
      if (matchingLeads) {
        setPremiumLeads(matchingLeads);
      }
    };
    fetchMatchLeadsData();
  }, []);

  async function handleBuyNow(lead: premiumLeadType) {
    setLoadingLeads((prev) => new Set(prev).add(lead.id));
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      const email = authData?.user?.email;
  
      if (!userId || !email) {
        toast.error("User not logged in");
        return;
      }
  
      const response = await fetch("/api/create-single-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadAmount: pricePerLead,
          leadName: `${lead["First Name"].slice(0, 2)}${"***"} ${lead["Last Name"].slice(0, 2)}${"***"}`,
          email,
          user_id: userId,
          lead_id: lead.id,
        }),
      });
  
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  }

  useEffect(() => {
    const verifyAndAssignLeads = async () => {
      if (hasRun.current) return;
      hasRun.current = true;
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) return;
      console.log("userId", userId);
  
      const { data: userRecord } = await supabase
        .from("Roofing_Auth")
        .select('"Is Verified"')
        .eq("user_id", userId)
        .single();
  
      if (userRecord?.["Is Verified"] === "confirmed") {
        console.log("userRecord", userRecord["Is Verified"]);
        console.log("✅ User is verified, auto assigning leads...");
        await freeLeadsAssign(userId);
        fetchContractorLeadsData();
      }
    };
    verifyAndAssignLeads();
  }, []);

  const handleLeadClick = (lead: any) => {
    console.log("lead==", lead);
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
            <CardTitle className="text-sm font-semibold text-[#286BBD]">
              Total Leads
            </CardTitle>
            <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#286BBD]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-[#286BBD] font-bold mb-1">
              {contractorLeads.length ? contractorLeads.length : (
                  <LoadingDots />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#286BBD]">
              Active Leads
            </CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-600 font-bold mb-1">
              {contractorLeads.length ? 
              contractorLeads.filter((lead) => lead.status !== "close").length : (
                <LoadingDots />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#286BBD]">
              Closed Leads
            </CardTitle>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-600 font-bold mb-1">
              {contractorLeads.length ?  contractorLeads.filter((lead) => lead.status === "close").length : (
                <LoadingDots />
              )}
            </div>
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
              <Link href="/contractor/leads">
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
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading leads...
                    </p>
                  </div>
                </div>
              ) : contractorLeads.filter((lead) => lead.status !== "close")
                  .length > 0 ? (
                contractorLeads
                  .filter((lead) => lead.status !== "close")
                  .slice(0, 3)
                  .map((lead: purchasedLeadType, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleLeadClick(lead)}
                      className="flex flex-col lg:flex-row items-center justify-center md:justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="w-full md:w-1/2">
                      <div className="text-sm flex items-center font-semibold text-gray-900 transition-colors">
                        <User className="h-4 w-4 mr-1" />
                        <h4 className="font-semibold text-gray-900 text-base">
                          {lead["First Name"]} {lead["Last Name"]}
                        </h4>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600 transition-colors">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="w-52 truncate">{lead["Property Address"]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full md:w-auto flex-col mt-2 space-y-2">
                      <div className="text-sm text-[#286BBD] flex md:justify-end hover:text-[#1d4ed8] transition-colors">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="font-medium">{lead["Phone Number"]}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center hover:text-gray-800 transition-colors">
                        <Mail className="h-4 w-4 mr-1" />
                        <span className="font-medium">{lead["Email Address"]}</span>
                      </div>
                    </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No leads found
                  </h3>
                  <p className="text-sm text-gray-500">
                    There are currently no leads in the system
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-[#286BBD]" />
              Available Premium Leads
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              High-quality leads ready for purchase
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading leads...
                  </p>
                </div>
              </div>
              ) : premiumLeads.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No premium leads available
                  </h3>
                  <p className="text-sm text-gray-500">
                    There are currently no leads within your service radius
                  </p>
                </div>
              ) : (
                premiumLeads.slice(0, 3).map((lead: premiumLeadType) => (
                <div
                  key={lead.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-sm font-bold text-gray-400 select-none">
                          {`${lead["First Name"].slice(0, 2)}${"***"} ${lead["Last Name"].slice(0, 2)}${"***"}`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="select-none">{`${lead["Property Address"].slice(0,2)}${"***"}`}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          <span className="select-none">{`${lead["Phone Number"].slice(0,2)}${"***"}`}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="select-none">{`${lead["Email Address"].slice(0,2)}${"***"}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end space-x-3 md:ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleBuyNow(lead)}
                        className={`text-white`}
                        disabled={loadingLeads.has(lead.id)}
                      >
                        {loadingLeads.has(lead.id)
                          ? "Processing..."
                          : "Buy Now"}
                      </Button>
                    </div>
                  </div>
                </div>
                ))
              )}
              <div className="text-center pt-2">
                <Link href="/contractor/leads">
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