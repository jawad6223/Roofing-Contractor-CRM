import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, CheckCircle, Calendar, DollarSign, X, Eye, FileText, MapPin, Phone, Mail, Hash, Search, Building, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leadsInfoType } from "@/types/DashboardTypes";
import { Pagination } from "@/components/ui/pagination";
import { TablePopup } from "@/components/ui/TablePopup";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

export const LeadPurchaseInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState<leadsInfoType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [leadsInfo, setLeadsInfo] = useState<any[]>([]);
  const [assignedLeads, setAssignedLeads] = useState<any[]>([]);
  const itemsPerPage = 10;

  useEffect(()=>{
    const fetchRequestLeads= async() => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          toast.error("User not logged in");
          return;
        }
        const userId = authData.user.id;
  
        const { data, error } = await supabase
          .from("Leads_Request")
          .select("*")
          .eq("contractor_id", userId)
          .order("created_at", { ascending: false });
  
        if (error) throw error;
  
        setLeadsInfo(data || []);
      } catch (error) {
        console.error("Error fetching contractor leads:", error);
        toast.error("Failed to fetch leads");
      }
    };
    fetchRequestLeads();
  }, []);

  const totalLeads = leadsInfo.reduce((sum, lead) => sum + (lead["No. of Leads"]), 0);
  const totalPrice = leadsInfo.reduce((sum, lead) => sum + (lead["Price"]) * (lead["No. of Leads"]), 0);

  const filteredLeads = leadsInfo.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead["Business Address"].toLowerCase().includes(searchLower) ||
      lead["Purchase Date"].toLowerCase().includes(searchLower) ||
      lead["Price"].toString().includes(searchTerm) ||
      lead["No. of Leads"].toString().includes(searchTerm) ||
      lead["Send Leads"].toString().includes(searchTerm) ||
      lead["Pending Leads"].toString().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredLeads.slice(startIndex, endIndex);

  const handleViewLeads = async (lead: leadsInfoType) => {
    setSelectedLeadData(lead);
    
    try {
      const { data: assignedLeadsData, error } = await supabase
        .from("Assigned_Leads")
        .select("*")
        .eq("request_id", lead.id)
        .order("Assigned Date", { ascending: false });

      if (error) {
        console.error("Error fetching assigned leads:", error);
        toast.error("Failed to fetch assigned leads");
        return;
      }

      const transformedLeads = assignedLeadsData.map(lead => ({
        id: lead.id,
        firstName: lead["First Name"],
        lastName: lead["Last Name"],
        phoneno: lead["Phone Number"],
        email: lead["Email Address"],
        location: lead["Property Address"],
        company: lead["Insurance Company"],
        policy: lead["Policy Number"]
      }));

      setAssignedLeads(transformedLeads);
      setShowModal(true);
    } catch (error) {
      console.error("Error in handleViewLeads:", error);
      toast.error("Failed to load assigned leads");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLeadData(null);
    setAssignedLeads([]);
    setModalSearchTerm("");
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
  const getFilteredLeadsForModal = () => {
    if (!modalSearchTerm) return assignedLeads;
    
    const searchLower = modalSearchTerm.toLowerCase();
    return assignedLeads.filter((lead: any) =>
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
  const getLeadDetailsTableData = () => {
    return getFilteredLeadsForModal().map(lead => ({
      ...lead,
      name: `${lead.firstName} ${lead.lastName}`
    }));
  };

  // Custom render function for lead details table
  const renderLeadDetailsCell = (column: any, row: any) => {
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
                      Business Address
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
                    currentData.map((lead: leadsInfoType) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {lead["Business Address"]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            {lead["Purchase Date"]}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                            {lead["Price"] * (lead["No. of Leads"])}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-gray-900">
                            {lead["No. of Leads"]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-[#286BBD]">
                            {lead["Send Leads"]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm text-red-500">
                            {lead["Pending Leads"]}
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

      {/* Lead Details Table Popup */}
      <TablePopup
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Lead Details"
        subtitle={selectedLeadData ? `Request ID: ${selectedLeadData.id} | Date: ${selectedLeadData["Purchase Date"]}` : "Lead information"}
        titleIcon={FileText}
        columns={leadDetailsColumns}
        data={getLeadDetailsTableData()}
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