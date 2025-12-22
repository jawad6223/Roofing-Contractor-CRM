import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Eye,
  Calendar as CalendarIcon,
  User,
  Send,
  FileText,
  Clock,
  Mail,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { fetchRequestAppointments } from "./Data";
import { toast } from "react-toastify";
import { TablePopup } from "@/components/ui/TablePopup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { fetchLeads } from "./Data";
import { calculateDistance } from "@/lib/distanceFormula";

export const AppointmentsRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignedModal, setShowAssignedModal] = useState(false);
  const [assignedModalSearchTerm, setAssignedModalSearchTerm] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [leadSearchTerm, setLeadSearchTerm] = useState("");
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(
    new Date()
  );
  const [appointmentTime, setAppointmentTime] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  const [appointmentRequestsData, setAppointmentRequestsData] = useState<any[]>(
    []
  );
  const [assignCurrentPage, setAssignCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [selectedAppointmentRequest, setSelectedAppointmentRequest] =
    useState<any>(null);
  const [contractorData, setContractorData] = useState<any>(null);
  const [contractorAppointmentDates, setContractorAppointmentDates] = useState<
    Date[]
  >([]);
  const [contractorAppointments, setContractorAppointments] = useState<any[]>(
    []
  );
  const [sendAppointmentLoading, setSendAppointmentLoading] = useState(false);
  const itemsPerPage = 10;

  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [selectedContractorId, setSelectedContractorId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!selectedContractorId) return;

    setCalendlyUrl(null);
    setCalendarError(null);
    setLoadingCalendar(true);

    fetch(`/api/calendly/first-event?contractor_id=${selectedContractorId}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load calendar");
        }

        return data;
      })
      .then((event) => {
        setCalendlyUrl(event.scheduling_url);
      })
      .catch((err) => {
        setCalendarError(err.message);
      })
      .finally(() => {
        setLoadingCalendar(false);
      });
  }, [selectedContractorId]);

  console.log("selectedContractorId", selectedContractorId);

  useEffect(() => {
    const fetchOpenLeads = async () => {
      try {
        const leadsData = await fetchLeads();
        if (leadsData) {
          const openLeads = leadsData.filter(
            (lead: any) => lead["Status"] === "open"
          );
          setLeads(openLeads);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      }
    };
    fetchOpenLeads();
  }, []);

  const fetchAppointmentRequestsData = async () => {
    try {
      const data = await fetchRequestAppointments();
      if (data) {
        setAppointmentRequestsData(data);
      }
    } catch (error) {
      console.error("Error fetching appointment requests:", error);
      toast.error("Failed to fetch appointment requests");
    }
  };

  useEffect(() => {
    fetchAppointmentRequestsData();
  }, []);

  const filteredAppointmentRequests = appointmentRequestsData.filter(
    (request) =>
      request["Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
      request["Business Address"]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request["Phone Number"].toString().includes(searchTerm) ||
      request["Email Address"]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request["Date"].includes(searchTerm) ||
      request["Time"].toString().includes(searchTerm) ||
      request["Status"].includes(searchTerm)
  );

  const assignedAppointments = filteredAppointmentRequests.filter(
    (request) => request["Status"] === "Confirmed"
  );
  const assignTotalPages = Math.ceil(
    assignedAppointments.length / itemsPerPage
  );
  const assignStartIndex = (assignCurrentPage - 1) * itemsPerPage;
  const assignEndIndex = assignStartIndex + itemsPerPage;
  const assignCurrentData = assignedAppointments.slice(
    assignStartIndex,
    assignEndIndex
  );

  const pendingAppointments = filteredAppointmentRequests.filter(
    (request) => request.status === "Pending"
  );
  const pendingTotalPages = Math.ceil(
    pendingAppointments.length / itemsPerPage
  );
  const pendingStartIndex = (pendingCurrentPage - 1) * itemsPerPage;
  const pendingEndIndex = pendingStartIndex + itemsPerPage;
  const pendingCurrentData = pendingAppointments.slice(
    pendingStartIndex,
    pendingEndIndex
  );

  const handleAssignPageChange = (page: number) => {
    setAssignCurrentPage(page);
  };

  const handlePendingPageChange = (page: number) => {
    setPendingCurrentPage(page);
  };

  const handleAssignPreviousPage = () => {
    setAssignCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleAssignNextPage = () => {
    setAssignCurrentPage((prev) => Math.min(prev + 1, assignTotalPages));
  };

  const handlePendingPreviousPage = () => {
    setPendingCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePendingNextPage = () => {
    setPendingCurrentPage((prev) => Math.min(prev + 1, pendingTotalPages));
  };

  React.useEffect(() => {
    setAssignCurrentPage(1);
    setPendingCurrentPage(1);
  }, [searchTerm]);

  const [assignedLeadsData, setAssignedLeadsData] = useState<any[]>([]);
  const [loadingAssignedLeads, setLoadingAssignedLeads] = useState(false);

  const assignedAppointmentsColumns = [
    { key: "name", label: "Name" },
    { key: "propertyAddress", label: "Property Address" },
    { key: "phone", label: "Phone No" },
    { key: "email", label: "Email" },
    { key: "company", label: "Insurance Company" },
    { key: "policy", label: "Policy Number" },
  ];

  const handleViewAssignedAppointment = async (request: any) => {
    setShowAssignedModal(true);
    setLoadingAssignedLeads(true);

    if (!request.id) {
      setAssignedLeadsData([]);
      setLoadingAssignedLeads(false);
      return;
    }

    try {
      const { data: lead, error } = await supabase
        .from("Contractor_Leads")
        .select("*")
        .eq("appointment_request_id", request.id)
        // .eq("Appointment_Status", "Yes")
        // .not("Appointment_Date", "is", null)
        // .not("Appointment_Time", "is", null)
        .maybeSingle();

      if (error) {
        console.error("Error fetching assigned lead:", error);
        setAssignedLeadsData([]);
        return;
      }

      if (lead) {
        const appointmentDate = lead.Appointment_Date
          ? new Date(lead.Appointment_Date)
          : new Date();
        const timeStr = lead.Appointment_Time || "";
        const timeParts = timeStr.split(":");
        const formattedTime =
          timeParts.length >= 2
            ? `${parseInt(timeParts[0]) % 12 || 12}:${timeParts[1]} ${
                parseInt(timeParts[0]) >= 12 ? "PM" : "AM"
              }`
            : "";

        const transformedLead = {
          name: `${lead["First Name"]} ${lead["Last Name"]}`.trim(),
          propertyAddress: lead["Property Address"],
          phone: lead["Phone Number"],
          email: lead["Email Address"],
          company: lead["Insurance Company"],
          policy: lead["Policy Number"],
        };
        setAssignedLeadsData([transformedLead]);
      } else {
        setAssignedLeadsData([]);
      }
    } catch (error) {
      console.error("Error fetching assigned lead:", error);
      toast.error("Failed to load assigned lead");
      setAssignedLeadsData([]);
    } finally {
      setLoadingAssignedLeads(false);
    }
  };

  const handleCloseAssignedModal = () => {
    setShowAssignedModal(false);
    setAssignedModalSearchTerm("");
    setAssignedLeadsData([]);
  };

  const handleSendAppointments = async (request: any) => {
    setSelectedAppointmentRequest(request);
    setSelectedContractorId(request.Contractor_Id);
    setShowSendModal(true);

    if (request.Contractor_Id) {
      try {
        const { data: contractorInfo, error: contractorError } = await supabase
          .from("Roofing_Auth")
          .select('"Latitude", "Longitude", "Service Radius"')
          .eq("user_id", request.Contractor_Id)
          .single();

        if (contractorError) {
          console.error("Error fetching contractor data:", contractorError);
        } else if (contractorInfo) {
          setContractorData({
            latitude: contractorInfo["Latitude"],
            longitude: contractorInfo["Longitude"],
            serviceRadius: contractorInfo["Service Radius"],
          });
        }

        const { data: appointments, error: appointmentsError } = await supabase
          .from("Contractor_Leads")
          .select("*")
          .eq("contractor_id", request.Contractor_Id)
          // .eq("Appointment_Status", "Yes")
          // .not("Appointment_Date", "is", null)
          // .not("Appointment_Time", "is", null)
          .order("Appointment_Date", { ascending: true })
          .order("Appointment_Time", { ascending: true });

        if (appointmentsError) {
          console.error(
            "Error fetching contractor appointments:",
            appointmentsError
          );
          setContractorAppointmentDates([]);
          setContractorAppointments([]);
        } else if (appointments) {
          const dates = appointments
            .map((apt: any) => {
              if (apt.Appointment_Date) {
                const date = new Date(apt.Appointment_Date);
                date.setHours(0, 0, 0, 0);
                return date;
              }
              return null;
            })
            .filter((date: Date | null) => date !== null) as Date[];
          setContractorAppointmentDates(dates);

          const transformedAppointments = appointments.map((apt: any) => {
            const appointmentDate = apt.Appointment_Date
              ? new Date(apt.Appointment_Date)
              : new Date();
            const timeStr = apt.Appointment_Time || "";
            const timeParts = timeStr.split(":");
            const formattedTime =
              timeParts.length >= 2
                ? `${parseInt(timeParts[0]) % 12 || 12}:${timeParts[1]} ${
                    parseInt(timeParts[0]) >= 12 ? "PM" : "AM"
                  }`
                : "";

            return {
              id: apt.id.toString(),
              date: appointmentDate,
              time: formattedTime,
              clientName: `${apt["First Name"] || ""} ${
                apt["Last Name"] || ""
              }`.trim(),
              propertyAddress: apt["Property Address"] || "",
              phone: apt["Phone Number"] || "",
              email: apt["Email Address"] || "",
            };
          });
          setContractorAppointments(transformedAppointments);
        }
      } catch (error) {
        console.error("Error fetching contractor data:", error);
      }
    }
  };

  const handleCloseSendModal = () => {
    setShowSendModal(false);
    setSelectedLead("");
    setAppointmentDate(new Date());
    setAppointmentTime("");
    setSelectedAppointmentRequest(null);
    setContractorData(null);
    setContractorAppointmentDates([]);
    setContractorAppointments([]);
  };

  const getAppointmentsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    return contractorAppointments.filter(
      (apt) =>
        format(apt.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );
  };

  const selectedDateAppointments = getAppointmentsForDate(appointmentDate);

  const getDistanceBadge = (lead: any) => {
    if (!contractorData || !lead) {
      return null;
    }

    if (
      !lead["Latitude"] ||
      !lead["Longitude"] ||
      !contractorData.latitude ||
      !contractorData.longitude
    ) {
      return { text: "No Coordinates", color: "bg-gray-100 text-gray-800" };
    }

    const serviceRadius = contractorData.serviceRadius;
    const radiusValue = parseFloat(serviceRadius.replace(/\D/g, ""));

    const distance = calculateDistance(
      contractorData.latitude,
      contractorData.longitude,
      lead["Latitude"],
      lead["Longitude"]
    );

    const diff = distance - radiusValue;

    let badge = { text: "Too Far", color: "bg-red-100 text-red-800" };

    if (diff <= 5)
      badge = { text: "Nearest", color: "bg-green-100 text-green-800" };
    else if (diff <= 10)
      badge = { text: "Near", color: "bg-yellow-100 text-yellow-800" };
    else if (diff <= 20)
      badge = { text: "Far", color: "bg-blue-100 text-blue-800" };

    return {
      text: badge.text,
      color: badge.color,
      distance: distance.toFixed(1),
      radius: radiusValue.toFixed(1),
    };
  };

  const sendAppointments = async (
    selectedLead: string,
    appointmentTime: string
  ) => {
    setSendAppointmentLoading(true);
    if (!selectedLead) {
      toast.error("Please select a lead");
      setSendAppointmentLoading(false);
      return;
    }

    if (!appointmentDate) {
      toast.error("Please select a date");
      setSendAppointmentLoading(false);
      return;
    }

    // if (!appointmentTime) {
    //   toast.error('Please select a time');
    //   setSendAppointmentLoading(false);
    //   return;
    // }

    if (!selectedAppointmentRequest) {
      toast.error("Appointment request not found");
      setSendAppointmentLoading(false);
      return;
    }

    const selectedLeadData = leads.find(
      (lead) => lead.id.toString() === selectedLead
    );

    if (!selectedLeadData) {
      toast.error("Lead data not found");
      return;
    }

    const formattedDate = format(appointmentDate, "yyyy-MM-dd");
    const timeParts = appointmentTime.split(":");
    const formattedTime = `${timeParts[0]}:${timeParts[1]}:00`;
    const contractorId = selectedAppointmentRequest.Contractor_Id;

    try {
      const { data: existingLead, error: checkError } = await supabase
        .from("Contractor_Leads")
        .select("id")
        .eq("contractor_id", contractorId)
        .eq("lead_id", selectedLeadData.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing lead:", checkError);
        toast.error("Failed to check lead assignment");
        return;
      }

      const selectedHour = parseInt(timeParts[0]);
      const selectedMinute = parseInt(timeParts[1]);
      const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;

      let query = supabase
        .from("Contractor_Leads")
        .select("id, Appointment_Time")
        .eq("contractor_id", contractorId)
        .eq("Appointment_Date", formattedDate)
        .not("Appointment_Time", "is", null)
        .neq("lead_id", selectedLeadData.id);

      if (existingLead) {
        query = query.neq("id", existingLead.id);
      }

      const { data: existingAppointments, error: checkTimeError } = await query;

      if (checkTimeError) {
        console.error("Error checking existing appointments:", checkTimeError);
        toast.error("Failed to check appointment availability");
        return;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        for (const appointment of existingAppointments) {
          if (!appointment.Appointment_Time) continue;

          const existingTimeParts = appointment.Appointment_Time.split(":");
          const existingHour = parseInt(existingTimeParts[0]);
          const existingMinute = parseInt(existingTimeParts[1]);
          const existingTimeInMinutes = existingHour * 60 + existingMinute;

          const timeDifference = Math.abs(
            selectedTimeInMinutes - existingTimeInMinutes
          );

          if (timeDifference < 60) {
            toast.error(
              "Appointment time must be at least 1 hour apart from existing appointments."
            );
            return;
          }
        }
      }

      if (existingLead) {
        const { error: updateError } = await supabase
          .from("Contractor_Leads")
          .update({
            Appointment_Date: formattedDate,
            Appointment_Time: formattedTime,
            Appointment_Status: "Yes",
            appointment_request_id: selectedAppointmentRequest.id,
          })
          .eq("id", existingLead.id);

        if (updateError) {
          console.error("Error updating appointment:", updateError);
          toast.error("Failed to update appointment");
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("Contractor_Leads")
          .insert([
            {
              contractor_id: contractorId,
              lead_id: selectedLeadData.id,
              "First Name": selectedLeadData["First Name"],
              "Last Name": selectedLeadData["Last Name"],
              "Phone Number": selectedLeadData["Phone Number"],
              "Email Address": selectedLeadData["Email Address"],
              "Property Address": selectedLeadData["Property Address"],
              "Insurance Company": selectedLeadData["Insurance Company"],
              "Policy Number": selectedLeadData["Policy Number"],
              Latitude: selectedLeadData["Latitude"],
              Longitude: selectedLeadData["Longitude"],
              Appointment_Date: formattedDate,
              // Appointment_Time: formattedTime,
              Appointment_Status: "Yes",
              appointment_request_id: selectedAppointmentRequest.id,
              status: "open",
            },
          ]);

        if (insertError) {
          console.error("Error inserting lead:", insertError);
          toast.error("Failed to assign lead to contractor");
          return;
        }
      }

      const { error: updateLeadError } = await supabase
        .from("Leads_Data")
        .update({ Status: "close" })
        .eq("id", selectedLeadData.id);

      if (updateLeadError) {
        console.error("Error updating lead status:", updateLeadError);
        toast.error("Failed to update lead status");
        return;
      }

      const { error: updateRequestError } = await supabase
        .from("Appointments_Request")
        .update({ Status: "Confirmed" })
        .eq("id", selectedAppointmentRequest.id);

      if (updateRequestError) {
        console.error(
          "Error updating appointment request status:",
          updateRequestError
        );
        toast.error("Failed to update appointment request status");
        return;
      }

      toast.success("Appointment assigned successfully");

      const leadsData = await fetchLeads();
      if (leadsData) {
        const openLeads = leadsData.filter(
          (lead: any) => lead["Status"] === "open"
        );
        setLeads(openLeads);
      }

      const appointmentRequestsData = await fetchRequestAppointments();
      if (appointmentRequestsData) {
        setAppointmentRequestsData(appointmentRequestsData);
      }

      handleCloseSendModal();
    } catch (error) {
      console.error("Error in sendAppointments:", error);
      toast.error("An error occurred while assigning the appointment");
    } finally {
      setSendAppointmentLoading(false);
    }
  };

  return (
    <div className="">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#122E5F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <CalendarIcon className="h-6 w-6 text-[#122E5F]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Requested Appointments
        </h2>
        <p className="text-sm text-gray-600">
          Browse and manage appointment requests
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Contractors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#122E5F] focus:border-transparent"
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="assigned" className="text-sm font-medium">
            Completed
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-sm font-medium">
            Pending (
            {
              filteredAppointmentRequests.filter(
                (request) => request.status === "Pending"
              ).length
            }
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignCurrentData.length > 0 ? (
                      assignCurrentData.map((request: any) => (
                        <tr
                          key={request.id}
                          className={`hover:bg-gray-50 ${
                            assignCurrentData.indexOf(request) % 2 === 1
                              ? "bg-gray-50"
                              : ""
                          }`}
                        >
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex flex-col items-start ml-2">
                              <div className="flex items-center text-sm text-start font-bold text-[#122E5F]">
                                <User className="h-3 w-3 text-gray-400 mr-1" />
                                {request.name}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                {request.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {request.address}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              ${request.price}
                            </span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {request.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={() =>
                                handleViewAssignedAppointment(request)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="h-12 w-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                No assigned appointments found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchTerm
                                  ? `No results for "${searchTerm}"`
                                  : "No assigned appointments available"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Pagination
            currentPage={assignCurrentPage}
            totalPages={assignTotalPages}
            totalItems={assignedAppointments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handleAssignPageChange}
            onPreviousPage={handleAssignPreviousPage}
            onNextPage={handleAssignNextPage}
            startIndex={assignStartIndex}
            endIndex={assignEndIndex}
          />
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-auto max-h-64">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Send
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingCurrentData.length > 0 ? (
                      pendingCurrentData.map((request: any) => (
                        <tr
                          key={request.id}
                          className={`hover:bg-gray-50 ${
                            pendingCurrentData.indexOf(request) % 2 === 1
                              ? "bg-gray-50"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center text-sm text-start font-bold text-[#122E5F]">
                                <User className="h-3 w-3 text-gray-400 mr-1" />
                                {request.name}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                {request.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {request.address}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              ${request.price}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {request.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#122E5F] w-full text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={() => handleSendAppointments(request)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Search className="h-12 w-12 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                No pending appointments found
                              </p>
                              <p className="text-sm text-gray-500">
                                {searchTerm
                                  ? `No results for "${searchTerm}"`
                                  : "No pending appointments available"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Pagination
            currentPage={pendingCurrentPage}
            totalPages={pendingTotalPages}
            totalItems={pendingAppointments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePendingPageChange}
            onPreviousPage={handlePendingPreviousPage}
            onNextPage={handlePendingNextPage}
            startIndex={pendingStartIndex}
            endIndex={pendingEndIndex}
          />
        </TabsContent>
      </Tabs>

      <TablePopup
        isOpen={showAssignedModal}
        onClose={handleCloseAssignedModal}
        title="Assigned Lead Details"
        subtitle="Lead assigned to this appointment request"
        titleIcon={FileText}
        columns={assignedAppointmentsColumns}
        data={assignedLeadsData}
        searchTerm={assignedModalSearchTerm}
        onSearchChange={setAssignedModalSearchTerm}
        searchPlaceholder="Search lead..."
        itemsPerPage={10}
        showPagination={true}
        closeButtonText="Close"
        closeButtonClassName="px-3 py-1.5 text-sm"
        renderCell={(column, row, index) => {
          if (loadingAssignedLeads) {
            return (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#122E5F]"></div>
              </div>
            );
          }
          return (
            <span className="text-sm text-gray-900">
              {row[column.key] || "-"}
            </span>
          );
        }}
      />

      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">Send Leads</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-black">
                    Select Lead
                  </Label>
                  <Select
                    value={selectedLead}
                    onValueChange={(value) => {
                      setSelectedLead(value);
                      setLeadSearchTerm("");
                    }}
                  >
                    <SelectTrigger className="text-black h-auto py-3 px-4">
                      {selectedLead ? (
                        (() => {
                          const selectedLeadData = leads.find(
                            (lead) => lead.id.toString() === selectedLead
                          );
                          if (!selectedLeadData)
                            return <SelectValue placeholder="Choose a lead" />;
                          return (
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <div className="flex gap-1.5 text-xs font-semibold text-gray-600">
                                <User className="h-3 w-3 text-gray-400" />
                                <span className="truncate">
                                  {selectedLeadData["First Name"]}{" "}
                                  {selectedLeadData["Last Name"]}
                                </span>
                              </div>
                              <div className="flex gap-1.5 text-xs font-semibold text-gray-600">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="truncate">
                                  {selectedLeadData["Email Address"]}
                                </span>
                              </div>
                              <div className="flex gap-1.5 text-xs text-gray-600">
                                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate">
                                  {selectedLeadData["Property Address"]}
                                </span>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <SelectValue placeholder="Choose a lead" />
                      )}
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="max-h-[400px] overflow-hidden w-[var(--radix-select-trigger-width)]"
                    >
                      <div className="sticky top-0 z-10 bg-white border-b px-3 py-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search leads..."
                            value={leadSearchTerm}
                            onChange={(e) => setLeadSearchTerm(e.target.value)}
                            className="pl-8 h-9 text-sm"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {leads
                          .filter((lead) => {
                            if (!leadSearchTerm) return true;
                            const searchLower = leadSearchTerm.toLowerCase();
                            return (
                              lead["First Name"]
                                ?.toLowerCase()
                                .includes(searchLower) ||
                              lead["Last Name"]
                                ?.toLowerCase()
                                .includes(searchLower) ||
                              lead["Property Address"]
                                ?.toLowerCase()
                                .includes(searchLower) ||
                              lead["Phone Number"]?.includes(leadSearchTerm) ||
                              lead["Email Address"]
                                ?.toLowerCase()
                                .includes(searchLower)
                            );
                          })
                          .map((lead) => {
                            const badge = getDistanceBadge(lead);
                            return (
                              <SelectItem
                                key={lead.id}
                                value={lead.id.toString()}
                                className="py-3 px-4 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                              >
                                <div className="flex items-start justify-between gap-4 w-full ml-3 min-w-0">
                                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <div className="font-semibold flex items-start gap-1.5 text-xs text-gray-600">
                                      <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                                      <span className="truncate">
                                        {lead["First Name"]} {lead["Last Name"]}
                                      </span>
                                    </div>
                                    <div className="font-semibold flex items-start gap-1.5 text-xs text-gray-600">
                                      <Mail className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                                      <span className="truncate">
                                        {lead["Email Address"]}
                                      </span>
                                    </div>
                                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                                      <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                      <span className="break-words leading-relaxed min-w-0">
                                        {lead["Property Address"]}
                                      </span>
                                    </div>
                                  </div>
                                  {badge && (
                                    <span
                                      className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 shadow-sm ${badge.color}`}
                                    >
                                      {badge.text} • {badge.distance}mi
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            );
                          })}
                        {leads.filter((lead) => {
                          if (!leadSearchTerm) return false;
                          const searchLower = leadSearchTerm.toLowerCase();
                          return (
                            lead["First Name"]
                              ?.toLowerCase()
                              .includes(searchLower) ||
                            lead["Last Name"]
                              ?.toLowerCase()
                              .includes(searchLower) ||
                            lead["Property Address"]
                              ?.toLowerCase()
                              .includes(searchLower) ||
                            lead["Phone Number"]?.includes(leadSearchTerm) ||
                            lead["Email Address"]
                              ?.toLowerCase()
                              .includes(searchLower)
                          );
                        }).length === 0 &&
                          leadSearchTerm && (
                            <div className="py-6 text-center text-sm text-gray-500">
                              No leads found matching "{leadSearchTerm}"
                            </div>
                          )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Contractor Availability
                </Label>

                <div className="w-full">
                  {loadingCalendar && (
                    <p className="text-sm text-gray-500">
                      Loading contractor calendar...
                    </p>
                  )}

                  {!loadingCalendar && calendarError && (
                    <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
                      ⚠️ {calendarError}
                    </div>
                  )}

                  {!loadingCalendar && calendlyUrl && (
                    <iframe
                      src={calendlyUrl}
                      className="w-full h-[700px] rounded-lg border"
                      frameBorder="0"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSendModal}>
              Cancel
            </Button>
            <Button
              onClick={() => sendAppointments(selectedLead, appointmentTime)}
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
              disabled={sendAppointmentLoading}
            >
              {sendAppointmentLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
