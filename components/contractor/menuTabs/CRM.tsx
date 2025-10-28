import React, { useEffect, useState } from "react";
import { MapPin, Eye, Phone, Mail, FileText, Building, Search, UserPlus, Hash, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DetailPopup } from "@/components/ui/DetailPopup";
import { FormPopup } from "@/components/ui/FormPopup";
import { Pagination } from "@/components/ui/pagination";
import { crmDataType } from "@/types/DashboardTypes";
import { toast } from "react-toastify";
import { FormField } from "@/types/Types";
import { supabase } from "@/lib/supabase";
import { crmMemberSchema } from "@/validations/contractor/schema";

export const CRM = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLead, setSelectedLead] = useState<crmDataType>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [crmLeads, setCRMLeads] = useState<crmDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  // Filter data based on search term
  const filteredData = crmLeads.filter(
    (lead) =>
      lead["status"] === "close" &&
      (lead["First Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead["Email Address"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lead["Phone Number"]?.includes(searchTerm) ||
        lead["Property Address"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead["Insurance Company"]
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lead["Policy Number"]?.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const leadFields = selectedLead
    ? [
        {
          label: "First Name",
          value: selectedLead["First Name"],
          icon: User,
        },
        {
          label: "Last Name",
          value: selectedLead["Last Name"],
          icon: User,
        },
        {
          label: "Phone",
          value: selectedLead["Phone Number"],
          icon: Phone,
        },
        {
          label: "Email",
          value: selectedLead["Email Address"],
          icon: Mail,
          breakAll: true,
        },
        {
          label: "Property Address",
          value: selectedLead["Property Address"],
          icon: MapPin,
        },
        {
          label: "Insurance Company",
          value: selectedLead["Insurance Company"],
          icon: Building,
          whitespaceNowrap: true,
        },
        {
          label: "Policy Number",
          value: selectedLead["Policy Number"],
          icon: Hash,
        },
      ]
    : [];

  const addMemberFields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "John",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      required: true,
    },
    {
      name: "phoneno",
      label: "Phone Number",
      type: "tel",
      placeholder: "(555) 123-4567",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@company.com",
      required: true,
    },
    {
      name: "propertyAddress",
      label: "Property Address",
      type: "text",
      placeholder: "Start typing your business address...",
      required: true,
      maxLength: 5,
    },
    {
      name: "insuranceCompany",
      label: "Insurance Company",
      type: "text",
      placeholder: "State Farm",
      required: true,
    },
    {
      name: "policy",
      label: "Policy Number",
      type: "text",
      placeholder: "SF123456789",
      required: true,
    },
  ];

  const fetchCRMLeads = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const { data, error } = await supabase
        .from("Contractor_Leads")
        .select("*")
        .eq("contractor_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCRMLeads(data || []);
    } catch (error) {
      console.error("Error fetching contractor leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCRMLeads();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        return;
      }
      const userId = authData.user.id;

      const { error } = await supabase.from("Contractor_Leads").insert({
        contractor_id: userId,
        "First Name": formData.firstName,
        "Last Name": formData.lastName,
        "Phone Number": formData.phoneno,
        "Email Address": formData.email,
        "Property Address": formData.propertyAddress,
        "Insurance Company": formData.insuranceCompany,
        "Policy Number": formData.policy,
        status: "close",
        "Latitude": formData.latitude,
        "Longitude": formData.longitude,
      });

      if (error) throw error;

      toast.success("Member added successfully");
      handleCloseAddMemberModal();
      fetchCRMLeads();
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    }
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
            className="bg-[#122E5F] hover:bg-[#183B7A]/80 text-white mt-4 md:mt-0 hover:text-white w-full md:w-auto"
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
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                        <p className="mt-2 text-sm text-gray-500">
                          Loading leads...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-[#122E5F]">
                          {lead["First Name"]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {lead["Phone Number"]}
                        </span>
                        <span className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {lead["Email Address"]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {lead["Property Address"]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
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
                          <p className="text-lg font-medium text-gray-900">
                            No leads found
                          </p>
                          <p className="text-sm text-gray-500">
                            {searchTerm
                              ? `No results for "${searchTerm}". Try adjusting your search terms.`
                              : "No leads available."}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {/* Lead Details Modal */}
      <DetailPopup
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Lead Details"
        subtitle="Complete information for this lead"
        titleIcon={FileText}
        fields={leadFields}
      />

      {/* Add Member Modal */}
      <FormPopup
        isOpen={showAddMemberModal}
        onClose={handleCloseAddMemberModal}
        title="Add Member"
        subtitle="Add a new member to your CRM team"
        titleIcon={UserPlus}
        submitButtonText="Add Member"
        submitButtonIcon={UserPlus}
        onSubmit={handleFormSubmit}
        validationSchema={crmMemberSchema}
        fields={addMemberFields as FormField[]}
      />
    </div>
  );
};
