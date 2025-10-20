import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Plus, X, ShoppingCart, Eye, MapPin, Phone, Mail, ChevronDown, Calendar, Hash, User, Search, Info, FileText, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { DetailPopup } from "@/components/ui/DetailPopup";
import { useState } from "react";
import { purchasedLeadType, sampleLeadType } from "@/types/DashboardTypes";
import { purchasedLeads, sampleLeads } from "./Data";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

export const Leads = () => {
  const router = useRouter();
  
  const [contractorLeads, setContractorLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("Contractor_Leads")
        .update({ status: status })
        .eq("id", leadId);

      if (error) throw error;

      setContractorLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: status } : lead
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const fetchContractorLeads = async () => {
    setLoading(true);
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

      setContractorLeads(data || []);
    } catch (error) {
      console.error("Error fetching contractor leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractorLeads();
  }, []);

  const [loadingLeads, setLoadingLeads] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const itemsPerPage = 10;
  // Filter data based on search term and status
  const filteredData = contractorLeads.filter((lead) => {
    const leadStatus = lead["status"];
    
    if (leadStatus === "close") {
      return false;
    }

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (lead["First Name"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Last Name"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Email Address"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Phone Number"] || "").includes(searchTerm) ||
      (lead["Zip Code"] || "").includes(searchTerm) ||
      (lead["Insurance Company"]?.toLowerCase() || "").includes(searchLower) ||
      (lead["Policy Number"] || "").includes(searchTerm);

    const matchesStatus = statusFilter === "All" || leadStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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

  const [selectedLead, setSelectedLead] = useState<purchasedLeadType | null>(null);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);

  const handleViewLead = (lead: purchasedLeadType): void => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleCloseViewModal = (): void => {
    setSelectedLead(null);
    setShowViewModal(false);
  };

  const leadFields = selectedLead ? [
    {
      label: "Name",
      value: `${selectedLead["First Name"]} ${selectedLead["Last Name"]}`,
      icon: User
    },
    {
      label: "Zip Code",
      value: selectedLead["Zip Code"],
      icon: MapPin
    },
    {
      label: "Phone Number",
      value: selectedLead["Phone Number"],
      icon: Phone
    },
    {
      label: "Email Address",
      value: selectedLead["Email Address"],
      icon: Mail,
      breakAll: true
    },
    // {
    //   label: "Location",
    //   value: selectedLead["Location"],
    //   icon: MapPin
    // },
    {
      label: "Insurance Company",
      value: selectedLead["Insurance Company"],
      icon: Building
    },
    {
      label: "Policy Number",
      value: selectedLead["Policy Number"],
      icon: Hash
    },
    {
      label: "Purchase Date",
      value: new Date(selectedLead["Purchase Date"]).toLocaleDateString(),
      icon: Calendar
    }
  ] : [];

  async function handleBuyNow(lead: sampleLeadType) {
    // Add this lead to loading set
    setLoadingLeads((prev) => new Set(prev).add(lead.id));

    try {
      const response = await fetch("/api/create-single-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // leadAmount: lead.price,
          leadAmount: 50,
          leadName: `${lead.firstName} ${lead.lastName}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout error:", errorData.error);
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      // Remove this lead from loading set
      setLoadingLeads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lead.id);
        return newSet;
      });
    }
  }



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Purchased Leads</h2>
          <p className="text-gray-600">Manage and track your purchased leads and their progress</p>
        </div>
        <div className="flex flex-col w-full lg:w-auto md:flex-row gap-3">
          <Button
            onClick={() => router.push("/contractor/purchase-leads")}
            className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Purchase Leads</span>
          </Button>
          <Button
            onClick={() => router.push("/contractor/lead-purchase-info")}
            className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
          >
            <Info className="h-4 w-4 mr-2" />
            <span>Lead Purchase Info</span>
          </Button>
        </div>
      </div>

      {/* Search Bar and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 w-full focus:ring-2 focus:ring-[#286BBD] focus:border-transparent min-w-[140px]"
            aria-label="Select status"
          >
            <option value="All">All Status</option>
            <option value="open">Open</option>
            <option value="hot">Hot Lead</option>
            <option value="warm">Warm Lead</option>
            <option value="cold">Cold Lead</option>
            <option value="close">Close</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

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
                    Phone no
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
                {/* Sample Leads - Blurred Preview */}
                {sampleLeads.map((lead: sampleLeadType) => (
                  <tr key={lead.id} className={`border-l-4`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-bold text-gray-400 select-none">
                          {`${lead.firstName?.slice(0, 2) || ""}${"*".repeat(
                            Math.max((lead.firstName?.length || 0) - 2, 0)
                          )} ${lead.lastName?.slice(0, 2) || ""}${"*".repeat(Math.max((lead.lastName?.length || 0) - 2, 0))}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-400 select-none">{`${lead.zipCode?.slice(
                          0,
                          2
                        ) || ""}${"*".repeat(Math.max((lead.zipCode?.length || 0) - 2, 0))}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400 select-none">{`${lead.phone.slice(0, 2)}${"*".repeat(
                          Math.max(lead.phone.length - 2, 0)
                        )}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400 select-none">{`${lead.email?.slice(0, 2) || ""}${"*".repeat(
                          Math.max((lead.email?.length || 0) - 2, 0)
                        )}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" colSpan={2}>
                      <div className="flex items-center justify-center space-x-2">
                        {/* <span className={`text-sm font-bold`}>${lead.price}</span> */}
                        <Button
                          disabled={loadingLeads.has(lead.id)}
                          size="sm"
                          className={`text-white bg-[#122E5F] hover:bg-[#0f2347]/80 text-xs px-3 py-1`}
                          onClick={() => handleBuyNow(lead)}
                        >
                          {loadingLeads.has(lead.id) ? (
                            "Processing..."
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Buy Now
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading leads...</p>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((lead: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-[#122E5F]">
                            {lead["First Name"]} {lead["Last Name"]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{lead["Zip Code"]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-black">
                        <div className="space-y-1 flex items-center">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          {lead["Phone Number"]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-black">
                        <div className="space-y-1 flex items-center">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          {lead["Email Address"]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Select
                          value={lead["status"] || "open"}
                          onValueChange={(val) => handleStatusChange(lead["id"], val)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open" disabled>Open</SelectItem>
                            <SelectItem value="hot">Hot Lead</SelectItem>
                            <SelectItem value="warm">Warm Lead</SelectItem>
                            <SelectItem value="cold">Cold Lead</SelectItem>
                            <SelectItem value="close">Close</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Search className="h-12 w-12 text-gray-300" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">No leads found</p>
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

      {/* View Lead Modal */}
      <DetailPopup
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title="Lead Details"
        subtitle="Complete information for this purchased lead"
        titleIcon={FileText}
        fields={leadFields}
      />
    </div>
  );
};