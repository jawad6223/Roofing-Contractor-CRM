import React from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  ShoppingCart,
  Eye,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { PurchasedLead, PurchaseForm } from "@/types/DashboardTypes";
import { purchasedLeads } from "./Data";

export const Leads = () => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [purchaseForm, setPurchaseForm] = useState<PurchaseForm>({
    quantity: "1",
    zipCode: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = purchasedLeads.filter(
    (lead) =>
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phoneno.includes(searchTerm) ||
      lead.zipCode.includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.policy.includes(searchTerm) ||
      lead.claimAmount.includes(searchTerm) ||
      lead.damageType.toLowerCase().includes(searchTerm.toLowerCase())
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

  const [selectedLead, setSelectedLead] = useState<PurchasedLead | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState<string>("");
  const [leadStatuses, setLeadStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  const handleViewLead = (lead: PurchasedLead): void => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleCloseViewModal = (): void => {
    setSelectedLead(null);
    setShowViewModal(false);
  };

  const handleOpenLead = (lead: PurchasedLead) => {
    console.log(`Opening lead: ${lead.firstName} ${lead.lastName}`);
    // TODO: Add open lead logic here
  };

  const handleCloseLead = (lead: PurchasedLead) => {
    console.log(`Closing lead: ${lead.firstName} ${lead.lastName}`);
    setLeadStatuses((prev) => ({
      ...prev,
      [lead.id]: "Close",
    }));
  };

  const getLeadTypeColor = (type: string): string => {
    switch (type) {
      case "Basic":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "Premium":
        return "bg-[#286BBD]/10 text-[#286BBD] hover:bg-[#286BBD]/20";
      case "Exclusive":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusBadgeColor = (leadId: string): string => {
    const status = leadStatuses[leadId] || "Open";
    switch (status) {
      case "Open":
        return "bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20";
      case "Close":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-[#286BBD]/5 text-[#286BBD] hover:bg-[#286BBD]/20";
    }
  };

  const getLeadStatus = (leadId: string): string => {
    return leadStatuses[leadId] || "Open";
  };

  const handlePurchaseInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPurchaseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Purchase form data:", purchaseForm);
    // TODO: Add purchase logic here
    setPurchaseQuantity(purchaseForm.quantity);
    setShowPurchaseModal(false);
    setShowSuccessModal(true);
    setPurchaseForm({
      quantity: "1",
      zipCode: "",
    });
  };

  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setPurchaseForm({
      zipCode: "",
      quantity: "50",
    });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setPurchaseQuantity("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  async function handlePurchaseSubmitStripe(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: purchaseForm.quantity,
          leadAmount: 50,
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
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Purchased Leads
          </h2>
          <p className="text-gray-600">
            Manage and track your purchased leads and their progress
          </p>
        </div>
        <Button className="bg-[#122E5F] hover:bg-[#0f2347] text-white">
          <Plus className="h-4 w-4 mr-2" />
          <span onClick={() => setShowPurchaseModal(true)}>
            Add Purchase Leads
          </span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
          />
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
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zip Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
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
                {currentData.length > 0 ? (
                  currentData.map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-black">
                        <span className="text-sm font-medium text-gray-900">
                          {lead.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {lead.zipCode}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-[#122E5F]">
                            {lead.firstName} {lead.lastName}
                          </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Badge className={getStatusBadgeColor(lead.id)}>
                          {getLeadStatus(lead.id)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white cursor-pointer"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewLead(lead as PurchasedLead)
                              }
                              className="cursor-pointer hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 mr-2 text-[#286BBD]" />
                              <span className="text-gray-700">View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleCloseLead(lead as PurchasedLead)
                              }
                              className="cursor-pointer hover:bg-red-50 focus:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              <span className="text-red-700 font-medium">
                                Close
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)}{" "}
          of {filteredData.length} results
          {searchTerm && (
            <span className="text-[#286BBD] ml-2">
              (filtered from {purchasedLeads.length} total)
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

      {/* View Lead Modal */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseViewModal}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Lead Details
                </h2>
                <p className="text-sm text-gray-600">
                  Complete information for this purchased lead
                </p>
              </div>

              {/* Lead Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    ID
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.zipCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.phoneno}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Insurance Company
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.company}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Policy Number
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {selectedLead.policy}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Purchase Date
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                    {new Date(selectedLead.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCloseViewModal}
                  className="px-4 py-2 text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Leads Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleClosePurchaseModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Purchase Premium Leads
                </h2>
              </div>

              {/* Purchase Form */}
              <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Lead Amount *
                    </label>
                    <Input
                      name="leadType"
                      value={50}
                      readOnly
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <Input
                      name="quantity"
                      type="number"
                      min="1"
                      max="50"
                      value={purchaseForm.quantity}
                      onChange={handlePurchaseInputChange}
                      placeholder="1"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Target Zip Code *
                    </label>
                    <Input
                      name="zipCode"
                      value={purchaseForm.zipCode}
                      onChange={handlePurchaseInputChange}
                      placeholder="75201"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Total Price:
                      </span>
                      <span className="font-bold text-[#286BBD] text-lg">
                        $
                        {(
                          parseInt(purchaseForm.quantity || "1") * 50
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClosePurchaseModal}
                    className="px-4 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
                    onClick={handlePurchaseSubmitStripe}
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Purchase Leads
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              {/* Success Message */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Purchase Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you for purchasing {purchaseQuantity} lead
                {purchaseQuantity !== "1" ? "s" : ""}!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Your leads will be available in your dashboard shortly. You will
                receive an email confirmation with the details.
              </p>

              {/* Action Button */}
              <Button
                onClick={handleCloseSuccessModal}
                className="w-full bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
