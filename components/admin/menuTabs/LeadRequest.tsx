import React, { useState } from "react";
import {
  Search,
  Users,
  MapPin,
  Phone,
  Eye,
  X,
  Mail,
  Building,
  Calendar,
  User,
  DollarSign,
  Target,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { requestLeads, allLeads } from "./Data";
import { requestLeadType, LeadType } from "@/types/AdminTypes";
import { toast } from "react-toastify";

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
  const [assignModalSearchTerm, setAssignModalSearchTerm] = useState("");
  const [selectedContractorRequest, setSelectedContractorRequest] = useState<any>(null);
  
  // Pagination state
  const [assignCurrentPage, setAssignCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLeads = requestLeads.filter(
    (lead) =>
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.zipCode.includes(searchTerm) ||
      lead.phoneno.includes(searchTerm)
  );

  // Pagination logic for Assign tab
  const assignLeads = filteredLeads.filter((lead) => lead.status === "Assign");
  const assignTotalPages = Math.ceil(assignLeads.length / itemsPerPage);
  const assignStartIndex = (assignCurrentPage - 1) * itemsPerPage;
  const assignEndIndex = assignStartIndex + itemsPerPage;
  const assignCurrentData = assignLeads.slice(assignStartIndex, assignEndIndex);

  // Pagination logic for Pending tab
  const pendingLeads = filteredLeads.filter((lead) => lead.status === "Pending");
  const pendingTotalPages = Math.ceil(pendingLeads.length / itemsPerPage);
  const pendingStartIndex = (pendingCurrentPage - 1) * itemsPerPage;
  const pendingEndIndex = pendingStartIndex + itemsPerPage;
  const pendingCurrentData = pendingLeads.slice(pendingStartIndex, pendingEndIndex);

  // Pagination handlers
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

  // Reset pagination when search term changes
  React.useEffect(() => {
    setAssignCurrentPage(1);
    setPendingCurrentPage(1);
  }, [searchTerm]);

  // Filter leads for assigned modal
  const filteredAssignedLeads = allLeads
    .slice(0, 3)
    .filter(
      (lead) =>
        lead.firstName.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
        lead.zipCode.includes(assignedModalSearchTerm) ||
        lead.phoneno.includes(assignedModalSearchTerm) ||
        lead.email.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(assignedModalSearchTerm.toLowerCase()) ||
        lead.policy.includes(assignedModalSearchTerm)
    );

  // Filter leads for pending modal
  const filteredPendingLeads = allLeads
    .slice(3, 5)
    .filter(
      (lead) =>
        lead.firstName.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
        lead.zipCode.includes(pendingModalSearchTerm) ||
        lead.phoneno.includes(pendingModalSearchTerm) ||
        lead.email.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(pendingModalSearchTerm.toLowerCase()) ||
        lead.policy.includes(pendingModalSearchTerm)
    );

  // Filter leads for assign modal
  const filteredAssignLeads = allLeads.filter(
    (lead) =>
      lead.firstName.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
      lead.zipCode.includes(assignModalSearchTerm) ||
      lead.phoneno.includes(assignModalSearchTerm) ||
      lead.email.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(assignModalSearchTerm.toLowerCase()) ||
      lead.policy.includes(assignModalSearchTerm)
  );

  const handleViewAssignedLead = (lead: requestLeadType) => {
    const matchingLead = allLeads.find(
      (allLead) =>
        allLead.firstName === lead.firstName && allLead.lastName === lead.lastName && allLead.zipCode === lead.zipCode
    );
    setSelectedAssignedLead(matchingLead || lead);
    setShowAssignedModal(true);
  };

  const handleViewPendingLead = (lead: requestLeadType) => {
    const matchingLead = allLeads.find(
      (allLead) =>
        allLead.firstName === lead.firstName && allLead.lastName === lead.lastName && allLead.zipCode === lead.zipCode
    );
    setSelectedPendingLead(matchingLead || lead);
    setShowPendingModal(true);
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

  const handleOpenAssignModal = (contractorRequest: any) => {
    setSelectedContractorRequest(contractorRequest);
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

  const handleAssignSelectedLeads = () => {
    if (selectedAssignLeads.size === 0) {
      alert("Please select at least one lead to assign");
      return;
    }

    const selectedLeadsList = Array.from(selectedAssignLeads);
    console.log("Assigning leads:", selectedLeadsList);
    toast.success(`${selectedAssignLeads.size} leads assigned to contractors`);

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
        <h2 className="text-xl font-bold text-gray-900 mb-1">Requested Leads</h2>
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
          <TabsTrigger value="assign" className="text-sm font-medium">
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-sm font-medium">
            Pending ({filteredLeads.filter((lead) => lead.status === "Pending").length})
          </TabsTrigger>
        </TabsList>

        {/* Completed Tab */}
        <TabsContent value="assign">
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
                        Zip Code
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th> */}
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
                      assignCurrentData.map((lead: requestLeadType) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-bold text-[#122E5F]">
                                {lead.firstName} {lead.lastName}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                              <Phone className="h-3 w-3 text-gray-400 mr-1" />
                              {lead.phoneno}
                            </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{lead.zipCode}</span>
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-black">
                           
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">{lead.price}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">{lead.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">{lead.noOfLeads}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">{lead.receivedLeads}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-green-500">{lead.status}</span>
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
                        Zip Code
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
                      pendingCurrentData.map((lead: requestLeadType) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center text-sm text-start font-bold text-[#122E5F]">
                                <User className="h-3 w-3 text-gray-400 mr-1" />
                                {lead.firstName} {lead.lastName}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                              <Phone className="h-3 w-3 text-gray-400 mr-1" />
                              {lead.phoneno}
                            </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{lead.zipCode}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">{lead.price}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">{lead.date}</span>
                            </div>
                          </td>
                          <td className="py-2 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">{lead.noOfLeads}</span>
                          </td>
                          <td className="py-2 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">{lead.pendingLeads}</span>
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            <span className="text-sm font-bold text-yellow-500">{lead.status}</span>
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
      {showAssignedModal && selectedAssignedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-auto">
            <button
              onClick={handleCloseAssignedModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 z-50 border border-gray-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Assigned Lead Details</h2>
                <p className="text-sm text-gray-600">Complete information about this assigned lead</p>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search leads..."
                    value={assignedModalSearchTerm}
                    onChange={(e) => setAssignedModalSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Leads Data Table */}
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zip Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Date
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
                    {filteredAssignedLeads.map((lead: LeadType, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">
                            {lead.firstName} {lead.lastName}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">{lead.zipCode}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{lead.phoneno}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.email}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.assignedDate}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.company}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.policy}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleCloseAssignedModal}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Lead Details Modal */}
      {showPendingModal && selectedPendingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-auto">
            <button
              onClick={handleClosePendingModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 z-50 border border-gray-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Lead Details</h2>
                <p className="text-sm text-gray-600">Complete information about this pending lead</p>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search leads..."
                    value={pendingModalSearchTerm}
                    onChange={(e) => setPendingModalSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Leads Data Table */}
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zip Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Date
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
                    {filteredPendingLeads.map((lead: LeadType, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">
                            {lead.firstName} {lead.lastName}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">{lead.zipCode}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{lead.phoneno}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.email}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.assignedDate}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.company}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.policy}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleClosePendingModal}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <h2 className="text-xl font-bold text-gray-900 mb-1">Assign Leads</h2>
                <p className="text-sm text-gray-600">
                  Select leads to assign to contractors
                  {selectedContractorRequest && (
                    <span className="block mt-1 text-xs text-blue-600 font-medium">
                      Pending leads limit: {selectedContractorRequest.pendingLeads}
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
                        Zip Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Date
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
                    {filteredAssignLeads.map((lead: LeadType, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedAssignLeads.has(lead.id)}
                            onChange={() => handleSelectAssignLead(lead.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            aria-label="Select lead"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">
                            {lead.firstName} {lead.lastName}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#122E5F]">{lead.zipCode}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{lead.phoneno}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.email}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.assignedDate}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.company}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <span className="text-sm text-gray-900">{lead.policy}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {selectedAssignLeads.size > 0 && (
                    <span className="font-medium text-blue-600">
                      {selectedAssignLeads.size} lead{selectedAssignLeads.size !== 1 ? "s" : ""} selected
                    </span>
                  )}
                  {/* Exceeds pending limit */}
                  {selectedContractorRequest && selectedAssignLeads.size > selectedContractorRequest.pendingLeads && (
                    <span className="font-medium text-red-600 ml-2">
                      (Exceeds pending limit: {selectedContractorRequest.pendingLeads})
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCloseAssignModal}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleAssignSelectedLeads}
                    disabled={
                      selectedAssignLeads.size === 0 ||
                      (selectedContractorRequest && selectedAssignLeads.size > selectedContractorRequest.pendingLeads)
                    }
                    className={`px-6 py-2 text-white ${
                      selectedAssignLeads.size === 0 ||
                      (selectedContractorRequest && selectedAssignLeads.size > selectedContractorRequest.pendingLeads)
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
    </div>
  );
};
