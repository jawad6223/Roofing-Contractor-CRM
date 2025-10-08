import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, CheckCircle, Calendar, DollarSign, X, Eye } from "lucide-react";
import { LeadsInfo, purchasedLeads } from "./Data";
import { Button } from "@/components/ui/button";
import { leadsInfoType, purchasedLeadType } from "@/types/DashboardTypes";

export const LeadPurchaseInfo = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState<leadsInfoType | null>(null);

  const totalLeads = LeadsInfo.reduce((sum, lead) => sum + lead.noOfLeads, 0);
  const totalPrice = LeadsInfo.reduce((sum, lead) => sum + lead.price * lead.noOfLeads, 0);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Lead Purchase Information</h2>
        <p className="text-gray-600">Overview of your purchased leads and total investment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{totalLeads}</h3>
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
                <h3 className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString()}</h3>
                <p className="text-sm text-gray-600">Total Investment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-auto">
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
                {LeadsInfo.map((lead: leadsInfoType, index: number) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{lead.zipCode}</span>
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
                      <span className="text-sm font-medium text-gray-900">{lead.noOfLeads}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-[#286BBD]">{lead.receivedLeads}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-red-500">{lead.pendingLeads}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white"
                        onClick={() => handleViewLeads(lead)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      {showModal && selectedLeadData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-lg hover:bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 z-50 border border-gray-200"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Lead Details</h2>
                <p className="text-sm text-gray-600">
                  Zip Code: {selectedLeadData.zipCode} | Date: {selectedLeadData.date}
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="overflow-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Insurance Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Policy Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getLeadsForZipCode(selectedLeadData.zipCode).map((lead: purchasedLeadType, index: number) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-bold text-[#122E5F]">
                                {lead.firstName} {lead.lastName}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{lead.phoneno}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{lead.email}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{lead.location}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{lead.company}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{lead.policy}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button onClick={handleCloseModal} className="px-6 py-2 bg-[#286BBD] hover:bg-[#1d4ed8] text-white">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
