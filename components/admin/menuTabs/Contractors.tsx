"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  MapPin,
  Eye,
  Target,
  X,
  Globe,
  Phone,
  Mail,
  Search,
  FileText,
  User,
  Building,
} from "lucide-react";
import { UserCheck } from "lucide-react";
import { ContractorType, LeadType } from "@/types/AdminTypes";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { fetchContractors, fetchLeads } from "./Data";
import { calculateDistance } from "@/lib/distanceFormula";

export const Contractors = () => {
  const [selectedContractor, setSelectedContractor] = useState<ContractorType>();
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractorSearchTerm, setContractorSearchTerm] = useState("");
  const [assignedLeadsSearchTerm, setAssignedLeadsSearchTerm] = useState("");
  const [contractors, setContractors] = useState<ContractorType[]>([]);
  const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
  const [existingAssignments, setExistingAssignments] = useState<string[]>([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [loadingAssignedLeads, setLoadingAssignedLeads] = useState(false);
  // Filter contractors based on search term
  const filteredContractors = contractors.filter(
    (contractor) =>
      contractor.fullName
        .toLowerCase()
        .includes(contractorSearchTerm.toLowerCase()) ||
      contractor?.phoneno
        ?.toLowerCase()
        .includes(contractorSearchTerm.toLowerCase()) ||
      contractor.businessAddress
        .toLowerCase()
        .includes(contractorSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchContractorsData = async () => {
      setLoadingContractors(true);
      const contractorsData = await fetchContractors();
      if (contractorsData) {
        setContractors(contractorsData);
      }
      setLoadingContractors(false);
    };
    fetchContractorsData();
  }, []);

  const fetchAssignedLeads = async (contractorId: string) => {
    setLoadingAssignedLeads(true);
    console.log("fetching assigned leads for contractor:", contractorId);
    try {
      const { data, error } = await supabase
        .from("Contractor_Leads")
        .select("*")
        .eq("contractor_id", contractorId);

      if (error) throw error;
      setAssignedLeads(data);
    } catch (err) {
      console.error("Error fetching assigned leads:", err);
      setAssignedLeads([]);
    } finally {
      setLoadingAssignedLeads(false);
    }
  };

  const fetchExistingAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("Contractor_Leads")
        .select('"Email Address"');

      if (error) throw error;
      const emails =
        data
          ?.map((item: any) => (item as any)["Email Address"])
          .filter(Boolean) || [];
      setExistingAssignments(emails);
    } catch (err) {
      console.error("Error fetching existing assignments:", err);
      setExistingAssignments([]);
    }
  };

  useEffect(() => {
    const fetchLeadsData = async () => {
      const leadsData = await fetchLeads();
      if (leadsData) {
        setLeads(leadsData);
      }
    };
    fetchLeadsData();
    fetchExistingAssignments();
  }, []);

  // Filter assigned leads based on search term
  const filteredAssignedLeads = assignedLeads.filter(
    (lead) =>
      (lead["First Name"]?.toLowerCase() || "").includes(
        assignedLeadsSearchTerm.toLowerCase()
      ) ||
      (lead["Last Name"]?.toLowerCase() || "").includes(
        assignedLeadsSearchTerm.toLowerCase()
      ) ||
      (lead["Zip Code"] || "").includes(assignedLeadsSearchTerm) ||
      (lead["Phone Number"] || "").includes(assignedLeadsSearchTerm) ||
      (lead["Email Address"]?.toLowerCase() || "").includes(
        assignedLeadsSearchTerm.toLowerCase()
      ) ||
      (lead["Insurance Company"]?.toLowerCase() || "").includes(
        assignedLeadsSearchTerm.toLowerCase()
      )
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [assignedLeadsCurrentPage, setAssignedLeadsCurrentPage] =
    useState<number>(1);
  const itemsPerPage = 10;
  const assignedLeadsItemsPerPage = 10; // Smaller page size for modal table
  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);
  const assignedLeadsTotalPages = Math.ceil(
    filteredAssignedLeads.length / assignedLeadsItemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredContractors.slice(startIndex, endIndex);

  const assignedLeadsStartIndex =
    (assignedLeadsCurrentPage - 1) * assignedLeadsItemsPerPage;
  const assignedLeadsEndIndex =
    assignedLeadsStartIndex + assignedLeadsItemsPerPage;
  const currentAssignedLeadsData = filteredAssignedLeads.slice(
    assignedLeadsStartIndex,
    assignedLeadsEndIndex
  );
  const [leads, setLeads] = useState<LeadType[]>([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAssignedLeadsPageChange = (page: number) => {
    setAssignedLeadsCurrentPage(page);
  };

  const handleAssignedLeadsPreviousPage = () => {
    setAssignedLeadsCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleAssignedLeadsNextPage = () => {
    setAssignedLeadsCurrentPage((prev) =>
      Math.min(prev + 1, assignedLeadsTotalPages)
    );
  };

  const handleViewContractor = (contractor: ContractorType): void => {
    setSelectedContractor(contractor);
    setAssignedLeadsCurrentPage(1); // Reset pagination when opening modal
    setShowModal(true);
    if (contractor.user_id) {
      fetchAssignedLeads(contractor.user_id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAssignedLeads([]);
  };

  // Reset assigned leads pagination when search term changes
  useEffect(() => {
    setAssignedLeadsCurrentPage(1);
  }, [assignedLeadsSearchTerm]);

  const handleAssignLeads = () => {
    handleCloseModal();
  };

  const handleAssignLead = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setShowAssignModal(true);
    setSelectedLeads([]);
    setSearchTerm("");
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedLeads([]);
    setSearchTerm("");
  };

  const handleLeadCheckbox = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleAssignToContractor = async () => {
    if (!selectedContractor || selectedLeads.length === 0) {
      toast.error("Please select a contractor and leads to assign");
      return;
    }

    try {
      const contractorId = selectedContractor.user_id;

      const leadDataToInsert = selectedLeads.map((leadId) => {
        const lead = leads.find((l) => l.id.toString() === leadId);
        if (!lead) throw new Error(`Lead with ID ${leadId} not found`);

        return {
          lead_id: lead.id,
          "First Name": lead["First Name"],
          "Last Name": lead["Last Name"],
          "Phone Number": lead["Phone Number"],
          "Email Address": lead["Email Address"],
          "Property Address": lead["Property Address"],
          "Insurance Company": lead["Insurance Company"],
          "Policy Number": lead["Policy Number"],
          contractor_id: contractorId,
        };
      });

      const { error: insertError } = await supabase
        .from("Contractor_Leads")
        .insert(leadDataToInsert);

      if (insertError) {
        if (insertError.code === "23505") {
          toast.error(
            "Some leads have already been assigned to contractors. Please select different leads."
          );
          return;
        }
        throw insertError;
      }

      const { error: updateError } = await supabase
        .from("Leads_Data")
        .update({
          Status: "close",
          // "Assigned To": selectedContractor.fullName
        })
        .in("id", selectedLeads);

      if (updateError) throw updateError;

      toast.success(
        `${selectedLeads.length} leads assigned successfully to ${selectedContractor.fullName}`
      );

      if (selectedContractor.user_id) {
        await fetchAssignedLeads(selectedContractor.user_id);
      }

      await fetchExistingAssignments();
      handleCloseAssignModal();
    } catch (error) {
      console.error("Error assigning leads:", error);
      toast.error("Failed to assign leads. Please try again.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleContractorSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractorSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getDistanceBadge = (lead: LeadType, contractor: ContractorType) => {
    if (!contractor) {
      return { text: "Loading...", color: "bg-gray-100 text-gray-800" };
    }

    if (
      !lead["Latitude"] ||
      !lead["Longitude"] ||
      !contractor.latitude ||
      !contractor.longitude
    ) {
      return { text: "No Coordinates", color: "bg-gray-100 text-gray-800" };
    }

    const serviceRadius = contractor.serviceRadius;
    const radiusValue = parseFloat(serviceRadius.replace(/\D/g, ""));

    const distance = calculateDistance(
      contractor.latitude,
      contractor.longitude,
      lead["Latitude"],
      lead["Longitude"]
    );

    const diff = distance - radiusValue;
    console.log('diff', diff);
    console.log('distance', distance);
    console.log('radiusValue', radiusValue);

    let badge = { text: "Too Far", color: "bg-red-100 text-red-800" };

    if (diff <= 5) badge = { text: "Nearest", color: "bg-green-100 text-green-800" };
    else if (diff <= 10) badge = { text: "Near", color: "bg-yellow-100 text-yellow-800" };
    else if (diff <= 20) badge = { text: "Far", color: "bg-blue-100 text-blue-800" };

    return {
      text: badge.text,
      color: badge.color,
      distance: distance.toFixed(1),
      radius: radiusValue.toFixed(1),
    };
  };

  const filteredLeads = leads.filter(
    (lead) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesBasic =
        lead["First Name"].toLowerCase().includes(searchLower) ||
        lead["Last Name"].toLowerCase().includes(searchLower) ||
        lead["Property Address"]
          .toLowerCase()
          .includes(searchLower) ||
        lead["Insurance Company"]
          .toLowerCase()
          .includes(searchLower) ||
        lead["Policy Number"]
          .toLowerCase()
          .includes(searchLower) ||
        lead["Phone Number"]
          .toLowerCase()
          .includes(searchLower);

      if (matchesBasic) {
        return !existingAssignments.includes(lead["Email Address"]);
      }

      if (selectedContractor) {
        const badge = getDistanceBadge(lead, selectedContractor);
        if (badge) {
          const badgeText = badge.text?.toLowerCase() || "";
          const badgeDistance = badge.distance?.toString() || "";
          const badgeRadius = badge.radius?.toString() || "";
          const badgeSearchable = `${badgeText} ${badgeDistance} ${badgeRadius}`.toLowerCase();
          
          if (badgeSearchable.includes(searchLower)) {
            return !existingAssignments.includes(lead["Email Address"]);
          }
        }
      }

      return false;
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-center md:justify-start gap-4">
        <div>
          <h2 className="text-2xl text-center md:text-start font-bold text-gray-900">
            Contractors Management
          </h2>
          <p className="text-gray-600 text-center md:text-start">
            Monitor contractor performance and manage accounts
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex">
        <div className="relative w-full">
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

      {/* Contractors Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contect Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingContractors ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                        <p className="mt-2 text-sm text-gray-500">
                          Loading contractors...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((contractor: ContractorType) => (
                    <tr key={contractor.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-[#122E5F] flex items-center">
                          <User className="h-3 w-3 mr-1 text-gray-600" />
                          {contractor.fullName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {contractor.phoneno}
                        </span>
                        <span className="text-sm font-medium text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {contractor.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div className="bg-red-500 w-10 break-all"> */}
                        <span className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="w-52 truncate">
                            {contractor.businessAddress}
                          </span>
                        </span>
                        {/* </div> */}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                          onClick={() => handleViewContractor(contractor)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                          onClick={() => handleAssignLead(contractor)}
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
                      <div className="text-center py-12">
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
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredContractors.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {/* View Contractor Modal */}
      {showModal && selectedContractor && (
        <div className="fixed inset-0 -top-5 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white  shadow-2xl w-full relative animate-in zoom-in-95 duration-300 h-full overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="h-6 w-6 text-[#122E5F]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Contractor Details
                </h2>
                <p className="text-sm text-gray-600">
                  Complete information for this contractor
                </p>
              </div>

              {/* Contractor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedContractor.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedContractor.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedContractor.phoneno}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 break-all rounded-md text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedContractor.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Business Address
                  </label>
                  <p className="text-gray-900 break-all bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedContractor.businessAddress}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Service Radius
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
                    <Globe className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedContractor.serviceRadius}
                  </p>
                </div>
              </div>

              {/* Leads Section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-[#286BBD]" />
                  Assigned Leads
                </h3>

                {/* Search Bar for Assigned Leads */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search assigned leads..."
                      value={assignedLeadsSearchTerm}
                      onChange={(e) =>
                        setAssignedLeadsSearchTerm(e.target.value)
                      }
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Name
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Zip Code
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Phone no
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Email
                              </th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                Company
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {loadingAssignedLeads ? (
                              <tr>
                                <td colSpan={5} className="px-4 sm:px-6 py-8 text-center">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                                    <p className="mt-2 text-sm text-gray-500">
                                      Loading assigned leads...
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            ) : currentAssignedLeadsData.length > 0 ? (
                              currentAssignedLeadsData.map(
                                (lead: any, index: number) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                      <div>
                                        <div className="text-sm font-bold text-[#122E5F]">
                                          {lead["First Name"]} {lead["Last Name"]}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-900">
                                          {lead["Zip Code"]}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-black">
                                      <div className="space-y-1 flex items-center">
                                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                        {lead["Phone Number"]}
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-black">
                                      <div className="space-y-1 flex items-center">
                                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                        {lead["Email Address"]}
                                      </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                      <span className="text-sm font-medium text-gray-900 flex items-center">
                                        <Building className="h-3 w-3 text-gray-400 mr-1" />
                                        {lead["Insurance Company"]}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-4 sm:px-6 py-8 text-center text-gray-500"
                                >
                                  No assigned leads found for this contractor
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Leads Pagination */}
                {assignedLeadsTotalPages > 0 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={assignedLeadsCurrentPage}
                      totalPages={assignedLeadsTotalPages}
                      totalItems={filteredAssignedLeads.length}
                      itemsPerPage={assignedLeadsItemsPerPage}
                      onPageChange={handleAssignedLeadsPageChange}
                      onPreviousPage={handleAssignedLeadsPreviousPage}
                      onNextPage={handleAssignedLeadsNextPage}
                      startIndex={assignedLeadsStartIndex}
                      endIndex={assignedLeadsEndIndex}
                    />
                  </div>
                )}
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

      {/* Assign Lead Modal */}
      {showAssignModal && selectedContractor && (
        <div className="fixed inset-0 -top-8 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseAssignModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-[#122E5F]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Assign Leads to {selectedContractor?.fullName}
                </h2>
                <p className="text-sm text-gray-600">
                  Select leads to assign to this contractor
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Leads List */}
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {filteredLeads.length > 0 ? (
                    filteredLeads
                      .filter((lead: LeadType) => lead.Status === "open")
                      .map((lead: LeadType) => {
                        const badge = getDistanceBadge(lead, selectedContractor);
                        return (
                        <div
                          key={lead.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Checkbox
                                checked={selectedLeads.includes(
                                  lead.id.toString()
                                )}
                                onCheckedChange={() =>
                                  handleLeadCheckbox(lead.id.toString())
                                }
                              />
                              <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full hidden md:flex items-center justify-center">
                                <span className="text-sm font-semibold text-[#286BBD]">
                                  {lead["First Name"].charAt(0).toUpperCase()}
                                  {lead["Last Name"].charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                  {lead["First Name"]} {lead["Last Name"]}
                                  {badge && (
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
                                          {badge.text} • {badge.distance} mi (radius {badge.radius} mi)
                                      </span>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {lead["Property Address"]}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <p className="text-sm font-medium text-green-600">
                                {lead["Phone Number"]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No leads found
                      </h3>
                      <p className="text-sm text-gray-500">
                        {searchTerm
                          ? `No leads match "${searchTerm}"`
                          : "No leads available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 justify-end md:space-x-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseAssignModal}
                  className="px-4 py-2 text-sm"
                >
                  Close
                </Button>
                <Button
                  onClick={handleAssignToContractor}
                  disabled={selectedLeads.length === 0}
                  className={`px-4 py-2 text-sm ${
                    selectedLeads.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
                  }`}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Assign to Contractor
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
