import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Plus, Download, Eye, ChevronDown, X, UserPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Lead } from '@/types/AdminTypes'
import {allLeads} from './Data'
import * as XLSX from 'xlsx'

export const Leads = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
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
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead, index) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
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
    </div>
    )
}