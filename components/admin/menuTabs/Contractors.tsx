"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Eye,
  Target,
  X,
  Globe,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Search,
  FileText,
} from "lucide-react";
import { UserCheck } from "lucide-react";
import { contractors } from "./Data";
import { ContractorType, LeadType } from "@/types/AdminTypes";
import { allLeads } from "./Data";


export const Contractors = () => {
  const [selectedContractor, setSelectedContractor] =useState<ContractorType>();
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadType>();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contractorSearchTerm, setContractorSearchTerm] = useState("");

  // Filter contractors based on search term
  const filteredContractors = contractors.filter(contractor => 
    contractor.fullName.toLowerCase().includes(contractorSearchTerm.toLowerCase()) ||
    contractor.phoneno.toLowerCase().includes(contractorSearchTerm.toLowerCase()) ||
    contractor.businessAddress.toLowerCase().includes(contractorSearchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredContractors.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleViewContractor = (contractor: ContractorType): void => {
    setSelectedContractor(contractor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAssignLeads = () => {
    handleCloseModal();
  };

  const handleAssignLead = (lead: LeadType) => {
    setSelectedLead(lead);
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
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleAssignToContractor = () => {
    console.log('Assigning leads:', selectedLeads, 'to contractor:', selectedLead?.id);
    handleCloseAssignModal();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleContractorSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractorSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredLeads = allLeads.filter(lead => 
    lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.zipCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.policy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phoneno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Contractors Management
          </h2>
          <p className="text-gray-600">
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
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
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
                {currentData.map((contractor: ContractorType) => (
                  <tr key={contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#122E5F]">
                        {contractor.fullName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {contractor.phoneno}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#286BBD]">
                        {contractor.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {contractor.businessAddress}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
                        onClick={() => handleViewContractor(contractor)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
                        onClick={() => handleAssignLead(contractor as unknown as LeadType)}
                      >
                        <Target className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {filteredContractors.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredContractors.length)}{" "}
            of {filteredContractors.length} results
            {contractorSearchTerm && (
              <span className="text-[#286BBD] ml-2">
                (filtered from {contractors.length} total)
              </span>
            )}
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
                  currentPage === page
                    ? "bg-[#286BBD] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
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

      {/* No Results Message */}
      {filteredContractors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
          <p className="text-sm text-gray-500">
            {contractorSearchTerm ? `No contractors match "${contractorSearchTerm}"` : "No contractors available"}
          </p>
        </div>
      )}

      {/* View Contractor Modal */}
      {showModal && selectedContractor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Contractor Details
                </h2>
                <p className="text-sm text-gray-600">
                  Complete information for this contractor
                </p>
              </div>

              {/* Contractor Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                    {selectedContractor.fullName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
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
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                    {selectedContractor.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Business Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm flex items-center">
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

                <div className="space-y-3">
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
                            Phone no
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allLeads.slice(0, 3).map((lead: LeadType, index: number) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-bold text-[#122E5F]">
                                  {lead.firstName} {lead.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">
                                  {lead.zipCode}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">
                              <div className="space-y-1 flex items-center">
                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                {lead.phoneno}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-black">
                              <div className="space-y-1 flex items-center">
                                <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                {lead.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {lead.company}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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

      {/* Assign Lead Modal */}
      {showAssignModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[100vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleCloseAssignModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Available Leads
                </h2>
                <p className="text-sm text-gray-600">Select a lead to assign to this contractor</p>
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
                    filteredLeads.map((lead: LeadType) => (
                    <div
                      key={lead.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedLeads.includes(lead.id.toString())}
                            onCheckedChange={() => handleLeadCheckbox(lead.id.toString())}
                          />
                          <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#286BBD]">
                              {lead.firstName.charAt(0).toUpperCase()}{lead.lastName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{lead.firstName} {lead.lastName}</h4>
                            <p className="text-sm text-gray-600">{lead.company} • {lead.zipCode}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-[#286BBD]">{lead.policy}</p>
                              <p className="text-xs text-gray-500">Policy</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-600">{lead.phoneno}</p>
                              <p className="text-xs text-gray-500">Phone</p>
                            </div>
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
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                      <p className="text-sm text-gray-500">
                        {searchTerm ? `No leads match "${searchTerm}"` : "No leads available"}
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
                  Close
                </Button>
                <Button
                  onClick={handleAssignToContractor}
                  disabled={selectedLeads.length === 0}
                  className={`px-4 py-2 text-sm ${
                    selectedLeads.length === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#286BBD] hover:bg-[#1d4ed8] text-white'
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
