import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User, Bell, CreditCard, Edit3, Save, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { settingType } from '@/types/DashboardTypes'
import { useAuth } from '@/hooks/useAuth'

export const Setting = () => {
    const { user, getCurrentUserFullName } = useAuth()
    const currentUserFullName = getCurrentUserFullName()
    
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<settingType>({
      fullName: "",
      email: "",
      serviceRadius: "25",
      businessAddress: "123 Main St, Dallas, TX 75201"
    });

    useEffect(() => {
      setFormData({
        fullName: currentUserFullName || "",
        email: user || "",
        serviceRadius: "25",
        businessAddress: "123 Main St, Dallas, TX 75201"
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
        businessAddress: "123 Main St, Dallas, TX 75201"
      });
    };

    const handleUpdate = () => {
      console.log('Updating profile with:', formData);
      setIsEditing(false);
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
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          readOnly={!isEditing}
                          className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <Input
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          readOnly={!isEditing}
                          className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Service Radius</label>
                        <div className="relative">
                          <Input
                            value={formData.serviceRadius}
                            onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
                            readOnly={!isEditing}
                            className={`text-gray-900 h-11 pr-16 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">miles</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
                        <Input
                          value={formData.businessAddress}
                          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                          readOnly={!isEditing}
                          className={`text-gray-900 h-11 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    {!isEditing ? (
                      <Button 
                        onClick={handleEdit}
                        className="w-full h-11 bg-[#286BBD] hover:bg-[#1d4ed8] font-semibold"
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
                          className="flex-1 h-11 bg-[#286BBD] hover:bg-[#1d4ed8] font-semibold"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Update Profile
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                

                {/* <Card className="xl:col-span-2 border-0 shadow-lg">
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
                        <Badge className="bg-green-100 text-green-800">Primary</Badge>
                      </div>
                      <Button variant="outline" className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-[#286BBD] hover:bg-[#286BBD]/5">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Add New Payment Method
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">💳 Payment Security</h4>
                      <p className="text-sm text-gray-700">All payment information is encrypted and secure. We never store your full card details.</p>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
  )
}
