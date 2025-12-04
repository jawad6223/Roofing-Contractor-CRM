import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, DollarSign, Eye, FileText, MapPin, Phone, Mail, Hash, Search, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { TablePopup } from "@/components/ui/TablePopup";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

const appointmentsInfo = [
  {
    id: 1,
    "Business Address": "123 Main St, Anytown, USA",
    "Date": "2025-12-01",
    "Time": "10:00 AM",
    "Price": 350,
    status: "Pending"
  },
  {
    id: 2,
    "Business Address": "456 Oak Ave, Anytown, USA",
    "Date": "2025-12-02",
    "Time": "09:00 AM",
    "Price": 350,
    status: "Confirmed"
  },
];

export const AppointmentsInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const filteredAppointments = appointmentsInfo.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment["Business Address"]?.toLowerCase().includes(searchLower) ||
      appointment["Date"]?.toLowerCase().includes(searchLower) ||
      appointment["Time"]?.toLowerCase().includes(searchLower) ||
      appointment["Price"]?.toString().includes(searchTerm) ||
      appointment["status"]?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAppointments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Appointment Purchase Information
        </h2>
        <p className="text-gray-600">
          Overview of your purchased appointments and total investment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {appointmentsInfo.length}
                </h3>
                <p className="text-sm text-gray-600">Total Appointments Purchased</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  ${appointmentsInfo.reduce((sum, appointment) => sum + appointment["Price"], 0).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600">Total Investment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-auto">
            <div className="transition-all duration-300 ease-in-out">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.length > 0 ? (
                    currentData.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {appointment["Business Address"]}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            {appointment["Date"]}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-black">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            {appointment["Time"]}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-gray-900">
                            ${appointment["Price"]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`text-sm font-bold ${appointment.status === "Confirmed" ? "text-green-500" : "text-red-500"}`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Search className="h-12 w-12 text-gray-300" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              No results found
                            </p>
                            <p className="text-sm text-gray-500">
                              {searchTerm
                                ? `No appointments match "${searchTerm}"`
                                : "No appointments available"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAppointments.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
      />

    </div>
  );
};
