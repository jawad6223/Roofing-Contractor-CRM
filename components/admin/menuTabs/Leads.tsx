import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Target, Plus, Download, Eye, ChevronDown, X, UserPlus, ChevronLeft, ChevronRight, Check, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { contractors } from './Data'
import { Lead } from '@/types/AdminTypes'
import {allLeads} from './Data'
import * as XLSX from 'xlsx'

export const Leads = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [leadToAssign, setLeadToAssign] = useState<Lead | null>(null);
    const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
    const [newLead, setNewLead] = useState({
      firstName: '',
      lastName: '',
      phoneno: '',
      email: '',
      zipCode: '',
      company: '',
      policy: '',
      status: 'Available'
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    

    // Filter leads based on search term and status
    const filteredLeads = allLeads.filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        lead.zipCode.toLowerCase().includes(searchLower) ||
        lead.firstName.toLowerCase().includes(searchLower) ||
        lead.lastName.toLowerCase().includes(searchLower) ||
        lead.phoneno.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.policy.includes(searchTerm)
      );
      
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredLeads.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Reset to first page when filters change
    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleViewLead = (lead: Lead): void => {
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
        firstName: '',
        lastName: '',
        phoneno: '',
        email: '',
        zipCode: '',
        company: '',
        policy: '',
        status: 'Available'
      });
    };

    const handleAssignLead = (lead: Lead) => {
      setLeadToAssign(lead);
      setShowAssignModal(true);
    };

    const handleCloseAssignModal = () => {
      setShowAssignModal(false);
      setLeadToAssign(null);
      setSelectedContractors([]);
    };

    const handleContractorCheckbox = (contractorId: string) => {
      setSelectedContractors(prev => 
        prev.includes(contractorId) 
          ? prev.filter(id => id !== contractorId)
          : [...prev, contractorId]
      );
    };

    const handleSelectContractors = () => {
      if (selectedContractors.length > 0 && leadToAssign) {
        console.log(`Assigning lead ${leadToAssign.id} to contractors:`, selectedContractors);
        // TODO: Add assignment logic here
        handleCloseAssignModal();
      }
    };

    const handleExportToExcel = () => {
      try {
        // Prepare data for Excel export
        const exportData = filteredLeads.map(lead => ({
          'First Name': lead.firstName,
          'Last Name': lead.lastName,
          'Phone Number': lead.phoneno,
          'Email': lead.email,
          'Zip Code': lead.zipCode,
          'Insurance Company': lead.company,
          'Policy Number': lead.policy,
          'Status': lead.status,
          'Assigned To': lead.assignedTo || 'Unassigned'
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Set column widths for better formatting
        const columnWidths = [
          { wch: 15 }, // First Name
          { wch: 15 }, // Last Name
          { wch: 15 }, // Phone Number
          { wch: 25 }, // Email
          { wch: 10 }, // Zip Code
          { wch: 20 }, // Insurance Company
          { wch: 15 }, // Policy Number
          { wch: 12 }, // Status
          { wch: 20 }  // Assigned To
        ];
        worksheet['!cols'] = columnWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `leads_export_${currentDate}.xlsx`;

        // Download the file
        XLSX.writeFile(workbook, filename);
        
        // Show success message (optional)
        console.log(`Excel file "${filename}" downloaded successfully!`);
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Error exporting data to Excel. Please try again.');
      }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewLead(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmitLead = (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Add lead submission logic here
      console.log('New lead data:', newLead);
      handleCloseAddModal();
    };

    return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-[#286BBD] text-[#286BBD] px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[#286BBD] focus:border-transparent min-w-[140px]"
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#286BBD] h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.length > 0 ? (
                        currentData.map((lead, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#122E5F]">{lead.firstName}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{lead.phoneno}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className="text-sm text-gray-900">{lead.policy}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Badge className='bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20'>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
                              onClick={() => handleViewLead(lead)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
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
                                   : 'Try adjusting your search terms'}
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
                          currentPage === page 
                            ? 'bg-[#286BBD] text-white' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
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
            {(searchTerm || statusFilter !== "All") && (
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
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
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
            </div>

            {/* View Lead Modal */}
            {showModal && selectedLead && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
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
                        <Eye className="h-6 w-6 text-[#286BBD]" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Lead Details
                      </h2>
                      <p className="text-sm text-gray-600">Complete information for this lead</p>
                    </div>

                    {/* Lead Information */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            First Name
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.firstName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Last Name
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.lastName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.phoneno}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Zip Code
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.zipCode}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Insurance Company
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.company}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Policy Number
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.policy}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Status
                          </label>
                          <div className="bg-gray-50 p-1.5 rounded-md">
                            <Badge className='bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20'>
                              {selectedLead.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Assigned To
                          </label>
                          <p className="text-gray-900 bg-gray-50 p-1.5 rounded-md text-sm">
                            {selectedLead.assignedTo || "Unassigned"}
                          </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-4 pt-3 border-t border-gray-200">
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

            {/* Add Lead Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
                  {/* Close Button */}
                  <button
                    onClick={handleCloseAddModal}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UserPlus className="h-6 w-6 text-[#286BBD]" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Add New Lead
                      </h2>
                      <p className="text-sm text-gray-600">Enter lead information to add to the system</p>
                    </div>

                    {/* Add Lead Form */}
                    <form onSubmit={handleSubmitLead} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            First Name *
                          </label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Last Name *
                          </label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Phone Number *
                          </label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address *
                          </label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Zip Code *
                          </label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Insurance Company *
                          </label>
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Policy Number *
                          </label>
                          <Input
                            name="policy"
                            value={newLead.policy}
                            onChange={handleInputChange}
                            placeholder="POL123456789"
                            required
                            className="h-9 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            value={newLead.status}
                            onChange={handleInputChange}
                            className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
                          >
                            <option value="Available">Available</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseAddModal}
                          className="px-4 py-2 text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="px-4 py-2 text-sm bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
                        >
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
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative animate-in zoom-in-95 duration-300">
                  {/* Close Button */}
                  <button
                    onClick={handleCloseAssignModal}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center flex-1">
                        <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Target className="h-6 w-6 text-[#286BBD]" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          Assign Lead to Contractor
                        </h2>
                        <p className="text-sm text-gray-600">
                          Select contractors to assign lead: <span className="font-semibold text-[#286BBD]">{leadToAssign.firstName} {leadToAssign.lastName}</span>
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button
                          onClick={handleSelectContractors}
                          disabled={selectedContractors.length === 0}
                          className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Select ({selectedContractors.length})
                        </Button>
                      </div>
                    </div>

                    {/* Contractors List */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {contractors.map((contractor) => (
                          <div
                            key={contractor.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-[#286BBD]/50"
                          >
                            <div className="flex items-center space-x-4">
                              <Checkbox
                                checked={selectedContractors.includes(contractor.id)}
                                onCheckedChange={() => handleContractorCheckbox(contractor.id)}
                                className="data-[state=checked]:bg-[#286BBD] data-[state=checked]:border-[#286BBD]"
                              />
                              <div className="w-10 h-10 bg-[#286BBD]/10 rounded-full flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-[#286BBD]" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                                <p className="text-sm text-gray-600">{contractor.company}</p>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {contractor.location}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium text-[#286BBD]">{contractor.conversionRate}</p>
                                  <p className="text-xs text-gray-500">Conversion Rate</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-600">{contractor.leadsCompleted}</p>
                                  <p className="text-xs text-gray-500">Completed</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900">{contractor.totalEarnings}</p>
                                  <p className="text-xs text-gray-500">Total Earnings</p>
                                </div>
                                <div className="flex items-center">
                                  <Badge className={`${
                                    contractor.status === 'Active' ? 'bg-green-100 text-green-800' :
                                    contractor.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {contractor.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
                    </div>
                  </div>
                </div>
              </div>
            )}
    </div>
    )
}