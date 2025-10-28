import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { UserPlus, User, X, Save, Trash2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormPopup } from "@/components/ui/FormPopup";
import { teamMemberType } from "@/types/DashboardTypes";
import { toast } from "react-toastify";
import { teamMemberSchema } from "@/validations/contractor/schema";
import { FormField } from "@/types/Types";
import * as yup from "yup";
import { fetchTeamMembers } from "./Data";

export const Team = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<teamMemberType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editedMember, setEditedMember] = useState<teamMemberType>({
    Full_Name: "",
    Email_Address: "",
    Phone_Number: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    Full_Name?: string;
    Email_Address?: string;
    Phone_Number?: string;
  }>({});

  const handleCloseModal = () => {
    setShowAddModal(false);
  };
 
  const handleFormSubmit = async (formData: Record<string, any>) => {
    console.log("Form submitted with data:", formData);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      toast.error("User not logged in");
      return;
    }
    const userId = authData.user.id;

    // email already
    const { data: existingMember, error: fetchError } = await supabase
      .from("Team_Members")
      .select("id")
      .eq("Email_Address", formData.email)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingMember) {
      toast.error("A team member with this email already exists.");
      return;
    }

    const { error } = await supabase.from("Team_Members").insert([
      {
        user_id: userId,
        Full_Name: formData.name,
        Email_Address: formData.email,
        Phone_Number: formData.phoneno,
      },
    ]);
    if (error) throw error;
    toast.success("Team member added successfully!");
    fetchTeamMembersData();
    handleCloseModal();
  };

    const fetchTeamMembersData = async () => {
      setIsLoading(true);
      const teamMembersData = await fetchTeamMembers();
      if (teamMembersData) {
        setTeamMembers(teamMembersData);
      }
      setIsLoading(false);
    };

  useEffect(() => {
    fetchTeamMembersData();
  }, []);

  const handleEditClick = (index: number, member: any) => {
    console.log("Editing member:", member);
    setEditingMember(index);
    setEditedMember({
      Full_Name: member.Full_Name,
      Email_Address: member.Email_Address,
      Phone_Number: member.Phone_Number,
    });
    setFieldErrors({});
  };

  const handleSaveClick = async (index: number) => {
    try {
      setFieldErrors({});

      // Validate edited member data with schema
      const formDataToValidate = {
        name: editedMember.Full_Name,
        email: editedMember.Email_Address,
        phoneno: editedMember.Phone_Number,
      };

      try {
        await teamMemberSchema.validate(formDataToValidate, { abortEarly: false });
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const newErrors: { [key: string]: string } = {};
          error.inner.forEach((err) => {
            if (err.path === 'name') {
              newErrors.Full_Name = err.message;
            } else if (err.path === 'email') {
              newErrors.Email_Address = err.message;
            } else if (err.path === 'phoneno') {
              newErrors.Phone_Number = err.message;
            }
          });
          setFieldErrors(newErrors);
          return;
        }
        toast.error("Validation failed. Please check your input.");
        return;
      }

      const originalMember = teamMembers[index];
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        return;
      }
      const userId = authData.user.id;

      const { error } = await supabase
        .from("Team_Members")
        .update({
          Full_Name: editedMember.Full_Name,
          Email_Address: editedMember.Email_Address,
          Phone_Number: editedMember.Phone_Number,
        })
        .eq("user_id", userId)
        .eq("Full_Name", originalMember.Full_Name)
        .eq("Email_Address", originalMember.Email_Address);

      if (error) throw error;

      toast.success("Team member updated successfully");
      setEditingMember(null);
      fetchTeamMembersData();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member");
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
  };

  const handleEditInputChange = (field: string, value: string) => {
    let processedValue = value;

    if (field === "Phone_Number") {
      const digits = value.replace(/\D/g, "");

      if (digits.length <= 3) {
        processedValue = digits;
      } else if (digits.length <= 6) {
        processedValue = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length <= 10) {
        processedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else {
        processedValue = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
      }
    }

    setEditedMember((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleDeleteMember = async (index: number) => {
    try {
      const memberToDelete = teamMembers[index];
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        return;
      }
      const userId = authData.user.id;

      const { error } = await supabase
        .from("Team_Members")
        .delete()
        .eq("user_id", userId)
        .eq("Full_Name", memberToDelete.Full_Name)
        .eq("Email_Address", memberToDelete.Email_Address);

      if (error) throw error;

      fetchTeamMembersData();
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
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@company.com",
      required: true,
    },
    {
      name: "phoneno",
      label: "Phone Number",
      type: "tel",
      placeholder: "(555) 123-4567",
      maxLength: 15,
      required: true,
    },
  ];

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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
              <p className="mt-2 text-sm text-gray-500">
                Loading team members...
              </p>
            </div>
          </div>
          ) : (
            teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
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
                              <div>
                                <Input
                                  value={editedMember.Full_Name}
                                  onChange={(e) =>
                                    handleEditInputChange("Full_Name", e.target.value)
                                  }
                                  className={`h-8 text-sm font-bold w-full ${
                                    fieldErrors.Full_Name ? "border-red-500" : ""
                                  }`}
                                  placeholder="Full Name"
                                />
                                {fieldErrors.Full_Name && (
                                  <p className="text-red-500 text-xs mt-1">{fieldErrors.Full_Name}</p>
                                )}
                              </div>
                              <div>
                                <Input
                                  value={editedMember.Email_Address}
                                  onChange={(e) =>
                                    handleEditInputChange(
                                      "Email_Address",
                                      e.target.value
                                    )
                                  }
                                  className={`h-8 text-sm w-full ${
                                    fieldErrors.Email_Address ? "border-red-500" : ""
                                  }`}
                                  placeholder="Email Address"
                                />
                                {fieldErrors.Email_Address && (
                                  <p className="text-red-500 text-xs mt-1">{fieldErrors.Email_Address}</p>
                                )}
                              </div>
                              <div>
                                <Input
                                  value={editedMember.Phone_Number}
                                  onChange={(e) =>
                                    handleEditInputChange(
                                      "Phone_Number",
                                      e.target.value
                                    )
                                  }
                                  className={`h-8 text-sm font-medium w-full ${
                                    fieldErrors.Phone_Number ? "border-red-500" : ""
                                  }`}
                                  placeholder="Phone Number"
                                />
                                {fieldErrors.Phone_Number && (
                                  <p className="text-red-500 text-xs mt-1">{fieldErrors.Phone_Number}</p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col space-y-1">
                              <div className="text-sm font-bold text-[#286BBD]">
                                {member.Full_Name}
                              </div>
                              <div className="text-sm text-[#286BBD]">
                                {member.Email_Address}
                              </div>
                              <div className="text-sm font-medium text-[#286BBD]">
                                {member.Phone_Number}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-[#286BBD]">
                                Delete Team Member
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this team member?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="text-[#286BBD]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMember(index)}
                                className="bg-red-500 hover:bg-red-600"
                              >
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
                ))
            ):(
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Yet</h3>
                <p className="text-gray-500 text-center mb-6">You haven't added any team members to your organization.</p>
              </div>
            )
          )}
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
  );
};