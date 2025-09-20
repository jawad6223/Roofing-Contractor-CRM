import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Setting = () => {
  const { user, logout } = useAuth();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "[]");
  const currentUserInfo = userInfo.find(
    (info: { emailAddress: string; fullName: string }) =>
      info.emailAddress === user
  );
  const currentUserFullName = currentUserInfo?.fullName || user;
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-gray-600">
          Manage your account preferences and business settings
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg">
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
                  value={currentUserFullName}
                  className="text-gray-900 h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  value={currentUserFullName}
                  className="text-gray-900 h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Radius
                </label>
                <div className="relative">
                  <Input
                    placeholder="25"
                    className="text-gray-900 h-11 pr-16"
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
                  placeholder="123 Main St, Dallas, TX 75201"
                  className="text-gray-900 h-11"
                />
              </div>
            </div>
            <Button className="w-full h-11 bg-[#286BBD] hover:bg-[#1d4ed8] font-semibold">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center text-[#286BBD] text-xl">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">
                    Email Notifications
                  </span>
                  <p className="text-sm text-gray-600">
                    Receive updates via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-[#286BBD] rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">
                    SMS Notifications
                  </span>
                  <p className="text-sm text-gray-600">
                    Get text alerts for urgent updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-[#286BBD] rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">
                    New Lead Alerts
                  </span>
                  <p className="text-sm text-gray-600">
                    Instant notifications for new leads
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-[#286BBD] rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">
                    Weekly Reports
                  </span>
                  <p className="text-sm text-gray-600">Performance summaries</p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-[#286BBD] rounded"
                />
              </div>
            </div>
            <Button className="w-full h-11 bg-[#286BBD] hover:bg-[#1d4ed8] font-semibold">
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 border-0 shadow-lg">
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
                    <p className="font-semibold text-gray-900">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-sm text-gray-600">
                      Visa • Expires 12/25
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Primary</Badge>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-[#286BBD] hover:bg-[#286BBD]/5"
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
    </div>
  );
};
