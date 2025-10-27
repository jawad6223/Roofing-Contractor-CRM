"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/types/Types";
import { Pagination } from "@/components/ui/pagination";
import { Search, Target, Plus, Download, Eye, ChevronDown, X, UserPlus, Check, FileText, MoreHorizontal, MapPin, Phone, Mail, User, Building, Hash, } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormPopup } from "@/components/ui/FormPopup";
import { supabase } from "@/lib/supabase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { fetchContractors, fetchLeads } from "./Data";
import { LeadType, ContractorType } from "@/types/AdminTypes";
import { toast } from "react-toastify";
import { exportToExcel } from "./exportExcel";
import { newLeadSchema } from "@/validations/admin/schema";
import { addLeadFields } from "./formFeilds";
import { calculateDistance } from "@/lib/distanceFormula";

export const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("open");
  const [selectedLead, setSelectedLead] = useState<LeadType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [leadToAssign, setLeadToAssign] = useState<LeadType | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<string>("");
  const [contractorSearchTerm, setContractorSearchTerm] = useState("");
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [contractors, setContractors] = useState<ContractorType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedContractor, setAssignedContractor] = useState<any>(null);
  const [loadingAssignedContractor, setLoadingAssignedContractor] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (lead["Property Address"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["First Name"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Last Name"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Phone Number"] || "").includes(searchTerm) ||
      (lead["Email Address"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Insurance Company"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Policy Number"] || "").includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" ||
      lead["Status"].toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const openLeads = filteredLeads.filter((lead) => {
    return (
      lead["Status"].toLowerCase() === "open" ||
      lead["Status"].toLowerCase() === "cancel"
    );
  });

  const closeLeads = filteredLeads.filter((lead) => {
    return lead["Status"].toLowerCase() === "close";
  });

  const currentTabData = activeTab === "open" ? openLeads : closeLeads;

  const totalPages = Math.ceil(currentTabData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = currentTabData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const fetchContractorsData = async () => {
      const contractorsData = await fetchContractors();
      if (contractorsData) {
        setContractors(contractorsData);
      }
    };
    fetchContractorsData();
  }, []);

  const fetchLeadsData = async () => {
    setLoadingLeads(true);
    const leadsData = await fetchLeads();
    if (leadsData) {
      setLeads(leadsData);
    }
    setLoadingLeads(false);
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const fetchAssignedContractor = async (leadEmail: string) => {
    setLoadingAssignedContractor(true);
    try {
      console.log("Fetching contractor for lead email:", leadEmail);

      const { data: contractorLead, error: contractorLeadError } =
        await supabase
          .from("Contractor_Leads")
          .select("contractor_id")
          .eq("Email Address", leadEmail)
          .single();

      if (contractorLeadError && contractorLeadError.code !== "PGRST116") {
        throw contractorLeadError;
      }

      if (!contractorLead) {
        setAssignedContractor(null);
        return;
      }

      const { data: contractorData, error: contractorError } = await supabase
        .from("Roofing_Auth")
        .select(
          `"Full Name", "Phone Number", "Email Address", "Business Address", "Service Radius"`
        )
        .eq("user_id", contractorLead.contractor_id)
        .single();

      if (contractorError && contractorError.code !== "PGRST116") {
        throw contractorError;
      }

      setAssignedContractor(contractorData || null);
    } catch (err) {
      console.error("Error fetching assigned contractor:", err);
      setAssignedContractor(null);
    } finally {
      setLoadingAssignedContractor(false);
    }
  };

  const handleViewLead = (lead: LeadType): void => {
    setSelectedLead(lead);
    setShowModal(true);
    if (lead["Email Address"]) {
      fetchAssignedContractor(lead["Email Address"]);
    }
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setShowModal(false);
    setAssignedContractor(null);
  };

  const handleAddLead = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAssignLead = (lead: LeadType) => {
    setLeadToAssign(lead);
    setShowAssignModal(true);
    setSelectedContractor("");
    setContractorSearchTerm("");
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setLeadToAssign(null);
    setSelectedContractor("");
    setContractorSearchTerm("");
  };

  const handleContractorSelect = (contractorId: string) => {
    setSelectedContractor(contractorId);
  };

  const handleSelectContractor = async () => {
    if (!selectedContractor || !leadToAssign) {
      toast.error("Please select a contractor");
      return;
    }

    try {
      const { error } = await supabase.from("Contractor_Leads").insert([
        {
          contractor_id: selectedContractor,
          "First Name": leadToAssign["First Name"],
          "Last Name": leadToAssign["Last Name"],
          "Phone Number": leadToAssign["Phone Number"],
          "Email Address": leadToAssign["Email Address"],
          "Property Address": leadToAssign["Property Address"],
          "Insurance Company": leadToAssign["Insurance Company"],
          "Policy Number": leadToAssign["Policy Number"],
        },
      ]);

      if (error) throw error;

      const { error: updateError } = await supabase
        .from("Leads_Data")
        .update({ Status: "close" })
        .eq("id", leadToAssign["id"]);

      if (updateError) throw updateError;

      toast.success("Lead assigned successfully");
      fetchLeadsData();
      handleCloseAssignModal();
    } catch (err: any) {
      console.error("Error assigning lead:", err);
      if (err.code === "23505") {
        toast.error("This lead is already assigned to a contractor");
      } else {
        toast.error("Failed to assign lead");
      }
    }
  };

  const handleCancelLead = async (leadId: string) => {
    try {
      console.log(`Cancelling lead ${leadId}`);

      const { error } = await supabase
        .from("Leads_Data")
        .update({ Status: "cancel" })
        .eq("id", leadId);

      if (error) throw error;

      toast.success("Lead status updated to cancel");
      fetchLeadsData();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong while updating lead status");
    }
  };

  const getStatusBadgeColor = (leadId: string) => {
    const status = leadId.toLowerCase();
    if (status === "open") {
      return "bg-green-100 text-green-800 hover:bg-green-200";
    } else {
      return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  const handleContractorSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractorSearchTerm(e.target.value);
  };

  const filteredContractors = contractors.filter(
    (contractor) =>
      contractor.fullName
        .toLowerCase()
        .includes(contractorSearchTerm.toLowerCase()) ||
      contractor.phoneno
        .toLowerCase()
        .includes(contractorSearchTerm.toLowerCase()) ||
      contractor.businessAddress
        .toLowerCase()
        .includes(contractorSearchTerm.toLowerCase())
  );

  const getDistanceBadge = (contractor: ContractorType, lead: LeadType) => {
    if (!contractor || !lead) {
      return { text: "Loading...", color: "bg-gray-100 text-gray-800" };
    }

    if (!lead["Latitude"] || !lead["Longitude"] || !contractor.latitude || !contractor.longitude) {
      return { text: "No Coordinates", color: "bg-gray-100 text-gray-800" };
    }

    const serviceRadius = contractor.serviceRadius || "50 miles";
    const radiusValue = parseFloat(serviceRadius.replace(/\D/g, '')) || 50;
    
    const distance = calculateDistance(
      contractor.latitude,
      contractor.longitude,
      lead["Latitude"],
      lead["Longitude"]
    );
    
    if (distance <= radiusValue) {
      const distancePercentage = (distance / radiusValue) * 100;
      
      if (distancePercentage <= 20) {
        return { text: "Nearest", color: "bg-green-100 text-green-800" };
      } else if (distancePercentage <= 60) {
        return { text: "Near", color: "bg-yellow-100 text-yellow-800" };
      } else {
        return { text: "Within Range", color: "bg-blue-100 text-blue-800" };
      }
    } else {
      return { text: "Out of Range", color: "bg-red-100 text-red-800" };
    }
  };

  

  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      // 1️⃣ Insert data into Leads_Data table
      const { error } = await supabase.from("Leads_Data").insert([
        {
          "Property Address": formData.propertyAddress,
          "First Name": formData.firstName,
          "Last Name": formData.lastName,
          "Phone Number": formData.phoneno,
          "Email Address": formData.email,
          "Insurance Company": formData.company,
          "Policy Number": formData.policy,
          Status: "open",
          "Latitude": formData.latitude,
          "Longitude": formData.longitude,
        },
      ]);

      if (error) throw error;

      toast.success("Lead added successfully!");
      fetchLeadsData();
      handleCloseAddModal();
    } catch (err: any) {
      console.error("Error submitting lead:", err);
      toast.error("Failed to submit lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4">
        <div className="text-center md:text-start">
          <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
          <p className="text-gray-600">
            Manage and assign leads to contractors
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleAddLead}
            className="bg-[#122E5F] hover:bg-[#0f2347] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          <Button
            variant="outline"
            className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
            onClick={() => exportToExcel(filteredLeads)}
          >
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
            <div className="relative">
              <select
                aria-label="Select status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-[#122E5F] lg:w-auto w-full text-[#122E5F] px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[#122E5F] focus:border-transparent min-w-[140px]"
              >
                <option value="All">All Status</option>
                <option value="open">Open</option>
                <option value="cancel">Cancel</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#286BBD] h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table with Tabs */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            {/* <div className="border-b border-gray-200"> */}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="open"
                  className="text-sm font-medium"
                >
                  Open Leads ({openLeads.length})
                </TabsTrigger>
                <TabsTrigger
                  value="close"
                  className="text-sm font-medium"
                >
                  Close Leads ({closeLeads.length})
                </TabsTrigger>
              </TabsList>

            <TabsContent value="open" className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contect Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loadingLeads ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                            <p className="mt-2 text-sm text-gray-500">
                              Loading leads...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : currentData.length > 0 ? (
                      currentData.map((lead: LeadType, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#122E5F]">
                              {lead["First Name"]} {lead["Last Name"]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-medium text-gray-600">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {lead["Phone Number"]}
                            </div>
                            <div className="flex items-center text-sm font-medium text-gray-600">
                              <Mail className="h-3 w-3 mr-1 text-gray-400" />
                              {lead["Email Address"]}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center w-52 text-sm font-medium text-gray-600">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="truncate">{lead["Property Address"]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Badge
                              className={getStatusBadgeColor(lead["Status"])}
                            >
                              {lead["Status"]}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewLead(lead)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={lead["Status"] === "cancel"}
                                  onClick={() =>
                                    handleCancelLead(lead.id.toString())
                                  }
                                  className="cursor-pointer text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={lead["Status"] === "cancel"}
                              className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={() => handleAssignLead(lead)}
                            >
                              <Target className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="h-12 w-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                No leads found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchTerm || statusFilter !== "All"
                                  ? `No results for current filters`
                                  : "Try adjusting your search terms"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="close" className="m-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contect Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.length > 0 ? (
                      currentData.map((lead: LeadType, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#122E5F]">
                              {lead["First Name"]} {lead["Last Name"]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Phone Number"]}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Email Address"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center w-52">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {lead["Property Address"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowra text-sm font-medium">
                            <Badge
                              className={getStatusBadgeColor(lead["Status"])}
                            >
                              {lead["Status"]}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={() => handleViewLead(lead)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="h-12 w-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                No closed leads found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchTerm || statusFilter !== "All"
                                  ? `No results for current filters`
                                  : "No closed leads available"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={currentTabData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {showModal && selectedLead && (
        <div className="fixed inset-0 -top-5 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white  shadow-2xl w-full relative animate-in zoom-in-95 duration-300 h-full overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-[#122E5F]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Lead Details
                </h2>
                <p className="text-sm text-gray-600">
                  Complete information for this lead
                </p>
              </div>

              {/* Contractor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["First Name"]}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["Last Name"]}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["Phone Number"]}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 break-all rounded-md text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["Email Address"]}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Property Address
                  </label>
                  <p className="text-gray-900 break-all bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["Property Address"]}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Insurance Company
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <Building className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["Insurance Company"]}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Policy Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <Hash className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead["Policy Number"]}
                  </p>
                </div>
              </div>

              {/* Assigned Contractor Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#286BBD]" />
                  Assigned Contractor
                </h3>
                <div className="overflow-auto max-h-64">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone no
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Business Address
                        </th>
                      </tr>
                    </thead>
                    {loadingAssignedContractor ? (
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                              <p className="mt-2 text-sm text-gray-500">
                                Loading assigned contractor...
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ) : assignedContractor ? (
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {assignedContractor["Full Name"]}
                          </td>
                          <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {assignedContractor["Email Address"]}
                          </td>
                          <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {assignedContractor["Phone Number"]}
                          </td>
                          <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {assignedContractor["Business Address"]}
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            No assigned contractor found
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Lead Modal */}
      <FormPopup
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        title="Add New Lead"
        subtitle="Enter lead information to add to the system"
        titleIcon={FileText}
        submitButtonText={isSubmitting ? "Submitting..." : "Add Lead"}
        submitButtonIcon={Plus}
        onSubmit={handleFormSubmit}
        validationSchema={newLeadSchema}
        fields={addLeadFields as FormField[]}
      />

      {/* Assign Lead Modal */}
      {showAssignModal && leadToAssign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl h-[80vh] md:h-auto w-full mx-4 relative animate-in zoom-in-95 duration-300 overflow-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseAssignModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-[#122E5F]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Assign Lead to Contractor
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select contractors to assign lead:{" "}
                    <span className="font-semibold text-[#286BBD]">
                      {leadToAssign["First Name"]} {leadToAssign["Last Name"]}
                    </span>
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search contractors..."
                    value={contractorSearchTerm}
                    onChange={handleContractorSearchChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contractors List */}
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {filteredContractors.length > 0 ? (
                    filteredContractors.map((contractor) => (
                      <div
                        key={contractor.user_id}
                        className="flex flex-col md:flex-row justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-[#286BBD]/50"
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedContractor === contractor.user_id}
                            onCheckedChange={() =>
                              handleContractorSelect(contractor.user_id)
                            }
                            className="data-[state=checked]:bg-[#286BBD] data-[state=checked]:border-[#286BBD]"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                              <UserPlus className="h-5 w-5 text-[#286BBD]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {contractor.fullName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {contractor.phoneno}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDistanceBadge(contractor, leadToAssign).color}`}>
                                  {getDistanceBadge(contractor, leadToAssign).text}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <div className="flex justify-between space-x-4 mt-4 md:mt-0">
                            <div className="text-start md:text-end">
                              <p className="text-sm font-medium text-[#286BBD]">
                                {contractor.businessAddress}
                              </p>
                              <p className="text-xs text-gray-500">Location</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">
                                {contractor.serviceRadius}
                              </p>
                              <p className="text-xs text-gray-500">
                                Service Radius
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No contractors found
                      </h3>
                      <p className="text-sm text-gray-500">
                        {contractorSearchTerm
                          ? `No contractors match "${contractorSearchTerm}"`
                          : "No contractors available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseAssignModal}
                  className="px-4 py-2 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSelectContractor}
                  disabled={!selectedContractor}
                  className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Select Contractor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
