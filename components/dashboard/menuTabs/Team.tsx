import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { UserPlus, User, X, Save, Trash2, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { teamMembers } from './Data'
import { teamMemberType } from '@/types/DashboardTypes'
import { toast } from "react-toastify";


export const Team = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState<teamMemberType>({
    name: '',
    email: '',
    phoneno: '',
  });
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editedMember, setEditedMember] = useState<teamMemberType>({
    name: '',
    email: '',
    phoneno: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const phoneNumber = value.replace(/\D/g, '');
      let formattedValue = '';
      
      if (phoneNumber.length === 0) {
        formattedValue = '';
      } else if (phoneNumber.length <= 3) {
        formattedValue = `(${phoneNumber}`;
      } else if (phoneNumber.length <= 6) {
        formattedValue = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        formattedValue = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
      
      setNewMember(prev => ({
        ...prev,
        phoneno: formattedValue
      }));
    } else {
      setNewMember(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New team member data:', newMember);
    toast.success("Team member added successfully");
    // TODO: Add team member submission logic here
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewMember({
      name: '',
      email: '',
      phoneno: '',
    });
  };

  const handleEditClick = (index: number, member: any) => {
    setEditingMember(index);
    setEditedMember({
      name: member.name,
      email: member.email,
      phoneno: member.phoneno
    });
  };

  const handleSaveClick = (index: number) => {
    console.log('Saving member data:', editedMember);
    toast.success("Team member updated successfully");
    // TODO: Add save logic here
    setEditingMember(null);
    setEditedMember({
      name: '',
      email: '',
      phoneno: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditedMember({
      name: '',
      email: '',
      phoneno: ''
    });
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditedMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteMember = (index: number) => {
    console.log('Deleting team member at index:', index);
    toast.success("Team member deleted successfully");
  };

  return (
    <>
      <div className="space-y-8">
              <h1 className="text-2xl sm:text-3xl text-center md:text-start font-bold text-gray-900 mb-6">
                Team Management
              </h1>
              
              <div className="mb-6">
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#122E5F] hover:bg-[#0f2347] w-full md:w-auto"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-[#122E5F] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 max-w-xs">
                            {editingMember === index ? (
                              <div className="space-y-3">
                                <Input
                                  value={editedMember.name}
                                  onChange={(e) => handleEditInputChange('name', e.target.value)}
                                  className="h-8 text-sm font-bold w-full"
                                  placeholder="Full Name"
                                />
                                <Input
                                  value={editedMember.email}
                                  onChange={(e) => handleEditInputChange('email', e.target.value)}
                                  className="h-8 text-sm w-full"
                                  placeholder="Email Address"
                                />
                                <Input
                                  value={editedMember.phoneno}
                                  onChange={(e) => handleEditInputChange('phoneno', e.target.value)}
                                  className="h-8 text-sm font-medium w-full"
                                  placeholder="Phone Number"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-1">
                                <input type="text" value={member.name} onChange={(e) => handleEditInputChange('name', e.target.value)} className="text-sm text-[#286BBD] w-full" placeholder="Full Name" />
                                <input type="email" value={member.email} onChange={(e) => handleEditInputChange('email', e.target.value)} className="text-sm text-[#286BBD] w-full" placeholder="Email Address" />
                                <input type="text" value={member.phoneno} onChange={(e) => handleEditInputChange('phoneno', e.target.value)} className="text-sm font-medium text-[#286BBD] w-full" placeholder="Phone Number" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#286BBD]">Delete Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this team member? This action cannot be undone and they will lose access to the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="text-[#286BBD]">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMember(index)} className="bg-red-500 hover:bg-red-600">
                                  Yes, Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {editingMember === index ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCancelEdit}
                                className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSaveClick(index)}
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditClick(index, member)}
                              className="border-[#122E5F] text-[#122E5F] hover:bg-[#0f2347] hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
            </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#286BBD]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="h-6 w-6 text-[#286BBD]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Add Team Member
                </h2>
                <p className="text-sm text-gray-600">Invite a new team member to join your organization</p>
              </div>

              {/* Add Team Member Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={newMember.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      required
                      className="h-10 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={newMember.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      required
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="text"
                        value={newMember.phoneno}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="h-10 text-sm"
                        maxLength={14}
                      />
                    </div>
                  </div>

                </div>


                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 text-sm bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Member
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}