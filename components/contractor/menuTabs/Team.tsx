import { useEffect } from 'react'
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
import { supabase } from '@/lib/supabase'
import { UserPlus, User, X, Save, Trash2, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormPopup } from '@/components/ui/FormPopup'
import { teamMemberType } from '@/types/DashboardTypes'
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormField } from '@/types/Types';


export const Team = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<teamMemberType[]>([]);
  const [newMember, setNewMember] = useState<teamMemberType>({
    Full_Name: '',
    Email_Address: '',
    Phone_Number: '',
  });
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editedMember, setEditedMember] = useState<teamMemberType>({
    Full_Name: '',
    Email_Address: '',
    Phone_Number: '',
  });

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewMember({
      Full_Name: '',
      Email_Address: '',
      Phone_Number: '',
    });
  };

  // Custom validation schema
      const teamMemberSchema = yup.object().shape({
        name: yup.string()
          .required('Full name is required')
          .min(2, 'Name must be at least 2 characters')
          .max(50, 'Name must be less than 50 characters'),
        email: yup.string()
          .required('Email is required')
          .email('Please enter a valid email address'),
        phoneno: yup.string()
          .required('Phone number is required')
          .matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid phone number in format (555) 123-4567')
      });

  const handleFormSubmit = async (formData: Record<string, any>) => {
    console.log('Form submitted with data:', formData);
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    const { error } = await supabase.from("Team_Members").insert([
      {
        user_id: userId,
        Full_Name: formData.name,
        Email_Address: formData.email,
        Phone_Number: formData.phoneno
      }
    ]);
    if (error) throw error;
    toast.success('Team member added successfully!');
    fetchTeamMembers();
    handleCloseModal();
  };

  const fetchTeamMembers = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    const { data, error } = await supabase.from("Team_Members").select("*").eq("user_id", userId);
    if (error) throw error;
    setTeamMembers(data);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleEditClick = (index: number, member: any) => {

    console.log('Editing member:', member);
    setEditingMember(index);
    setEditedMember({
      Full_Name: member.Full_Name,
      Email_Address: member.Email_Address,
      Phone_Number: member.Phone_Number
    });
  };

  const handleSaveClick = async (index: number) => {
    try {
      const originalMember = teamMembers[index];
      const userId = localStorage.getItem("user_id");
      
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const { error } = await supabase
        .from("Team_Members")
        .update({
          Full_Name: editedMember.Full_Name,
          Email_Address: editedMember.Email_Address,
          Phone_Number: editedMember.Phone_Number
        })
        .eq("user_id", userId)
        .eq("Full_Name", originalMember.Full_Name)
        .eq("Email_Address", originalMember.Email_Address);

      if (error) throw error;

      toast.success("Team member updated successfully");
      setEditingMember(null);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member");
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditedMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteMember = async (index: number) => {
    try {
      const memberToDelete = teamMembers[index];
      const userId = localStorage.getItem("user_id");
      
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const { error } = await supabase
        .from("Team_Members")
        .delete()
        .eq("user_id", userId)
        .eq("Full_Name", memberToDelete.Full_Name)
        .eq("Email_Address", memberToDelete.Email_Address);

      if (error) throw error;

      // setTeamMembers(prev => prev.filter((_, i) => i !== index));
      fetchTeamMembers();
      toast.success("Team member deleted successfully");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

  const addTeamMemberFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Smith",
      required: true
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@company.com",
      required: true
    },
    {
      name: "phoneno",
      label: "Phone Number",
      type: "tel",
      placeholder: "(555) 123-4567",
      maxLength: 15,
      required: true
    }
  ]

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
                                  value={editedMember.Full_Name}
                                  onChange={(e) => handleEditInputChange('Full_Name', e.target.value)}
                                  className="h-8 text-sm font-bold w-full"
                                  placeholder="Full Name"
                                />
                                <Input
                                  value={editedMember.Email_Address}
                                  onChange={(e) => handleEditInputChange('Email_Address', e.target.value)}
                                  className="h-8 text-sm w-full"
                                  placeholder="Email Address"
                                />
                                <Input
                                  value={editedMember.Phone_Number}
                                  onChange={(e) => handleEditInputChange('Phone_Number', e.target.value)}
                                  className="h-8 text-sm font-medium w-full"
                                  placeholder="Phone Number"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col space-y-1">
                                <div className="text-sm font-bold text-[#286BBD]">{member.Full_Name}</div>
                                <div className="text-sm text-[#286BBD]">{member.Email_Address}</div>
                                <div className="text-sm font-medium text-[#286BBD]">{member.Phone_Number}</div>
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
      <FormPopup
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Add Team Member"
        subtitle="Invite a new team member to join your organization"
        titleIcon={UserPlus}
        submitButtonText="Add Member"
        submitButtonIcon={UserPlus}
        onSubmit={handleFormSubmit}
        validationSchema={teamMemberSchema}
        fields={addTeamMemberFields as FormField[]}
      />
    </>
  )
}