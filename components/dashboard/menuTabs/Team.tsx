import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus, User, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { teamMembers } from './Data'


export const Team = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Lead Coordinator',
    phone: '',
    department: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New team member data:', newMember);
    // TODO: Add team member submission logic here
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewMember({
      name: '',
      email: '',
      role: 'Lead Coordinator',
      phone: '',
      department: ''
    });
  };

  return (
    <>
      <div className="space-y-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Team Management
              </h1>
              <p className="text-gray-600 mb-8">Add and manage team members who can view and manage leads.</p>
              
              <div className="mb-6">
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-[#286BBD] hover:bg-[#1d4ed8]"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-[#286BBD] rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-sm font-medium text-[#286BBD]">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            className={member.status === 'Active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }
                          >
                            {member.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="border-[#286BBD] text-[#286BBD] hover:bg-[#286BBD] hover:text-white">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Team Permissions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Team Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p className="text-gray-700">• <strong>Sales Manager:</strong> Full access to leads and CRM</p>
                    <p className="text-gray-700">• <strong>Lead Coordinator:</strong> View and manage leads only</p>
                    <p className="text-gray-700">• <strong>Project Manager:</strong> Access to purchased leads</p>
                    <p className="text-gray-700">• <strong>Admin:</strong> Full system access and settings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={newMember.role}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#286BBD] focus:border-transparent"
                        required
                      >
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="Lead Coordinator">Lead Coordinator</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={newMember.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department
                    </label>
                    <Input
                      name="department"
                      value={newMember.department}
                      onChange={handleInputChange}
                      placeholder="Sales, Operations, Admin"
                      className="h-10 text-sm"
                    />
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