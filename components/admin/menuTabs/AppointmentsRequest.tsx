import React, { useState, useEffect } from "react";
import { Search, MapPin, Phone, Eye, Calendar as CalendarIcon, User, DollarSign, Send, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
// import { fetchRequestAppointments } from "./Data";
import { toast } from "react-toastify";
import { TablePopup } from "@/components/ui/TablePopup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/lib/supabase";
import { fetchLeads } from "./Data";
import { appointmentRequests, staticAppointmentData } from "./Data";


interface AppointmentRequestType {
  id: string;
  contractor_id: string;
  "Name": string;
  "Phone Number": string;
  "No. of Appointments": number;
  "Price": number;
  "Purchase Date": string;
  "Send Appointments": number | string;
  "Pending Appointments": number | string;
  "Business Address": string;
  "Status": string;
}

export const AppointmentsRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignedModal, setShowAssignedModal] = useState(false);
  const [assignedModalSearchTerm, setAssignedModalSearchTerm] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date());
  const [appointmentTime, setAppointmentTime] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  // const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequestType[]>([]);
  const [assignCurrentPage, setAssignCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOpenLeads = async () => {
      try {
        const leadsData = await fetchLeads();
        if (leadsData) {
          const openLeads = leadsData.filter((lead: any) => lead["Status"] === "open");
          setLeads(openLeads);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to fetch leads");
      }
    };
    fetchOpenLeads();
  }, []);

//   useEffect(() => {
//     const fetchAppointmentRequestsData = async () => {
//       const appointmentRequestsData = await fetchRequestAppointments();
//       if (appointmentRequestsData) {
//         setAppointmentRequests(appointmentRequestsData);
//       }
//     };
//     fetchAppointmentRequestsData();
//   }, []);

  const filteredAppointmentRequests = appointmentRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.toString().includes(searchTerm) ||
      request.date.includes(searchTerm) ||
      request.time.toString().includes(searchTerm) ||
      request.status.includes(searchTerm)
  );

  const assignedAppointments = filteredAppointmentRequests.filter((request) => request.status === "Confirmed");
  const assignTotalPages = Math.ceil(assignedAppointments.length / itemsPerPage);
  const assignStartIndex = (assignCurrentPage - 1) * itemsPerPage;
  const assignEndIndex = assignStartIndex + itemsPerPage;
  const assignCurrentData = assignedAppointments.slice(assignStartIndex, assignEndIndex);

  const pendingAppointments = filteredAppointmentRequests.filter((request) => request.status === "Pending");
  const pendingTotalPages = Math.ceil(pendingAppointments.length / itemsPerPage);
  const pendingStartIndex = (pendingCurrentPage - 1) * itemsPerPage;
  const pendingEndIndex = pendingStartIndex + itemsPerPage;
  const pendingCurrentData = pendingAppointments.slice(pendingStartIndex, pendingEndIndex);

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

  const assignedAppointmentsColumns = [
    { key: "name", label: "Name" },
    { key: "propertyAddress", label: "Property Address" },
    { key: "price", label: "Price" },
    { key: "phone", label: "Phone No" },
    { key: "email", label: "Email" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
  ];

  const assignedAppointmentsTableData = staticAppointmentData?.map((appointment: any) => ({
    ...appointment,
    date: appointment.date || new Date().toISOString().split('T')[0]
  }));

  const handleViewAssignedAppointment = () => {
    setShowAssignedModal(true);
  };

  const handleCloseAssignedModal = () => {
    setShowAssignedModal(false);
    setAssignedModalSearchTerm("");
  };

  const handleSendAppointments = () => {
    setShowSendModal(true);
  };

  const handleCloseSendModal = () => {
    setShowSendModal(false);
    setSelectedLead('');
    setAppointmentDate(new Date());
    setAppointmentTime('');
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
        <p className="text-sm text-gray-600">Browse and manage appointment requests</p>
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
            {filteredAppointmentRequests.filter((request) => request.status === "Pending").length})
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignCurrentData.length > 0 ? (
                      assignCurrentData.map((request: any) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <div className="text-sm font-bold text-[#122E5F]">
                                {request.name}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                {request.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {request.address}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                ${request.price}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-green-500">
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#122E5F] text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={handleViewAssignedAppointment}
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Send
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingCurrentData.length > 0 ? (
                      pendingCurrentData.map((request: any) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center text-sm text-start font-bold text-[#122E5F]">
                                <User className="h-3 w-3 text-gray-400 mr-1" />
                                {request.name}
                              </div>
                              <div className="flex items-center text-sm text-gray-400">
                                <Phone className="h-3 w-3 text-gray-400 mr-1" />
                                {request.phone}
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
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                ${request.price}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 whitespace-nowrap">
                            <span className="text-sm font-bold text-yellow-500">
                              {request.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#122E5F] w-full text-[#122E5F] hover:bg-[#122E5F] hover:text-white"
                              onClick={handleSendAppointments}
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
        title="Assigned Appointment Details"
        subtitle="Complete information about assigned appointments"
        titleIcon={FileText}
        columns={assignedAppointmentsColumns}
        data={assignedAppointmentsTableData}
        searchTerm={assignedModalSearchTerm}
        onSearchChange={setAssignedModalSearchTerm}
        searchPlaceholder="Search appointments..."
        itemsPerPage={10}
        showPagination={true}
        closeButtonText="Close"
        closeButtonClassName="px-3 py-1.5 text-sm"
      />

      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Leads</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-black">Select Lead</Label>
                  <Select value={selectedLead} onValueChange={setSelectedLead}>
                    <SelectTrigger className="text-black">
                      <SelectValue placeholder="Choose a lead" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[350px] overflow-y-auto max-w-[300px]">
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id.toString()}>
                          {lead["First Name"]} {lead["Last Name"]} - {lead["Property Address"]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-black">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    className="rounded-md border"
                    captionLayout="dropdown"
                    fromYear={new Date().getFullYear() - 5}
                    toYear={new Date().getFullYear() + 10}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm font-medium mb-2 block text-black">Select Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseSendModal}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Leads sent successfully');
                handleCloseSendModal();
              }}
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
