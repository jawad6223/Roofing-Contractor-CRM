import React, { useState } from "react";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Phone,
  Mail,
  FileText,
  Building,
  Search,
  UserPlus,
  Hash,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { crmDataType } from "@/types/DashboardTypes";
import { crmData } from "./Data";
import { toast } from "react-toastify";

export const CRM = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLead, setSelectedLead] = useState<crmDataType>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newMember, setNewMember] = useState<crmDataType>({
    name: '',
    phoneno: '',
    email: '',
    location: '',
    insuranceCompany: '',
    policy: ''
  });
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = crmData.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phoneno.includes(searchTerm) ||
    lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.insuranceCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.policy.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
    setNewMember({
      name: '',
      phoneno: '',
      email: '',
      location: '',
      insuranceCompany: '',
      policy: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phoneno') {
      const phoneNumber = value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (phoneNumber.length === 0) {
        formattedValue = '';
      } else if (phoneNumber.length <= 3) {
        formattedValue = `(${phoneNumber}`;
      } else if (phoneNumber.length <= 6) {
        formattedValue = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        formattedValue = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
      
      setNewMember(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setNewMember(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New member data:', newMember);
    toast.success("Member added successfully");
    handleCloseAddMemberModal();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Relationship Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            CRM turns customer data into meaningful business insights
          </p>
        </div>
        
        <div className="md:flex-shrink-0 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#122E5F] hover:bg-[#183B7A] text-white mt-4 md:mt-0 hover:text-white w-full md:w-auto"
            onClick={handleAddMember}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Members
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
          />
        </div>
      </div>

      {/* CRM Table */}
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
                    Phone No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.length > 0 ? (
                  currentData.map((lead, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#122E5F]">
                        {lead.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {lead.phoneno}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {lead.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {lead.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Search className="h-12 w-12 text-gray-300" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">No leads found</p>
                          <p className="text-sm text-gray-500">
                            {searchTerm 
                              ? `No results for "${searchTerm}". Try adjusting your search terms.`
                              : 'No leads available.'}
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{" "}
          {filteredData.length} results
          {searchTerm && (
            <span className="text-[#286BBD] ml-2">
              (filtered from {crmData.length} total)
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

      {/* Summary Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-[#286BBD] mb-2">5</div>
            <div className="text-sm text-gray-600">Total Closed</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              $186,000
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              $37,200
            </div>
            <div className="text-sm text-gray-600">Avg. Deal Size</div>
          </CardContent>
        </Card>
      </div> */}

      {/* Lead Details Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 relative animate-in zoom-in-95 duration-300">
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
                <p className="text-sm text-gray-600">Complete information for this lead</p>
              </div>

              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm flex items-center">
                    <User className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead.phoneno}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md break-all text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm whitespace-nowrap font-semibold text-gray-700 mb-1">
                    Insurance Company
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm flex items-center">
                    <Building className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead.insuranceCompany}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Policy Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm flex items-center">
                    <Hash className="h-3 w-3 mr-1 text-gray-400" />
                    {selectedLead.policy}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
            <button
              onClick={handleCloseAddMemberModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#122E5F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-[#122E5F]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Add Member
                </h2>
                <p className="text-sm text-gray-600">Add a new member to your CRM team</p>
              </div>

              <form onSubmit={handleSubmitMember} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={newMember.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      required
                      className="h-10 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <Input
                      name="phoneno"
                      type="text"
                      value={newMember.phoneno}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      required
                      className="h-10 text-sm"
                      maxLength={14}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={newMember.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      required
                      className="h-10 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location *
                    </label>
                    <Input
                      name="location"
                      value={newMember.location}
                      onChange={handleInputChange}
                      placeholder="Houston, TX"
                      required
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Insurance Company *
                    </label>
                    <Input
                      name="insuranceCompany"
                      value={newMember.insuranceCompany}
                      onChange={handleInputChange}
                      placeholder="State Farm"
                      required
                      className="h-10 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Policy Number *
                    </label>
                    <Input
                      name="policy"
                      value={newMember.policy}
                      onChange={handleInputChange}
                      placeholder="SF123456789"
                      required
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseAddMemberModal}
                    className="px-4 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#122E5F] hover:bg-[#0f2347] text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Member
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
