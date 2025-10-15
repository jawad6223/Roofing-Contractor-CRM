"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Edit3, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingType } from "@/types/AdminTypes";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

export const Setting = () => {
  const { user } = useAuth();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const currentUserInfo = Array.isArray(userInfo) ? userInfo.find(
    (info: { emailAddress: string; fullName: string }) =>
      info.emailAddress === user
  ) : userInfo;
  const currentUserFullName = currentUserInfo?.fullName || user;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<settingType>({
    fullName: "",
    email: "",
    businessAddress: "",
    leads: ""
  });

  // useEffect(() => {
  //   setFormData({
  //     fullName: currentUserFullName || "Admin",
  //     email: user || "admin@admin.com",
  //     serviceRadius: "25",
  //     businessAddress: "123 Main St, Dallas, TX 75201",
  //     leads: "10"
  //   });
  // }, [currentUserFullName, user]);
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // setIsLoading(true);

        const { data, error } = await supabase
          .from("Admin_Data")
          .select(`"Full Name", "Email Address", "Business Address", "Price Per Lead"`)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFormData({
            fullName: data["Full Name"] || "",
            email: data["Email Address"] || "",
            businessAddress: data["Business Address"] || "",
            leads: data["Price Per Lead"]?.toString() || "",
          });
        } else {
          toast.warning("No admin data found in table.");
        }
      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        toast.error("Failed to load admin data");
      } finally {
        // setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: currentUserFullName || "",
      email: user || "",
      businessAddress: "",
      leads: "10"
    });
  };

  // const handleUpdate = () => {
  //   console.log('Updating profile with:', formData);
  //   toast.success("Profile updated successfully");
  //   setIsEditing(false);
  // };

  // const handleUpdate = async () => {
  //   try {
  //     const { error } = await supabase
  //       .from("Admin_Data")
  //       .update({
  //         "Full Name": formData.fullName,
  //         "Email Address": formData.email,
  //         "Business Address": formData.businessAddress,
  //         "Price Per Lead": parseFloat(formData.leads) || null,
  //       })
  //       .eq("Email Address", formData.email); // use email to identify the record

  //     if (error) throw error;

  //     toast.success("Admin profile updated successfully!");
  //     setIsEditing(false);
  //   } catch (err: any) {
  //     console.error("Update error:", err);
  //     toast.error("Failed to update admin data");
  //   }
  // };

  const handleUpdate = async () => {
    try {
      const oldEmail = localStorage.getItem("adminLoggedInUser");
      if (!oldEmail) {
        toast.error("Admin not logged in.");
        return;
      }
  
      console.log("🟢 Updating Admin_Data for:", oldEmail, "→", formData.email);
  
      // 1️⃣ Update Admin_Data
      const { error: updateError } = await supabase
        .from("Admin_Data")
        .update({
          "Full Name": formData.fullName,
          "Email Address": formData.email,
          "Business Address": formData.businessAddress,
          "Price Per Lead": parseFloat(formData.leads) || null,
        })
        .eq("Email Address", oldEmail);
  
      if (updateError) {
        console.error("❌ Supabase Admin_Data update error:", updateError);
        toast.error("Error updating Admin_Data table");
        return;
      }
  
      console.log("✅ Admin_Data updated, now calling API to update auth email...");
  
      localStorage.setItem("adminLoggedInUser", formData.email);
  
      toast.success("Admin profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      console.error("❌ Update error:", err);
      toast.error("Failed to update admin data");
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
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address
                </label>
                <Input
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  readOnly={!isEditing}
                  className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
              </div>
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
                  className="flex-1 h-11 bg-[#122E5F] hover:bg-[#0f2347]/80 font-semibold"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
