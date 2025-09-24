import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X, ShoppingCart, Eye, MapPin, Phone, Mail, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { PurchasedLead, PurchaseForm } from '@/types/DashboardTypes'
import { purchasedLeads } from './Data'

export const Leads = () => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseForm, setPurchaseForm] = useState<PurchaseForm>({
      leadType: 'premium',
      quantity: '1',
      zipCode: '',
      maxBudget: '',
      notes: ''
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(purchasedLeads.length / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = purchasedLeads.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const [selectedLead, setSelectedLead] = useState<PurchasedLead | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [purchaseQuantity, setPurchaseQuantity] = useState<string>('');

    const handleViewLead = (lead: PurchasedLead): void => {
      setSelectedLead(lead);
      setShowViewModal(true);
    };

    const handleCloseViewModal = (): void => {
      setSelectedLead(null);
      setShowViewModal(false);
    };

    const getLeadTypeColor = (type: string): string => {
      switch (type) {
        case 'Basic': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        case 'Premium': return 'bg-[#286BBD]/10 text-[#286BBD] hover:bg-[#286BBD]/20';
        case 'Exclusive': return 'bg-green-100 text-green-800 hover:bg-green-200';
        default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      }
    };

    const handlePurchaseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setPurchaseForm(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handlePurchaseSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Purchase form data:', purchaseForm);
      // TODO: Add purchase logic here
      setPurchaseQuantity(purchaseForm.quantity);
      setShowPurchaseModal(false);
      setShowSuccessModal(true);
      setPurchaseForm({
        leadType: 'premium',
        quantity: '1',
        zipCode: '',
        maxBudget: '',
        notes: ''
      });
    };

    const handleClosePurchaseModal = () => {
      setShowPurchaseModal(false);
      setPurchaseForm({
        leadType: 'premium',
        quantity: '1',
        zipCode: '',
        maxBudget: '',
        notes: ''
      });
    };

    const handleCloseSuccessModal = () => {
      setShowSuccessModal(false);
      setPurchaseQuantity('');
    };

  return (
    <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Purchased Leads</h2>
                <p className="text-gray-600">Manage and track your purchased leads and their progress</p>
              </div>
              <Button className="bg-[#122E5F] hover:bg-[#0f2347] text-white">
                <Plus className="h-4 w-4 mr-2" />
                <span onClick={() => setShowPurchaseModal(true)}>Add Purchase Leads</span>
              </Button>
            </div>
      
            {/* Leads Table */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zip Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homeowner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((lead, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{lead.zipCode}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-bold text-[#122E5F]">{lead.firstName} {lead.lastName}</div>
                              <div className="text-xs text-gray-500">{lead.damageType}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                {lead.phoneno}
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                {lead.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#286BBD]">{lead.claimAmount}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Badge className={`${getLeadTypeColor(lead.leadType)}`}>
                              {lead.leadType}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, purchasedLeads.length)} of {purchasedLeads.length} results
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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-[#286BBD] mb-2">{purchasedLeads.length}</div>
                  <div className="text-sm text-gray-600">Total Leads</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    ${purchasedLeads.reduce((sum, lead) => sum + parseInt(lead.claimAmount.replace(/[$,]/g, '')), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {purchasedLeads.filter(lead => lead.status === 'New').length}
                  </div>
                  <div className="text-sm text-gray-600">New Leads</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {purchasedLeads.filter(lead => lead.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
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
                    <p className="text-sm text-gray-600">Complete information for this purchased lead</p>
                  </div>

                  {/* Lead Information */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Lead ID
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                        {selectedLead.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Lead Type
                      </label>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <Badge className={getLeadTypeColor(selectedLead.leadType)}>
                          {selectedLead.leadType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Homeowner Name
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
                        {selectedLead.zipCode}
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
                        Damage Type
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded-md text-sm">
                        {selectedLead.damageType}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Claim Amount
                      </label>
                      <p className="text-[#286BBD] bg-gray-50 p-2 rounded-md text-sm font-bold">
                        {selectedLead.claimAmount}
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
                      <p className="text-sm text-gray-600">Select your lead preferences and purchase high-quality leads</p>
                    </div>

                    {/* Purchase Form */}
                    <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Lead Type *
                          </label>
                          <select
                            name="leadType"
                            value={purchaseForm.leadType}
                            onChange={handlePurchaseInputChange}
                            className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
                            required
                          >
                            <option value="basic">Basic - $45/lead</option>
                            <option value="premium">Premium - $89/lead</option>
                            <option value="exclusive">Exclusive - $149/lead</option>
                          </select>
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
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Max Budget per Lead
                          </label>
                          <Input
                            name="maxBudget"
                            value={purchaseForm.maxBudget}
                            onChange={handlePurchaseInputChange}
                            placeholder="$50,000"
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Special Requirements
                        </label>
                        <textarea
                          name="notes"
                          value={purchaseForm.notes}
                          onChange={handlePurchaseInputChange}
                          placeholder="Any specific requirements or preferences..."
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#286BBD] focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Pricing Summary */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Order Summary</h4>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">
                            {purchaseForm.quantity} {purchaseForm.leadType} lead{parseInt(purchaseForm.quantity) > 1 ? 's' : ''}
                          </span>
                          <span className="font-bold text-[#286BBD]">
                            ${(parseInt(purchaseForm.quantity || '1') * 
                              (purchaseForm.leadType === 'basic' ? 45 : 
                               purchaseForm.leadType === 'premium' ? 89 : 149)).toLocaleString()}
                          </span>
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
                          type="submit"
                          className="px-4 py-2 text-sm bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Purchase Leads
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
                      Thank you for purchasing {purchaseQuantity} lead{purchaseQuantity !== '1' ? 's' : ''}!
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Your leads will be available in your dashboard shortly. You will receive an email confirmation with the details.
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
  )
}