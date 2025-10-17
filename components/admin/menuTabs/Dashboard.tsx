"use client";

import React, { useState, useEffect } from "react";
import { Activity, Phone, Mail, MapPin, User, ExternalLink, DollarSign, Hash, Calendar, Building, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailPopup } from "@/components/ui/DetailPopup";
import { dashboardCard, allLeads, requestLeads } from "./Data";
import Link from "next/link";
import {dashboardCardType, LeadType, requestLeadType } from "@/types/AdminTypes";
import { fetchLeads } from "./Data";

export const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<LeadType>();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [selectedRequestLead, setSelectedRequestLead] = useState<requestLeadType>();
  const [isRequestLeadModalOpen, setIsRequestLeadModalOpen] = useState<boolean>(false);
  const [leads, setLeads] = useState<LeadType[]>([]);
  const handleLeadClick = (lead: LeadType) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleRequestLeadClick = (reqLead: requestLeadType) => {
    console.log('reqLead', reqLead);
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
    const fetchLeadsData = async () => {
      const leadsData = await fetchLeads()
      if (leadsData) {
        setLeads(leadsData);
      }
    };
    fetchLeadsData();
  }, []);

   const leadFields = selectedLead ? [
    {
      label: "Full Name",
      value: `${selectedLead["First Name"]} ${selectedLead["Last Name"]}`,
      icon: User
    },
    {
      label: "Phone",
      value: selectedLead["Phone Number"],
      icon: Phone
    },
    {
      label: "Email",
      value: selectedLead["Email Address"],
      icon: Mail,
      breakAll: true
    },
    {
      label: "Zip Code",
      value: selectedLead["Property ZIP Code"],
      icon: MapPin
    },
    {
      label: "Insurance Company",
      value: selectedLead["Insurance Company"],
      icon: Building,
      whitespaceNowrap: true
    },
    {
      label: "Policy Number",
      value: selectedLead["Policy Number"],
      icon: Hash
    },
    {
      label: "Purchase Date",
      value: new Date(selectedLead["Purchase Date"]).toLocaleDateString(),
      icon: Calendar
    }
  ] : [];

  const requestLeadFields = selectedRequestLead ? [
    {
      label: "Full Name",
      value: `${selectedRequestLead.firstName} ${selectedRequestLead.lastName}`,
      icon: User
    },
    {
      label: "Phone",
      value: selectedRequestLead.phoneno,
      icon: Phone
    },
    {
      label: "Zip Code",
      value: selectedRequestLead.zipCode,
      icon: MapPin
    },
    {
      label: "Price",
      value: selectedRequestLead.price,
      icon: DollarSign
    },
    {
      label: "Date",
      value: selectedRequestLead.date,
      icon: Calendar
    },
    {
      label: "No of Leads",
      value: selectedRequestLead.noOfLeads
    },
    {
      label: "Pending Leads",
      value: selectedRequestLead.pendingLeads
    },
    {
      label: "Status",
      value: selectedRequestLead.status
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCard.map((stat: dashboardCardType, index) => (
          <Card
            key={index}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium underline text-gray-500">
                    {stat.time}
                  </span>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-[#122E5F] rounded-xl flex items-center justify-center`}
                >
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
              {leads.filter(lead => lead.Status === "open").slice(0, 3).map((lead: LeadType, index: number) => (
                <div
                  key={index}
                  onClick={() => handleLeadClick(lead)}
                  className="flex flex-col lg:flex-row items-center justify-between p-4 rounded-lg bg-white border border-gray-200 hover:border-[#286BBD]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#286BBD]/10 to-[#2563eb]/10 flex items-center justify-center group-hover:from-[#286BBD]/20 group-hover:to-[#2563eb]/20 transition-all duration-200">
                      <User className="h-6 w-6 text-[#286BBD]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {lead["First Name"]} {lead["Last Name"]}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{lead["Insurance Company"]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex flex-col items-end space-y-1">
                      <div className="text-sm text-[#286BBD] flex items-center hover:text-[#1d4ed8] transition-colors">
                        <Phone className="h-4 w-4 mr-1" />
                        <span className="font-medium">{lead["Phone Number"]}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center hover:text-gray-800 transition-colors">
                        <Mail className="h-4 w-4 mr-1" />
                        <span className="font-medium">{lead["Email Address"]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
            {requestLeads.filter(reqLead => reqLead.status === "Pending").slice(0, 3).map((reqLead: requestLeadType) => (
                <div
                  key={reqLead.id}
                  onClick={() => handleRequestLeadClick(reqLead)}
                  className="flex flex-col lg:flex-row items-center justify-center md:justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="w-full md:w-auto">
                    <div className="text-sm flex items-center font-semibold text-gray-900 transition-colors">
                      <User className="h-4 w-4 mr-1" />
                      <span className="font-medium">{reqLead.firstName} {reqLead.lastName}</span>
                    </div>
                    <div className="text-sm mt-1 flex items-center font-semibold text-gray-900 transition-colors">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="font-medium">
                        {reqLead.zipCode}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full md:w-auto flex-col mt-2 space-y-2">
                    <div className="text-sm text-[#286BBD] flex hover:text-[#1d4ed8] transition-colors">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-medium">{reqLead.phoneno}</span>
                    </div>
                    {/* <div className="text-sm mt-1 text-gray-600 flex hover:text-gray-800 transition-colors">
                      <Mail className="h-4 w-4 mr-1" />
                      <span className="font-medium">{reqLead.email}</span>
                    </div> */}
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
          href: "/admin/leads"
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
          href: "/admin/leads-request"
        }}
        fields={requestLeadFields}
      />
    </div>
  );
};
