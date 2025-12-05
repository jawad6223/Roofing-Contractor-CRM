"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit3, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingType } from "@/types/AdminTypes";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import { AddressSuggestion } from "@/components/ui/AddressSuggestion";
import { PlacePrediction } from "@/types/AuthType";

export const Setting = () => {

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<settingType>({
    fullName: "",
    email: "",
    businessAddress: "",
    leads: "",
    latitude: 0,
    longitude: 0,
    appointmentPrice: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {

        const { data, error } = await supabase
          .from("Admin_Data")
          .select(`"Full Name", "Business Address", "Price Per Lead", "Email Address", "Price Per Appointment"`)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFormData({
            fullName: data["Full Name"] || "",
            email: data["Email Address"] || "",
            businessAddress: data["Business Address"] || "",
            leads: data["Price Per Lead"]?.toString() || "",
            appointmentPrice: data["Price Per Appointment"]?.toString() || "",
          });
        } else {
          toast.warning("No admin data found in table.");
        }
      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        toast.error("Failed to load admin data");
      }
    };

    fetchAdminData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = async () => {
    setIsEditing(false);
    // Restore original data from Supabase
    try {
      const { data, error } = await supabase
        .from("Admin_Data")
        .select(`"Full Name", "Business Address", "Price Per Lead", "Price Per Appointment"`)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          fullName: data["Full Name"] || "",
          businessAddress: data["Business Address"] || "",
          leads: data["Price Per Lead"]?.toString() || "",
          appointmentPrice: data["Price Per Appointment"]?.toString() || "",
        });
      }
    } catch (err) {
      console.error("Error restoring data:", err);
      toast.error("Failed to restore data");
    }
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
        console.log("Selected Address Coordinates:", data.lat, data.lng);
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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("Admin_Data")
        .update({
          "Full Name": formData.fullName,
          "Business Address": formData.businessAddress,
          "Price Per Lead": parseFloat(formData.leads) || null,
          "Latitude": formData.latitude,
          "Longitude": formData.longitude,
          "Price Per Appointment": parseFloat(formData.appointmentPrice) || null,
        })
        .eq("Email Address", formData.email);

      if (updateError) {
        console.error("❌ Supabase Admin_Data update error:", updateError);
        toast.error("Error updating Admin_Data table");
        return;
      }

      toast.success("Admin profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("❌ Update error:", err);
      toast.error("Failed to update admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <div className="space-y-8">

      <div className="grid place-items-center min-h-[80vh]">
        <Card className="border-0 shadow-lg w-full max-w-xl">
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
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {/* <div>
                {isEditing ? (
                  <AddressSuggestion
                    value={formData.businessAddress}
                    onChange={(value) => handleInputChange("businessAddress", value)}
                    // onSelect={(prediction: PlacePrediction) => {
                    //   handleInputChange("businessAddress", prediction.description);
                    // }}
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
                      value={formData.businessAddress}
                      readOnly
                      className="text-gray-900 h-11 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                )}
              </div> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Per Lead
                </label>
                <div className="relative">
                  <Input
                    value={formData.leads}
                    onChange={(e) => handleInputChange('leads', e.target.value)}
                    readOnly={!isEditing}
                    className={`text-gray-900 h-11 pr-16 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Per Appointment
                </label>
                <div className="relative">
                  <Input
                    value={formData.appointmentPrice}
                    onChange={(e) => handleInputChange('appointmentPrice', e.target.value)}
                    readOnly={!isEditing}
                    className={`text-gray-900 h-11 pr-16 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <Button 
                onClick={handleEdit}
                className="w-full h-11 bg-[#122E5F] hover:bg-[#0f2347]/80 font-semibold"
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
                  className={`flex-1 h-11 bg-[#122E5F] hover:bg-[#0f2347]/80 font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
