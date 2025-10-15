import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, CheckCircle, Calendar, DollarSign, X, Eye, FileText, MapPin, Phone, Mail, Hash, Search, Building, } from "lucide-react";
import { LeadsInfo, purchasedLeads } from "./Data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadsInfoType, purchasedLeadType } from "@/types/DashboardTypes";
import { Pagination } from "@/components/ui/pagination";
import { TablePopup } from "@/components/ui/TablePopup";

export const LeadPurchaseInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState<leadsInfoType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const itemsPerPage = 10;

  const totalLeads = LeadsInfo.reduce((sum, lead) => sum + lead.noOfLeads, 0);
  const totalPrice = LeadsInfo.reduce(
    (sum, lead) => sum + lead.price * lead.noOfLeads,
    0
  );

  const filteredLeads = LeadsInfo.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.zipCode.toLowerCase().includes(searchLower) ||
      lead.date.toLowerCase().includes(searchLower) ||
      lead.price.toString().includes(searchTerm) ||
      lead.noOfLeads.toString().includes(searchTerm) ||
      lead.receivedLeads.toString().includes(searchTerm) ||
      lead.pendingLeads.toString().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredLeads.slice(startIndex, endIndex);

  const handleViewLeads = (lead: leadsInfoType) => {
    setSelectedLeadData(lead);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLeadData(null);
  };

  const getLeadsForZipCode = (zipCode: string) => {
    return purchasedLeads.filter((lead) => lead.zipCode === zipCode);
  };

  // Define columns for lead details table
  const leadDetailsColumns = [
    { key: "name", label: "Name" },
    { key: "phoneno", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "company", label: "Insurance Company" },
    { key: "policy", label: "Policy Number" },
  ];

  // Get filtered leads for modal with search
  const getFilteredLeadsForModal = (zipCode: string) => {
    const leads = getLeadsForZipCode(zipCode);
    if (!modalSearchTerm) return leads;
    
    const searchLower = modalSearchTerm.toLowerCase();
    return leads.filter((lead) =>
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.phoneno.includes(modalSearchTerm) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.location.toLowerCase().includes(searchLower) ||
      lead.company.toLowerCase().includes(searchLower) ||
      lead.policy.includes(modalSearchTerm)
    );
  };

  // Transform leads data for table
  const getLeadDetailsTableData = (zipCode: string) => {
    return getFilteredLeadsForModal(zipCode).map(lead => ({
      ...lead,
      name: `${lead.firstName} ${lead.lastName}`
    }));
  };

  // Custom render function for lead details table
  const renderLeadDetailsCell = (column: any, row: any, index: number) => {
    switch (column.key) {
      case "name":
        return (
          <span className="text-sm font-bold text-[#122E5F]">
            {row.name}
          </span>
        );
      case "phoneno":
        return (
          <span className="text-sm text-gray-900 flex items-center">
            <Phone className="h-3 w-3 text-gray-400 mr-1" />
            {row.phoneno}
          </span>
        );
      case "email":
        return (
          <span className="text-sm text-gray-900 flex items-center">
            <Mail className="h-3 w-3 text-gray-400 mr-1" />
            {row.email}
          </span>
        );
      case "location":
        return (
          <span className="text-sm text-gray-900 flex items-center">
            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
            {row.location}
          </span>
        );
      case "company":
        return (
          <span className="text-sm text-gray-900 flex items-center">
            <Building className="h-3 w-3 text-gray-400 mr-1" />
            {row.company}
          </span>
        );
      case "policy":
        return (
          <span className="text-sm text-gray-900 flex items-center">
            <Hash className="h-3 w-3 text-gray-400 mr-1" />
            {row.policy}
          </span>
        );
      default:
        return <span className="text-sm text-gray-900">{row[column.key]}</span>;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Lead Purchase Information
        </h2>
        <p className="text-gray-600">
          Overview of your purchased leads and total investment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalLeads}
                </h3>
                <p className="text-sm text-gray-600">Total Leads Purchased</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">Total Investment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-auto">
            <div className="transition-all duration-300 ease-in-out">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zip Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. of Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending Leads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.length > 0 ? (
                    currentData.map((lead: leadsInfoType, index: number) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {lead.zipCode}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            {lead.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                            {lead.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-gray-900">
                            {lead.noOfLeads}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-[#286BBD]">
                            {lead.receivedLeads}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-red-500">
                            {lead.pendingLeads}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                            onClick={() => handleViewLeads(lead)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Search className="h-12 w-12 text-gray-300" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              No results found
                            </p>
                            <p className="text-sm text-gray-500">
                              {searchTerm
                                ? `No leads match "${searchTerm}"`
                                : "No leads available"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredLeads.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {/* Lead Details Modal */}
      {/* Lead Details Table Popup */}
      <TablePopup
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Lead Details"
        subtitle={selectedLeadData ? `Zip Code: ${selectedLeadData.zipCode} | Date: ${selectedLeadData.date}` : "Lead information"}
        titleIcon={FileText}
        columns={leadDetailsColumns}
        data={selectedLeadData ? getLeadDetailsTableData(selectedLeadData.zipCode) : []}
        searchTerm={modalSearchTerm}
        onSearchChange={setModalSearchTerm}
        searchPlaceholder="Search leads..."
        itemsPerPage={10}
        showPagination={true}
        closeButtonText="Close"
        closeButtonClassName="px-3 py-1.5 text-sm"
        renderCell={renderLeadDetailsCell}
      />
    </div>
  );
};