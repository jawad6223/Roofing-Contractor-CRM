import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, CreditCard, Edit3, Save, X, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormPopup } from "@/components/ui/FormPopup";
import { AddressSuggestion } from "@/components/ui/AddressSuggestion";
import { settingType } from "@/types/DashboardTypes";
import { FormField } from "@/types/Types";
import { toast } from "react-toastify";
import { paymentMethodSchema } from "@/validations/contractor/schema";
import { supabase } from "@/lib/supabase";
import { paymentMethodType } from "@/types/DashboardTypes";
import { PlacePrediction } from "@/types/AuthType";
import LoadingDots from "@/lib/LoadingDots";

export const Setting = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<paymentMethodType[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<settingType>({
    fullName: "",
    email: "",
    serviceRadius: "",
    businessAddress: "",
    latitude: 0,
    longitude: 0,
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsProfileLoading(true);
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
          toast.error("User not logged in");
          return;
        }
        const userId = authData.user.id;

        // 2️⃣ Fetch data from Roofing_Auth table
        const { data, error } = await supabase
          .from("Roofing_Auth")
          .select(
            `"Full Name", "Service Radius", "Business Address", "Email Address", "Phone Number"`
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
          phoneNumber: data["Phone Number"] || ""
        });
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = async () => {
    setIsEditing(false);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        return;
      }
      const userId = authData.user.id;

      const { data, error } = await supabase
        .from("Roofing_Auth")
        .select(
          `"Full Name", "Service Radius", "Business Address", "Phone Number"`
        )
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setFormData({
          fullName: data["Full Name"] || "",
          serviceRadius: data["Service Radius"] || "",
          businessAddress: data["Business Address"] || "",
          phoneNumber: data["Phone Number"],
        });
      }
    } catch (err) {
      console.error("Error restoring data:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        return;
      }
      const userId = authData.user.id;

      const { error: dbError } = await supabase
        .from("Roofing_Auth")
        .update({
          "Full Name": formData.fullName,
          "Service Radius": formData.serviceRadius,
          "Business Address": formData.businessAddress,
          "Latitude": formData.latitude,
          "Longitude": formData.longitude,
          "Phone Number": formData.phoneNumber,
        })
        .eq("user_id", userId);

      if (dbError) throw dbError;

      toast.success("Profile updated successfully 🎉");
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(`Failed to update profile: ${err.message}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressSelect = async (prediction: PlacePrediction) => {
    try {
      // Set the address text in the form
      setFormData((prev) => ({
        ...prev,
        businessAddress: prediction.description,
      }));
      
      const response = await fetch(`/api/place-details?place_id=${prediction.place_id}`);
      const data = await response.json();
      if (data.lat && data.lng) {
        setFormData((prev) => ({
          ...prev,
          latitude: data.lat,
          longitude: data.lng,
        }));
        
      } else {
        console.warn("No coordinates found for selected address");
      }
    } catch (error) {
      console.error("Error fetching address coordinates:", error);
    }
  };

  const handleAddPaymentMethod = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsPaymentLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        return;
      }
      const userId = authData.user.id;

      const cardNumber = formData.cardNumber.trim();
      const card_last4 = cardNumber.slice(-4);
      const expiry_date = formData.expiryDate;

      const { error } = await supabase.from("Payment_Method").insert([
        {
          user_id: userId,
          card_holder_name: formData.cardholderName,
          card_last4: card_last4,
          card_brand: formData.cardType,
          expiry_date: expiry_date,
        },
      ]);

      if (error) throw error;

      handleClosePaymentModal();
      await fetchCards();
      toast.success("Payment method saved successfully");
    } catch (err: any) {
      console.error("Error saving payment method:", err);
      toast.error("Failed to save payment method");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const fetchCards = async () => {
    setIsPaymentLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const { data, error } = await supabase
        .from("Payment_Method")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCards(data || []);
    } catch (err) {
      console.error("Error fetching cards:", err);
      toast.error("Failed to load cards");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handlePaymentMethodDelete = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("Payment_Method")
        .delete()
        .eq("id", cardId);
      if (error) throw error;
      await fetchCards();
      toast.success("Payment method deleted successfully");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error("Failed to delete payment method");
    }
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
      maxLength: 3,
    },
    {
      name: "cardType",
      label: "Card Type",
      type: "select",
      placeholder: "Select Card",
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
                {formData.fullName}
              </h3>
              <p className="text-sm text-gray-600">{formData.email}</p>
              <p className="text-sm text-gray-500 w-96 text-center mx-auto">{formData.businessAddress}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={isProfileLoading ? "Loading..." : formData.fullName}
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
                  Phone Number
                </label>
                <Input
                  value={isProfileLoading ? "Loading..." : formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
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
                    value={isProfileLoading ? "Loading..." : formData.serviceRadius}
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
              {/* <div>
                {isEditing ? (
                  <AddressSuggestion
                    value={formData.businessAddress}
                    onChange={(value) => handleInputChange("businessAddress", value)}
                    onSelect={handleAddressSelect}
                    placeholder="Start typing your business address..."
                    label="Business Address"
                    required={false}
                    error=""
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Address
                    </label>
                    <Input
                      value={isProfileLoading ? "Loading..." : formData.businessAddress}
                      readOnly
                      className="text-gray-900 h-11 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                )}
              </div> */}
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
                  onClick={handleUpdate}
                  className={`flex-1 h-11 bg-[#122E5F] hover:bg-[#0f2347] font-semibold ${isProfileLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isProfileLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isProfileLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* <Card className="border-0 shadow-lg w-full md:w-1/2">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center text-[#286BBD] text-xl">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {isPaymentLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading payment methods...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 h-52 overflow-y-auto">
                    {cards.length > 0 ? (
                      cards.map((card) => (
                        <div
                          key={card.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-[#286BBD] hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-[#286BBD]" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900">
                                      •••• {card.card_last4}
                                    </p>
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-normal capitalize"
                                  >
                                    {card.card_brand}
                                  </Badge>
                                </div>
                                <p className="font-medium text-gray-500">
                                  {card.card_holder_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Expires {card.expiry_date}
                                </p>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 border border-red-500  hover:text-white hover:bg-red-500"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#286BBD]">
                                    Delete Payment Method
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this payment method?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="text-[#286BBD]">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handlePaymentMethodDelete(card.id)
                                    }
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Yes, Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                        <CreditCard className="h-12 w-12 mb-3 text-gray-300" />
                        <p>No payment methods added yet</p>
                        <p className="text-sm">Add a card to get started</p>
                      </div>
                    )}
                  </div>
              )}
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
        </Card> */}
      </div>

      {/* Add Payment Method Modal */}
      <FormPopup
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        title="Add Payment Method"
        subtitle="Enter your payment details securely"
        titleIcon={CreditCard}
        submitButtonText={isPaymentLoading ? "Saving..." : "Save Payment Method"}
        submitButtonIcon={Save}
        onSubmit={handleFormSubmit}
        validationSchema={paymentMethodSchema}
        fields={addPaymentMethodFields as FormField[]}
      />
    </div>
  );
};
