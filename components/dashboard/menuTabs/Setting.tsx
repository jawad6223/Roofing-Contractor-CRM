import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Bell,
  CreditCard,
  Edit3,
  Save,
  X,
  Calendar,
  Lock,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormPopup } from "@/components/ui/FormPopup";
import { settingType } from "@/types/DashboardTypes";
import { FormField } from "@/types/Types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import * as yup from "yup";
import { supabase } from "@/lib/supabase";

export const Setting = () => {
  const { user, getCurrentUserFullName } = useAuth();
  const currentUserFullName = getCurrentUserFullName();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<settingType>({
    fullName: "",
    email: "",
    serviceRadius: "",
    businessAddress: "",
  });

  // Validation schema for payment method form
  const paymentMethodSchema = yup.object().shape({
    cardNumber: yup
      .string()
      .required("Card number is required")
      .matches(
        /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
        "Please enter a valid 16-digit card number"
      ),
    cardholderName: yup
      .string()
      .required("Cardholder name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    expiryDate: yup
      .string()
      .required("Expiry date is required")
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Please enter a valid expiry date (MM/YY)"
      )
      .test(
        "future-date",
        "Expiry date cannot be in the past",
        function (value) {
          if (!value) return true; // Let required validation handle empty values

          const [month, year] = value.split("/");
          const expiryYear = parseInt(`20${year}`);
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11

          // If year is in the future, it's valid
          if (expiryYear > currentYear) return true;

          // If year is current year, check if month is current or future
          if (expiryYear === currentYear) {
            return parseInt(month) >= currentMonth;
          }

          // Year is in the past
          return false;
        }
      ),
    cvv: yup
      .string()
      .required("CVV is required")
      .matches(/^\d{3,4}$/, "Please enter a valid CVV (3-4 digits)"),
    cardType: yup
      .string()
      .required("Card type is required")
      .oneOf(["visa", "mastercard"], "Please select a valid card type"),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1️⃣ Get user ID from localStorage (saved at login)
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          toast.error("User not logged in");
          return;
        }

        // 2️⃣ Fetch data from Roofing_Auth table
        const { data, error } = await supabase
          .from("Roofing_Auth")
          .select(
            `"Full Name", "Email Address", "Service Radius", "Business Address"`
          )
          .eq("user_id", userId)
          .maybeSingle();

        if (!data) {
          console.warn("No Roofing_Auth record found for this user.");
          return;
        }

        setFormData({
          fullName: data["Full Name"] || "",
          email: data["Email Address"] || "",
          serviceRadius: data["Service Radius"] || "",
          businessAddress: data["Business Address"] || "",
        });
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
  
      setIsEditing(false); // disable edit mode during update
  
      const { error } = await supabase
        .from("Roofing_Auth")
        .update({
          "Full Name": formData.fullName,
          "Email Address": formData.email,
          "Service Radius": formData.serviceRadius,
          "Business Address": formData.businessAddress,
        })
        .eq("user_id", userId);

        console.log("Updating for user_id:", userId);
  
      if (error) throw error;
  
      toast.success("Profile updated successfully 🎉");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(`Failed to update profile: ${err.message}`);
    } finally {
      setIsEditing(false);
    }
  };
  

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddPaymentMethod = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    console.log("Saving payment method:", formData);
    toast.success("Payment method saved successfully");
    handleClosePaymentModal();
  };

  const addPaymentMethodFields = [
    {
      name: "cardNumber",
      label: "Card Number",
      type: "text",
      placeholder: "1234 5678 9012 3456",
      required: true,
      maxLength: 19,
    },
    {
      name: "cardholderName",
      label: "Cardholder Name",
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      name: "expiryDate",
      label: "Expiry Date",
      type: "text",
      placeholder: "MM/YY",
      required: true,
      maxLength: 5,
    },
    {
      name: "cvv",
      label: "CVV",
      type: "text",
      placeholder: "123",
      required: true,
      maxLength: 4,
    },
    {
      name: "cardType",
      label: "Card Type",
      type: "select",
      required: true,
      options: [
        { value: "visa", label: "Visa" },
        { value: "mastercard", label: "Mastercard" },
      ],
    },
  ];

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
              <div className="w-20 h-20 bg-[#122E5F] rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {currentUserFullName}
              </h3>
              <p className="text-sm text-gray-600">{user}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Radius
                </label>
                <div className="relative">
                  <Input
                    value={formData.serviceRadius}
                    onChange={(e) =>
                      handleInputChange("serviceRadius", e.target.value)
                    }
                    readOnly={!isEditing}
                    className={`text-gray-900 h-11 pr-16 ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    miles
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address
                </label>
                <Input
                  value={formData.businessAddress}
                  onChange={(e) =>
                    handleInputChange("businessAddress", e.target.value)
                  }
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="w-full h-11 bg-[#122E5F] hover:bg-[#0f2347] font-semibold"
              >
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
                <Button
                  // onClick={handleUpdate}
                  className="flex-1 h-11 bg-[#122E5F] hover:bg-[#0f2347] font-semibold"
                >
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
                    <CreditCard className="h-6 w-6 text-[#286BBD]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-sm text-gray-600">
                      Visa • Expires 12/25
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <Badge className="bg-green-100 text-green-800">Primary</Badge>
                  <Button
                    variant="outline"
                    className="h-8 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleAddPaymentMethod}
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-[#122E5F] text-[#286BBD]"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Add New Payment Method
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                💳 Payment Security
              </h4>
              <p className="text-sm text-gray-700">
                All payment information is encrypted and secure. We never store
                your full card details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Method Modal */}
      <FormPopup
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        title="Add Payment Method"
        subtitle="Enter your payment details securely"
        titleIcon={CreditCard}
        submitButtonText="Save Payment Method"
        submitButtonIcon={Save}
        onSubmit={handleFormSubmit}
        validationSchema={paymentMethodSchema}
        fields={addPaymentMethodFields as FormField[]}
      />
    </div>
  );
};
