"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Target,
  Plus,
  Download,
  Eye,
  ChevronDown,
  X,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { contractors } from "./Data";
import { LeadType } from "@/types/AdminTypes";
import { allLeads } from "./Data";
import * as ExcelJS from "exceljs";

export const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<LeadType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [leadToAssign, setLeadToAssign] = useState<LeadType | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<string>("");
  const [contractorSearchTerm, setContractorSearchTerm] = useState("");
  const [leadStatuses, setLeadStatuses] = useState<{ [key: string]: string }>({});
  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    phoneno: "",
    email: "",
    zipCode: "",
    company: "",
    policy: "",
    status: "Available",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter leads based on search term and status
  const filteredLeads = allLeads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      lead.zipCode.toLowerCase().includes(searchLower) ||
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.phoneno.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.company.toLowerCase().includes(searchLower) ||
      lead.policy.includes(searchTerm);

    const leadStatus = leadStatuses[lead.id.toString()] || "Open";
    const matchesStatus = statusFilter === "All" || leadStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredLeads.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleViewLead = (lead: LeadType): void => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedLead(null);
    setShowModal(false);
  };

  const handleAddLead = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewLead({
      firstName: "",
      lastName: "",
      phoneno: "",
      email: "",
      zipCode: "",
      company: "",
      policy: "",
      status: "Available",
    });
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

  const handleSelectContractor = () => {
    if (selectedContractor && leadToAssign) {
      console.log(`Assigning lead ${leadToAssign.id} to contractor:`, selectedContractor);
      // TODO: Add assignment logic here
      handleCloseAssignModal();
    }
  };

  const handleCloseLead = (leadId: string) => {
    setLeadStatuses((prev) => ({
      ...prev,
      [leadId]: "Cancel",
    }));
  };

  const getLeadStatus = (leadId: string) => {
    return leadStatuses[leadId] || "Open";
  };

  const getStatusBadgeColor = (leadId: string) => {
    const status = getLeadStatus(leadId);
    return status === "Cancel"
      ? "bg-red-100 text-red-800 hover:bg-red-200"
      : "bg-green-100 text-green-800 hover:bg-green-200";
  };

  const handleContractorSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractorSearchTerm(e.target.value);
  };

  const filteredContractors = contractors.filter(
    (contractor) =>
      contractor.fullName.toLowerCase().includes(contractorSearchTerm.toLowerCase()) ||
      contractor.phoneno.toLowerCase().includes(contractorSearchTerm.toLowerCase()) ||
      contractor.businessAddress.toLowerCase().includes(contractorSearchTerm.toLowerCase())
  );

  const handleExportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Leads");

      // Add headers
      worksheet.columns = [
        { header: "First Name", key: "firstName", width: 15 },
        { header: "Last Name", key: "lastName", width: 15 },
        { header: "Phone Number", key: "phoneno", width: 15 },
        { header: "Email", key: "email", width: 25 },
        { header: "Zip Code", key: "zipCode", width: 10 },
        { header: "Insurance Company", key: "company", width: 20 },
        { header: "Policy Number", key: "policy", width: 15 },
        { header: "Assigned To", key: "assignedTo", width: 20 },
      ];

      // Add data rows
      filteredLeads.forEach((lead) => {
        worksheet.addRow({
          firstName: lead.firstName,
          lastName: lead.lastName,
          phoneno: lead.phoneno,
          email: lead.email,
          zipCode: lead.zipCode,
          company: lead.company,
          policy: lead.policy,
          assignedTo: lead.assignedTo || "Unassigned",
        });
      });

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `leads_export_${currentDate}.xlsx`;

      // Download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);

      console.log(`Excel file "${filename}" downloaded successfully!`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting data to Excel. Please try again.");
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add lead submission logic here
    console.log("New lead data:", newLead);
    handleCloseAddModal();
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4">
        <div className="text-center md:text-start">
          <h2 className="text-2xl font-bold text-gray-900">Leads Management</h2>
          <p className="text-gray-600">Manage and assign leads to contractors</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleAddLead} className="bg-[#122E5F] hover:bg-[#0f2347] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          <Button
            variant="outline"
            className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
            onClick={handleExportToExcel}
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
                className="appearance-none bg-white border border-[#286BBD] lg:w-auto w-full text-[#286BBD] px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[#286BBD] focus:border-transparent min-w-[140px]"
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

      {/* <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
              {["All", "Available", "Assigned", "In Progress", "Closed"].map((status) => {
                const count = status === "All" 
                  ? allLeads.length 
                  : allLeads.filter(lead => lead.status === status).length;
                return (
                  <div
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      statusFilter === status 
                        ? 'border-[#286BBD] bg-[#286BBD]/5' 
                        : 'border-gray-200 hover:border-[#286BBD]/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-600">{status}</div>
                    </div>
                  </div>
                );
              })}
            </div> */}

      {/* Leads Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                    Phone No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
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
                          {lead.firstName} {lead.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{lead.zipCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{lead.phoneno}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Badge className={getStatusBadgeColor(lead.id.toString())}>
                          {getLeadStatus(lead.id.toString())}
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
                            <DropdownMenuItem onClick={() => handleViewLead(lead)} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCloseLead(lead.id.toString())}
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
                          className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
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
                          <p className="text-lg font-medium text-gray-900">No leads found</p>
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
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {filteredLeads.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 p-0 ${
                    currentPage === page ? "bg-[#286BBD] text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {/* {(searchTerm || statusFilter !== "All") && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {filteredLeads.length} of {allLeads.length} leads
                  {searchTerm && ` matching "${searchTerm}"`}
                  {statusFilter !== "All" && ` with status "${statusFilter}"`}
                </span>
                {(searchTerm || statusFilter !== "All") && (
                  <div className="flex gap-2">
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-[#286BBD] hover:text-[#1d4ed8] font-medium"
                      >
                        Clear search
                      </button>
                    )}
                    {statusFilter !== "All" && (
                      <button
                        onClick={() => setStatusFilter("All")}
                        className="text-[#286BBD] hover:text-[#1d4ed8] font-medium"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            )} */}

      {/* Quick Stats */}

      {/* View Lead Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
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
                  <FileText className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Lead Details</h2>
                <p className="text-sm text-gray-600">Complete information for this lead</p>
              </div>

              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">{selectedLead.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">{selectedLead.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">{selectedLead.phoneno}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 flex break-all rounded-md text-sm">
                    {selectedLead.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">{selectedLead.zipCode}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Insurance Company</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">{selectedLead.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Policy Number</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">{selectedLead.policy}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned To</label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                    {selectedLead.assignedTo || "Unassigned"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-200">
                <Button variant="outline" onClick={handleCloseModal} className="px-3 py-1.5 text-sm">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseAddModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Add New Lead</h2>
                <p className="text-sm text-gray-600">Enter lead information to add to the system</p>
              </div>

              {/* Add Lead Form */}
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <Input
                      name="firstName"
                      value={newLead.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                    <Input
                      name="lastName"
                      value={newLead.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <Input
                      name="phoneno"
                      value={newLead.phoneno}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                    <Input
                      name="email"
                      type="email"
                      value={newLead.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Zip Code *</label>
                    <Input
                      name="zipCode"
                      value={newLead.zipCode}
                      onChange={handleInputChange}
                      placeholder="75201"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Insurance Company *</label>
                    <Input
                      name="company"
                      value={newLead.company}
                      onChange={handleInputChange}
                      placeholder="ABC Insurance"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Policy Number *</label>
                    <Input
                      name="policy"
                      value={newLead.policy}
                      onChange={handleInputChange}
                      placeholder="POL123456789"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={handleCloseAddModal} className="px-4 py-2 text-sm">
                    Cancel
                  </Button>
                  <Button type="submit" className="px-4 py-2 text-sm bg-[#286BBD] hover:bg-[#1d4ed8] text-white">
                    Add Lead
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && leadToAssign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl  w-full mx-4 relative animate-in zoom-in-95 duration-300">
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
                    <FileText className="h-6 w-6 text-[#286BBD]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Assign Lead to Contractor</h2>
                  <p className="text-sm text-gray-600">
                    Select contractors to assign lead:{" "}
                    <span className="font-semibold text-[#286BBD]">
                      {leadToAssign.firstName} {leadToAssign.lastName}
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
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {filteredContractors.length > 0 ? (
                    filteredContractors.map((contractor) => (
                      <div
                        key={contractor.id}
                        className="flex flex-col md:flex-row justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-[#286BBD]/50"
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedContractor === contractor.id}
                            onCheckedChange={() => handleContractorSelect(contractor.id)}
                            className="data-[state=checked]:bg-[#286BBD] data-[state=checked]:border-[#286BBD]"
                          />
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                              <UserPlus className="h-5 w-5 text-[#286BBD]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{contractor.fullName}</h3>
                              <p className="text-sm text-gray-600">{contractor.phoneno}</p>
                            </div>
                          </div>
                        </div>
                        <div className="">
                          <div className="flex justify-between space-x-4 mt-4 md:mt-0">
                            <div className="text-start md:text-end">
                              <p className="text-sm font-medium text-[#286BBD]">{contractor.businessAddress}</p>
                              <p className="text-xs text-gray-500">Location</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">{contractor.serviceRadius}</p>
                              <p className="text-xs text-gray-500">Service Radius</p>
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
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
                <Button variant="outline" onClick={handleCloseAssignModal} className="px-4 py-2 text-sm">
                  Cancel
                </Button>
                <Button
                  onClick={handleSelectContractor}
                  disabled={!selectedContractor}
                  className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
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
