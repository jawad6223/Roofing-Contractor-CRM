import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Eye, X, Calendar, User, DollarSign, Target, FileText, } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { fetchLeads, fetchRequestLeads } from "./Data";
import { requestLeadType, LeadType, contractorDataType } from "@/types/AdminTypes";
import { toast } from "react-toastify";
import { TablePopup } from "@/components/ui/TablePopup";
import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distanceFormula";

export const LeadRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignedModal, setShowAssignedModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedAssignedLead, setSelectedAssignedLead] = useState<any>(null);
  const [selectedPendingLead, setSelectedPendingLead] = useState<any>(null);
  const [assignedModalSearchTerm, setAssignedModalSearchTerm] = useState("");
  const [pendingModalSearchTerm, setPendingModalSearchTerm] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignLeads, setSelectedAssignLeads] = useState<Set<number>>(new Set());
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [assignModalSearchTerm, setAssignModalSearchTerm] = useState("");
  const [selectedContractorRequest, setSelectedContractorRequest] = useState<any>(null);
  const [requestLeads, setRequestLeads] = useState<any[]>([]);
  const [contractorData, setContractorData] = useState<contractorDataType>();
  const [assignCurrentPage, setAssignCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const leadsData = await fetchLeads();
      if (leadsData) {
        setLeads(leadsData);
      }
    };
    fetchLeadsData();
  }, []);

  const filteredLeads = requestLeads.filter(
    (lead) =>
      lead["Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Business Address"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead["Price"].toString().includes(searchTerm) ||
      lead["Purchase Date"].includes(searchTerm) ||
      lead["No. of Leads"].toString().includes(searchTerm) ||
      lead["Send Leads"].toString().includes(searchTerm) ||
      lead["Status"].includes(searchTerm)
  );

  const assignLeads = filteredLeads.filter((lead) => lead["Status"] === "assigned");
  const assignTotalPages = Math.ceil(assignLeads.length / itemsPerPage);
  const assignStartIndex = (assignCurrentPage - 1) * itemsPerPage;
  const assignEndIndex = assignStartIndex + itemsPerPage;
  const assignCurrentData = assignLeads.slice(assignStartIndex, assignEndIndex);

  const pendingLeads = filteredLeads.filter((lead) => lead["Status"] === "pending");
  const pendingTotalPages = Math.ceil(pendingLeads.length / itemsPerPage);
  const pendingStartIndex = (pendingCurrentPage - 1) * itemsPerPage;
  const pendingEndIndex = pendingStartIndex + itemsPerPage;
  const pendingCurrentData = pendingLeads.slice( pendingStartIndex, pendingEndIndex );

  const handleAssignPageChange = (page: number) => {
    setAssignCurrentPage(page);
  };

  const handlePendingPageChange = (page: number) => {
    setPendingCurrentPage(page);
  };

  const handleAssignPreviousPage = () => {
    setAssignCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleAssignNextPage = () => {
    setAssignCurrentPage((prev) => Math.min(prev + 1, assignTotalPages));
  };

  const handlePendingPreviousPage = () => {
    setPendingCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePendingNextPage = () => {
    setPendingCurrentPage((prev) => Math.min(prev + 1, pendingTotalPages));
  };

  React.useEffect(() => {
    setAssignCurrentPage(1);
    setPendingCurrentPage(1);
  }, [searchTerm]);
  
  const filteredAssignedLeads = selectedAssignedLead?.filter((lead: any) =>
    lead.firstName?.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
    lead.lastName?.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
    lead.propertyAddress?.includes(assignedModalSearchTerm) ||
    lead.phoneno?.includes(assignedModalSearchTerm) ||
    lead.email?.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
    lead.policy?.includes(assignedModalSearchTerm)
  );

  const filteredPendingLeads = selectedPendingLead?.filter((lead: any) =>
    lead.firstName?.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
    lead.lastName?.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
    lead.propertyAddress?.includes(pendingModalSearchTerm) ||
    lead.phoneno?.includes(pendingModalSearchTerm) ||
    lead.email?.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
    lead.policy?.includes(pendingModalSearchTerm)
  );

  const pendingLeadsColumns = [
    { key: "name", label: "Name" },
    { key: "propertyAddress", label: "Property Address" },
    { key: "phoneno", label: "Phone No" },
    { key: "email", label: "Email" },
    { key: "assignedDate", label: "Assigned Date" },
    { key: "company", label: "Company" },
    { key: "policy", label: "Policy" },
  ];

  const pendingLeadsTableData = filteredPendingLeads?.map((lead: any) => ({
    ...lead,
    name: `${lead.firstName} ${lead.lastName}`,
    assignedDate: lead.assignedDate || new Date().toISOString().split('T')[0]
  }));

  const assignedLeadsColumns = [
    { key: "name", label: "Name" },
    { key: "propertyAddress", label: "Property Address" },
    { key: "phoneno", label: "Phone No" },
    { key: "email", label: "Email" },
    { key: "assignedDate", label: "Assigned Date" },
    { key: "company", label: "Company" },
    { key: "policy", label: "Policy" },
  ];

  const assignedLeadsTableData = filteredAssignedLeads?.map((lead: any) => ({
    ...lead,
    name: `${lead.firstName} ${lead.lastName}`,
    assignedDate: lead.assignedDate || new Date().toISOString().split('T')[0],
    propertyAddress: lead.propertyAddress,
    phoneno: lead.phoneno,
    email: lead.email,
    company: lead.company,
    policy: lead.policy
  }));

  const filteredAssignLeads = leads?.filter((lead: LeadType) => lead["Status"] === "open")?.filter((lead: LeadType) =>
    lead["First Name"]?.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
    lead["Last Name"]?.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
    lead["Property Address"]?.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
    lead["Phone Number"]?.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
    lead["Email Address"]?.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
    lead["Insurance Company"]?.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
    lead["Policy Number"]?.toLowerCase().includes(assignModalSearchTerm)
  );

  const handleViewAssignedLead = async (lead: requestLeadType) => {
    try {
      console.log('lead', lead);
      const contractorId = lead.contractor_id;
      const requestId = lead.id;
      
      if (!contractorId) {
        toast.error("Contractor ID not found");
        return;
      }
      const { data: assignedLeads, error } = await supabase
        .from("Assigned_Leads")
        .select("*")
        .eq("contractor_id", contractorId)
        .eq("request_id", requestId)
        .order("Assigned Date", { ascending: false });

      if (error) {
        console.error("Error fetching assigned leads:", error);
        toast.error("Failed to fetch assigned leads");
        return;
      }

      console.log("Fetched assigned leads:", assignedLeads);
      
      const transformedLeads = assignedLeads.map(lead => ({
        id: lead.id,
        firstName: lead["First Name"],
        lastName: lead["Last Name"],
        propertyAddress: lead["Property Address"],
        phoneno: lead["Phone Number"],
        email: lead["Email Address"],
        company: lead["Insurance Company"],
        policy: lead["Policy Number"],
        assignedDate: lead["Assigned Date"]
      }));

      setSelectedAssignedLead(transformedLeads);
      setShowAssignedModal(true);
    } catch (error) {
      console.error("Error in handleViewAssignedLead:", error);
      toast.error("Failed to load assigned leads");
    }
  };

  const handleViewPendingLead = async (lead: requestLeadType) => {
    try {
      const contractorId = lead.contractor_id;
      const requestId = lead.id;
      
      if (!contractorId) {
        toast.error("Contractor ID not found");
        return;
      }

      const { data: assignedLeads, error } = await supabase
        .from("Assigned_Leads")
        .select("*")
        .eq("contractor_id", contractorId)
        .eq("request_id", requestId)
        .order("Assigned Date", { ascending: false });

      if (error) {
        console.error("Error fetching assigned leads:", error);
        toast.error("Failed to fetch assigned leads");
        return;
      }

      console.log("Fetched assigned leads for pending view:", assignedLeads);
      
      const transformedLeads = assignedLeads.map(lead => ({
        id: lead.id,
        firstName: lead["First Name"],
        lastName: lead["Last Name"],
        propertyAddress: lead["Property Address"],
        phoneno: lead["Phone Number"],
        email: lead["Email Address"],
        company: lead["Insurance Company"],
        policy: lead["Policy Number"],
        assignedDate: lead["Assigned Date"]
      }));

      setSelectedPendingLead(transformedLeads);
      setShowPendingModal(true);
    } catch (error) {
      console.error("Error in handleViewPendingLead:", error);
      toast.error("Failed to load assigned leads");
    }
  };

  const handleCloseAssignedModal = () => {
    setShowAssignedModal(false);
    setSelectedAssignedLead(null);
    setAssignedModalSearchTerm("");
  };

  const handleClosePendingModal = () => {
    setShowPendingModal(false);
    setSelectedPendingLead(null);
    setPendingModalSearchTerm("");
  };

  const getDistanceBadge = (lead: LeadType, contractor: contractorDataType) => {
    if (!contractor) {
      return { text: "Loading...", color: "bg-gray-100 text-gray-800" };
    }

    if (!lead["Latitude"] || !lead["Longitude"] || !contractor.latitude || !contractor.longitude) {
      return { text: "No Coordinates", color: "bg-gray-100 text-gray-800" };
    }

    const serviceRadius = contractor.serviceRadius;
    const radiusValue = parseFloat(serviceRadius.replace(/\D/g, '')) || 50;
    
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

  const handleOpenAssignModal = async (contractorRequest: any) => {
    setSelectedContractorRequest(contractorRequest);
    console.log('contractorRequest', contractorRequest.contractor_id);
    
    try {
      const { data: contractorData, error } = await supabase
        .from("Roofing_Auth")
        .select("user_id, \"Full Name\", \"Business Address\", \"Service Radius\", \"Latitude\", \"Longitude\"")
        .eq("user_id", contractorRequest.contractor_id)
        .single();

      if (error) {
        console.error("Error fetching contractor:", error);
        toast.error("Failed to load contractor data");
      } else {
        setContractorData({
          user_id: contractorData.user_id,
          fullName: contractorData["Full Name"],
          businessAddress: contractorData["Business Address"],
          serviceRadius: contractorData["Service Radius"],
          latitude: contractorData["Latitude"],
          longitude: contractorData["Longitude"],
        });
      }
    } catch (error) {
      console.error("Error in handleOpenAssignModal:", error);
    }
    
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedAssignLeads(new Set());
    setSelectedContractorRequest(null);
  };

  const handleSelectAssignLead = (leadId: number) => {
    const newSelected = new Set(selectedAssignLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedAssignLeads(newSelected);
  };

  const handleAssignSelectedLeads = async () => {
    if (selectedAssignLeads.size === 0) {
      alert("Please select at least one lead to assign");
      return;
    }

    if (!selectedContractorRequest) {
      toast.error("No contractor request selected");
      return;
    }

    try {
      const selectedLeadsList = Array.from(selectedAssignLeads);
      const selectedLeadsData = leads.filter(lead => selectedLeadsList.includes(lead.id));
      
      console.log("Assigning leads:", selectedLeadsData);
      console.log("To contractor request:", selectedContractorRequest);

      // 1. Insert selected leads into Assigned_Leads table
      const assignedLeadsData = selectedLeadsData.map(lead => ({
        contractor_id: selectedContractorRequest.contractor_id,
        request_id: selectedContractorRequest.id,
        "First Name": lead["First Name"],
        "Last Name": lead["Last Name"],
        "Phone Number": lead["Phone Number"],
        "Email Address": lead["Email Address"],
        "Property Address": lead["Property Address"],
        "Insurance Company": lead["Insurance Company"],
        "Policy Number": lead["Policy Number"],
        "Assigned Date": new Date().toISOString(),
        "Latitude": lead["Latitude"],
        "Longitude": lead["Longitude"]
      }));

      const { error: insertError } = await supabase
        .from("Assigned_Leads")
        .insert(assignedLeadsData);

      if (insertError) {
        console.error("Error inserting assigned leads:", insertError);
        toast.error("Failed to assign leads");
        return;
      }

      // 2. Update Leads_Request table
      const currentSendLeads = parseInt(selectedContractorRequest["Send Leads"]) || 0;
      const currentPendingLeads = parseInt(selectedContractorRequest["Pending Leads"]) || 0;
      const newSendLeads = currentSendLeads + selectedLeadsData.length;
      const newPendingLeads = Math.max(0, currentPendingLeads - selectedLeadsData.length);
      const newStatus = newPendingLeads === 0 ? "assigned" : "pending";

      console.log("Updating request:", {
        id: selectedContractorRequest.id,
        currentSendLeads,
        currentPendingLeads,
        newSendLeads,
        newPendingLeads,
        newStatus
      });

      const { error: updateRequestError } = await supabase
        .from("Leads_Request")
        .update({
          "Send Leads": newSendLeads,
          "Pending Leads": newPendingLeads,
          "Status": newStatus
        })
        .eq("id", selectedContractorRequest.id);

      if (updateRequestError) {
        console.error("Error updating request:", updateRequestError);
        toast.error("Failed to update request status");
        return;
      }

      // 3. Insert leads into Contractor_Leads table
      const contractorLeadsData = selectedLeadsData.map(lead => ({
        contractor_id: selectedContractorRequest.contractor_id,
        lead_id: lead.id,
        "First Name": lead["First Name"],
        "Last Name": lead["Last Name"],
        "Phone Number": lead["Phone Number"],
        "Email Address": lead["Email Address"],
        "Property Address": lead["Property Address"],
        "Insurance Company": lead["Insurance Company"],
        "Policy Number": lead["Policy Number"],
        "Latitude": lead["Latitude"],
        "Longitude": lead["Longitude"],
        status: "open"
      }));

      const { error: insertContractorLeadsError } = await supabase
        .from("Contractor_Leads")
        .insert(contractorLeadsData);

      if (insertContractorLeadsError) {
        console.error("Error inserting contractor leads:", insertContractorLeadsError);
        toast.error("Failed to add leads to contractor");
        return;
      }

      // 4. Update lead status to close in Leads_Data table
      const { error: updateLeadsError } = await supabase
        .from("Leads_Data")
        .update({ "Status": "close" })
        .in("id", selectedLeadsList);

      if (updateLeadsError) {
        console.error("Error updating leads status:", updateLeadsError);
        toast.error("Failed to update leads status");
        return;
      }

      toast.success(`${selectedLeadsData.length} leads assigned successfully`);
      
      // Refresh the data
      const fetchRequestLeadsData = async () => {
        const requestLeadsData = await fetchRequestLeads();
        if (requestLeadsData) {
          setRequestLeads(requestLeadsData);
        }
      };
      fetchRequestLeadsData();

    } catch (error) {
      console.error("Error in handleAssignSelectedLeads:", error);
      toast.error("Failed to assign leads");
    }

    setShowAssignModal(false);
    setSelectedAssignLeads(new Set());
  };

  return (
    <div className="">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#122E5F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <FileText className="h-6 w-6 text-[#122E5F]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Requested Leads
        </h2>
        <p className="text-sm text-gray-600">Browse and manage lead requests</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Contractors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#122E5F] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="assigned" className="text-sm font-medium">
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-sm font-medium">
            Pending (
            {filteredLeads.filter((lead) => lead["Status"] === "pending").length})
          </TabsTrigger>
        </TabsList>

        {/* Completed Tab */}
        <TabsContent value="assigned">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. of Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Send Leads
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
                    {assignCurrentData.length > 0 ? (
                      assignCurrentData.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-bold text-[#122E5F]">
                                {lead["Name"]}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                {lead["Phone Number"]}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Business Address"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Price"] * (lead["No. of Leads"])}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Purchase Date"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {lead["No. of Leads"]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {lead["Send Leads"]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-green-500">
                              {lead["Status"]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={() => handleViewAssignedLead(lead)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="h-12 w-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                No assigned leads found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchTerm
                                  ? `No results for "${searchTerm}"`
                                  : "No assigned leads available"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls for Assign Tab */}
          <Pagination
            currentPage={assignCurrentPage}
            totalPages={assignTotalPages}
            totalItems={assignLeads.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handleAssignPageChange}
            onPreviousPage={handleAssignPreviousPage}
            onNextPage={handleAssignNextPage}
            startIndex={assignStartIndex}
            endIndex={assignEndIndex}
          />
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No. of Leads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Leads
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
                    {pendingCurrentData.length > 0 ? (
                      pendingCurrentData.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center text-sm text-start font-bold text-[#122E5F]">
                                <User className="h-3 w-3 text-gray-400 mr-1" />
                                {lead["Name"]}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                  {lead["Phone Number"]}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Business Address"]}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Price"] * (lead["No. of Leads"])}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead["Purchase Date"]}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {lead["No. of Leads"]}
                            </span>
                          </td>
                          <td className="py-2 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {lead["Pending Leads"]}
                            </span>
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            <span className="text-sm font-bold text-yellow-500">
                              {lead["Status"]}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex flex-row items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#122E5F] w-full text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                                onClick={() => handleViewPendingLead(lead)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#122E5F] w-full text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                                onClick={() => handleOpenAssignModal(lead)}
                              >
                                <Target className="h-4 w-4 mr-1" />
                                Assign
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="h-12 w-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                No pending leads found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchTerm
                                  ? `No results for "${searchTerm}"`
                                  : "No pending leads available"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls for Pending Tab */}
          <Pagination
            currentPage={pendingCurrentPage}
            totalPages={pendingTotalPages}
            totalItems={pendingLeads.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePendingPageChange}
            onPreviousPage={handlePendingPreviousPage}
            onNextPage={handlePendingNextPage}
            startIndex={pendingStartIndex}
            endIndex={pendingEndIndex}
          />
        </TabsContent>
      </Tabs>

      {/* Assigned Lead Details Modal */}
      <TablePopup
        isOpen={showAssignedModal}
        onClose={handleCloseAssignedModal}
        title="Assigned Lead Details"
        subtitle="Complete information about assigned leads"
        titleIcon={FileText}
        columns={assignedLeadsColumns}
        data={assignedLeadsTableData}
        searchTerm={assignedModalSearchTerm}
        onSearchChange={setAssignedModalSearchTerm}
        searchPlaceholder="Search leads..."
        itemsPerPage={10}
        showPagination={true}
        closeButtonText="Close"
        closeButtonClassName="px-3 py-1.5 text-sm"
      />

      {/* Assign Leads Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-auto">
            <button
              onClick={handleCloseAssignModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 z-50 border border-gray-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-[#122E5F]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Assign Leads
                </h2>
                <p className="text-sm text-gray-600">
                  Select leads to assign to contractors
                  {selectedContractorRequest && (
                    <span className="block mt-1 text-xs text-blue-600 font-medium">
                      Pending leads limit:{" "}
                      {selectedContractorRequest["Pending Leads"]}
                    </span>
                  )}
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search leads..."
                    value={assignModalSearchTerm}
                    onChange={(e) => setAssignModalSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#122E5F] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Leads Data Table */}
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAssignLeads?.map((lead: LeadType, index: number) => {
                      const badge = contractorData ? getDistanceBadge(lead, contractorData) : null;
                      return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedAssignLeads.has(lead["id"])}
                            onChange={() => handleSelectAssignLead(lead["id"])}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            aria-label="Select lead"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">
                            {lead["First Name"]} {lead["Last Name"]}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#122E5F]">
                              {lead["Property Address"]}
                            </span>
                            {badge && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
                                {badge.text} • {badge.distance} mi (radius {badge.radius} mi)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {lead["Phone Number"]}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">
                            {lead["Email Address"]}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">
                            {lead["Insurance Company"]}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">
                            {lead["Policy Number"]}
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedAssignLeads.size > 0 && (
                    <span className="font-medium text-blue-600">
                      {selectedAssignLeads.size} lead
                      {selectedAssignLeads.size !== 1 ? "s" : ""} selected
                    </span>
                  )}
                  {/* Exceeds pending limit */}
                  {selectedContractorRequest &&
                    selectedAssignLeads.size >
                      selectedContractorRequest["Pending Leads"] && (
                      <span className="font-medium text-red-600 ml-2">
                        (Exceeds pending limit:{" "}
                        {selectedContractorRequest["Pending Leads"]})
                      </span>
                    )}
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleCloseAssignModal} variant="outline">
                    Close
                  </Button>
                  <Button
                    onClick={handleAssignSelectedLeads}
                    disabled={
                      selectedAssignLeads.size === 0 ||
                      (selectedContractorRequest &&
                        selectedAssignLeads.size >
                          selectedContractorRequest["Pending Leads"])
                    }
                    className={`px-6 py-2 text-white ${
                      selectedAssignLeads.size === 0 ||
                      (selectedContractorRequest &&
                        selectedAssignLeads.size >
                          selectedContractorRequest["Pending Leads"])
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#122E5F] hover:bg-[#122E5F]/80"
                    }`}
                  >
                    Assign ({selectedAssignLeads.size})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Leads Table Popup */}
      <TablePopup
        isOpen={showPendingModal}
        onClose={handleClosePendingModal}
        title="Lead Details"
        subtitle="Complete information about pending leads"
        titleIcon={FileText}
        columns={pendingLeadsColumns}
        data={pendingLeadsTableData}
        searchTerm={pendingModalSearchTerm}
        onSearchChange={setPendingModalSearchTerm}
        searchPlaceholder="Search leads..."
        itemsPerPage={10}
        showPagination={true}
        closeButtonText="Close"
        closeButtonClassName="px-3 py-1.5 text-sm"
      />
    </div>
  );
};
