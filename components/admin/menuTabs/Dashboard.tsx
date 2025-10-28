"use client";

import React, { useState, useEffect } from "react";
import { Activity, Phone, Mail, MapPin, User, ExternalLink, DollarSign, Hash, Search, Calendar, Building, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailPopup } from "@/components/ui/DetailPopup";
import { fetchRequestLeads, fetchLeads} from "./Data";
import Link from "next/link";
import { LeadType, requestLeadType, ContractorType } from "@/types/AdminTypes";
import { fetchContractors } from "./Data";
import { supabase } from "@/lib/supabase";
import LoadingDots from "@/lib/LoadingDots";

export const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<LeadType>();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [selectedRequestLead, setSelectedRequestLead] = useState<requestLeadType>();
  const [isRequestLeadModalOpen, setIsRequestLeadModalOpen] = useState<boolean>(false);
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [contractors, setContractors] = useState<ContractorType[]>([]);
  const [requestLeads, setRequestLeads] = useState<requestLeadType[]>([]);
  const handleLeadClick = (lead: LeadType) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleRequestLeadClick = (reqLead: requestLeadType) => {
    console.log("reqLead", reqLead);
    setSelectedRequestLead(reqLead);
    setIsRequestLeadModalOpen(true);
  };

  const handleCloseLeadModal = () => {
    setIsLeadModalOpen(false);
    setSelectedLead(undefined);
  };

  const handleCloseRequestLeadModal = () => {
    setIsRequestLeadModalOpen(false);
    setSelectedRequestLead(undefined);
  };

  useEffect(() => {
    const fetchRequestLeadsData = async () => {
      const requestLeadsData = await fetchRequestLeads();
      if (requestLeadsData) {
        setRequestLeads(requestLeadsData);
      }
    };

    fetchRequestLeadsData();
  }, []);

  useEffect(() => {
    const fetchLeadsData = async () => {
      setLoadingLeads(true);
      const leadsData = await fetchLeads();
      if (leadsData) {
        setLeads(leadsData);
      }
      setLoadingLeads(false);
    };
    fetchLeadsData();
  }, []);

  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    const fetchTotalSales = async () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const startOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      const endOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`;
      
      const { data, error } = await supabase
        .from("Leads_Request")
        .select("Price, \"No. of Leads\"")
        .gte("Purchase Date", startOfMonth)
        .lte("Purchase Date", endOfMonth);
      
      if (error) {
        console.error("Error fetching sales data:", error);
        return;
      }
      
      if (data) {
        const totalSalesAmount = data.reduce((sum, item) => {
          const price = item.Price || 0;
          const numberOfLeads = item["No. of Leads"] || 0;
          return sum + (price * numberOfLeads);
        }, 0);
        
        setTotalSales(totalSalesAmount);
      }
    };
    
    fetchTotalSales();
  }, []);

  useEffect(() => {
    const fetchContractorsData = async () => {
      const contractorsData = await fetchContractors();
      if (contractorsData) {
        setContractors(contractorsData);
      }
    };
    fetchContractorsData();
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
        {
          label: "Purchase Date",
          value: new Date(selectedLead["Purchase Date"]).toLocaleDateString(),
          icon: Calendar,
        },
      ]
    : [];

  const requestLeadFields = selectedRequestLead
    ? [
        {
          label: "Name",
          value: `${selectedRequestLead["Name"]}`,
          icon: User,
        },
        {
          label: "Phone",
          value: selectedRequestLead["Phone Number"],
          icon: Phone,
        },
        {
          label: "Business Address",
          value: selectedRequestLead["Business Address"],
          icon: MapPin,
        },
        {
          label: "Price",
          value: selectedRequestLead["Price"],
          icon: DollarSign,
        },
        {
          label: "Purchase Date",
          value: selectedRequestLead["Purchase Date"],
          icon: Calendar,
        },
        {
          label: "No. of Leads",
          value: selectedRequestLead["No. of Leads"],
        },
        {
          label: "Pending Leads",
          value: selectedRequestLead["Pending Leads"],
        },
        {
          label: "Status",
          value: selectedRequestLead["Status"],
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <div className="text-2xl font-bold text-gray-900">{leads.length ? leads.length : <LoadingDots />}</div>
              </div>
              <div
                className={`w-12 h-12 bg-[#122E5F] rounded-xl flex items-center justify-center`}
              >
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contractors</p>
                <div className="text-2xl font-bold text-gray-900">{contractors.length ? contractors.length : <LoadingDots />}</div>
              </div>
              <div
                className={`w-12 h-12 bg-[#122E5F] rounded-xl flex items-center justify-center`}
              >
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium underline text-gray-500">This Month</span>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <div className="text-2xl font-bold text-gray-900">{totalSales ? `$${totalSales}` : <LoadingDots />}</div>
              </div>
              <div
                className={`w-12 h-12 bg-[#122E5F] rounded-xl flex items-center justify-center`}
              >
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-[#122E5F] mr-2" />
                Recent Leads
              </CardTitle>
              <Link href="/admin/leads">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#286BBD] hover:text-[#1d4ed8] hover:bg-[#286BBD]/10 flex items-center space-x-1"
                >
                  <span className="text-sm">View All Leads</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingLeads ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading leads...
                    </p>
                  </div>
                </div>
              ) : leads.filter((lead) => lead.Status === "open").length > 0 ? (
                leads
                  .filter((lead) => lead.Status === "open")
                  .slice(0, 3)
                  .map((lead: LeadType, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleLeadClick(lead)}
                      className="flex flex-col lg:flex-row items-center justify-center md:justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="w-full md:w-auto">
                      <div className="text-sm flex items-center font-semibold text-gray-900 transition-colors">
                        <User className="h-4 w-4 mr-1" />
                        <h4 className="font-semibold text-gray-900 text-base">
                          {lead["First Name"]} {lead["Last Name"]}
                        </h4>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600 transition-colors">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{lead["Property Address"]}</span>
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
                    No open leads found
                  </h3>
                  <p className="text-sm text-gray-500">
                    There are currently no open leads in the system
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-[#122E5F] mr-2" />
                Request Leads
              </CardTitle>
              <Link href="/admin/leads-request">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#286BBD] hover:text-[#1d4ed8] hover:bg-[#286BBD]/10 flex items-center space-x-1"
                >
                  <span className="text-sm">View All Request Leads</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requestLeads
                .filter((reqLead) => reqLead["Status"] === "pending")
                .slice(0, 3)
                .map((reqLead: requestLeadType) => (
                  <div
                    key={reqLead["id"]}
                    onClick={() => handleRequestLeadClick(reqLead)}
                    className="flex flex-col lg:flex-row items-center justify-center md:justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="w-full md:w-auto">
                      <div className="text-sm flex items-center font-semibold text-gray-900 transition-colors">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          {reqLead["Name"]}
                        </span>
                      </div>
                      <div className="text-sm mt-1 flex items-center font-semibold md:w-96 text-gray-900 transition-colors">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="font-medium">{reqLead["Business Address"]}</span>
                      </div>
                    </div>
                    <div className="flex w-full md:w-auto flex-col mt-2 space-y-2">
                      <div className="text-sm text-[#286BBD] flex hover:text-[#1d4ed8] transition-colors">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="font-medium">{reqLead["Phone Number"]}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Details Modal */}
      <DetailPopup
        isOpen={isLeadModalOpen}
        onClose={handleCloseLeadModal}
        title="Lead Details"
        subtitle="Complete information for this lead"
        titleIcon={FileText}
        viewAllButton={{
          text: "View All Leads",
          href: "/admin/leads",
        }}
        fields={selectedLead ? leadFields : []}
      />

      {/* Request Lead Details Modal */}
      <DetailPopup
        isOpen={isRequestLeadModalOpen}
        onClose={handleCloseRequestLeadModal}
        title="Request Lead Details"
        subtitle="Complete information for this lead request"
        titleIcon={FileText}
        viewAllButton={{
          text: "View All Request Leads",
          href: "/admin/leads-request",
        }}
        fields={requestLeadFields}
      />
    </div>
  );
};
