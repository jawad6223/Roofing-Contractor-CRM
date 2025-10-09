import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Bell, CreditCard, Edit3, Save, X, Calendar, Lock, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingType, paymentMethodType } from "@/types/DashboardTypes";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export const Setting = () => {
  const { user, getCurrentUserFullName } = useAuth();
  const currentUserFullName = getCurrentUserFullName();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<settingType>({
    fullName: "",
    email: "",
    serviceRadius: "25",
    businessAddress: "123 Main St, Dallas, TX 75201",
  });
  const [paymentForm, setPaymentForm] = useState<paymentMethodType>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cardType: "visa",
  });

  useEffect(() => {
    setFormData({
      fullName: currentUserFullName || "",
      email: user || "",
      serviceRadius: "25",
      businessAddress: "123 Main St, Dallas, TX 75201",
    });
  }, [currentUserFullName, user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: currentUserFullName || "",
      email: user || "",
      serviceRadius: "25",
      businessAddress: "123 Main St, Dallas, TX 75201",
    });
  };

  const handleUpdate = () => {
    console.log("Updating profile with:", formData);
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentInputChange = (field: string, value: string) => {
    if (field === "expiryDate") {
      let v = value.replace(/\D/g, "").slice(0, 4);
      let month = v.slice(0, 2);

      if (month.length === 1) {
        // Single digit: add 0 only if digit is 2 or greater
        if (+month >= 2) {
          month = "0" + month;
        }
        v = month + (v.length > 1 ? "/" + v.slice(1) : "");
      } else if (month.length === 2) {
        // Two digits: validate month
        if (+month > 12) {
          month = "12";
        } else if (+month === 0) {
          month = "01";
        }
        v = month + (v.length > 2 ? "/" + v.slice(2) : "");
      }

      setPaymentForm((prev) => ({
        ...prev,
        expiryDate: v,
      }));
      return;
    }
    setPaymentForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPaymentMethod = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentForm({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      cardType: "visa",
    });
  };

  const handleSavePaymentMethod = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Payment method saved successfully");
    console.log("Saving payment method:", paymentForm);
    // TODO: Add payment method save logic here
    setIsPaymentModalOpen(false);
    setPaymentForm({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      cardType: "visa",
    });
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[80vh] max-w-7xl mx-auto">
        <Card className="border-0 shadow-lg w-full md:w-1/2">
          <CardHeader className="bg-gradient-to-r from-[#286BBD]/5 to-[#2563eb]/5">
            <CardTitle className="flex items-center text-[#286BBD] text-xl">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#286BBD] rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 capitalize">{currentUserFullName}</h3>
              <p className="text-sm text-gray-600">{user}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Radius</label>
                <div className="relative">
                  <Input
                    value={formData.serviceRadius}
                    onChange={(e) => handleInputChange("serviceRadius", e.target.value)}
                    readOnly={!isEditing}
                    className={`text-gray-900 h-11 pr-16 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">miles</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
                <Input
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? "bg-gray-50 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} className="w-full h-11 bg-[#122E5F] hover:bg-[#0f2347] font-semibold">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleUpdate} className="flex-1 h-11 bg-[#122E5F] hover:bg-[#0f2347] font-semibold">
                  <Save className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg w-full md:w-1/2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center text-[#286BBD] text-xl">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-[#286BBD] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-600">Visa • Expires 12/25</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <Badge className="bg-green-100 text-green-800">Primary</Badge>
                  <Button variant="outline" className="h-8 text-red-500 hover:bg-red-500 hover:text-white">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleAddPaymentMethod}
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-[#286BBD] hover:bg-[#286BBD]/5"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Add New Payment Method
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">💳 Payment Security</h4>
              <p className="text-sm text-gray-700">
                All payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Method Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#286BBD] flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              Add New Payment Method
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <form onSubmit={handleSavePaymentMethod} className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={paymentForm.cardNumber}
                    onChange={(e) => handlePaymentInputChange("cardNumber", e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="pl-10 h-11"
                    maxLength={19}
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                <Input
                  value={paymentForm.cardholderName}
                  onChange={(e) => handlePaymentInputChange("cardholderName", e.target.value)}
                  placeholder="John Doe"
                  className="h-11"
                />
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={paymentForm.expiryDate}
                      onChange={(e) => handlePaymentInputChange("expiryDate", e.target.value)}
                      placeholder="MM/YY"
                      className="pl-10 h-11"
                      maxLength={5}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={paymentForm.cvv}
                      onChange={(e) => handlePaymentInputChange("cvv", e.target.value)}
                      placeholder="123"
                      className="pl-10 h-11"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
              </div>

              {/* Card Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentInputChange("cardType", "visa")}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      paymentForm.cardType === "visa"
                        ? "border-[#286BBD] bg-[#286BBD]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <span className="text-sm font-medium">Visa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentInputChange("cardType", "mastercard")}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      paymentForm.cardType === "mastercard"
                        ? "border-[#286BBD] bg-[#286BBD]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MC</span>
                    </div>
                    <span className="text-sm font-medium">Mastercard</span>
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                    <p className="text-sm text-blue-700">
                      Your payment information is encrypted and secure. We use industry-standard security measures to
                      protect your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handleClosePaymentModal} className="px-6 py-2">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="px-6 py-2 bg-[#286BBD] hover:bg-[#1d4ed8] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Payment Method
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
