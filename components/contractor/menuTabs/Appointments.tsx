import { Button } from '@/components/ui/button'
import { Plus, ShoppingCart, Clock, MapPin, Phone, Mail, User, Calendar as CalendarIcon } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { appointmentType, purchasedLeadType } from '@/types/DashboardTypes'
import { fetchContractorLeads } from './Data'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-toastify'



const mockAppointments: appointmentType[] = [
  {
    id: '1',
    date: new Date(2025, 11, 15),
    time: '10:00 AM',
    clientName: 'John Smith',
    propertyAddress: '123 Main St, City, State 12345',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    notes: 'Initial roof inspection needed'
  },
  {
    id: '2',
    date: new Date(2025, 11, 18),
    time: '2:30 PM',
    clientName: 'Sarah Johnson',
    propertyAddress: '456 Oak Ave, City, State 12345',
    phone: '(555) 234-5678',
    email: 'sarah.j@email.com',
    notes: 'Follow-up appointment for quote'
  },
  {
    id: '3',
    date: new Date(2025, 11, 20),
    time: '9:00 AM',
    clientName: 'Michael Brown',
    propertyAddress: '789 Pine Rd, City, State 12345',
    phone: '(555) 345-6789',
    email: 'm.brown@email.com',
    notes: 'Roof repair work scheduled'
  },
  {
    id: '4',
    date: new Date(2025, 11, 22),
    time: '1:00 PM',
    clientName: 'Emily Davis',
    propertyAddress: '321 Elm St, City, State 12345',
    phone: '(555) 456-7890',
    email: 'emily.d@email.com',
    notes: 'New installation consultation'
  },
  {
    id: '5',
    date: new Date(2025, 11, 25),
    time: '11:00 AM',
    clientName: 'Robert Wilson',
    propertyAddress: '654 Maple Dr, City, State 12345',
    phone: '(555) 567-8901',
    email: 'r.wilson@email.com',
    notes: 'Emergency roof repair'
  }
]

export const Appointments = () => {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPurchasedModal, setShowPurchasedModal] = useState(false)
  const [leads, setLeads] = useState<purchasedLeadType[]>([])
  const [selectedLead, setSelectedLead] = useState<string>('')
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date())
  const [appointmentTime, setAppointmentTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    const fetchLeads = async () => {
      const leadsData = await fetchContractorLeads()
      if (leadsData) {
        setLeads(leadsData.filter((lead: any) => lead.status !== 'close'))
      }
    }
    fetchLeads()
  }, [])

  const appointmentDates = mockAppointments.map(apt => apt.date)

  const getAppointmentsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []
    return mockAppointments.filter(apt => 
      format(apt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    )
  }

  const selectedAppointments = getAppointmentsForDate(date)

  const handleAddAppointment = async () => {
    if (!selectedLead) {
        toast.error('Please select a lead')
        return
      }
    if (!appointmentTime) {
      toast.error('Please select time')
      return
    }

    // try {
    //     const { data: authData } = await supabase.auth.getUser()
    //     const userId = authData?.user?.id

    //     if (!userId) {
    //       toast.error('User not logged in')
    //       return
    //     }

    //     const { error: leadError } = await supabase
    //       .from('Contractor_Leads')
    //       .insert({
    //         contractor_id: userId,
    //         'First Name': newLead.firstName,
    //         'Last Name': newLead.lastName,
    //         'Phone Number': newLead.phone,
    //         'Email Address': newLead.email,
    //         'Property Address': newLead.address,
    //         status: 'appointment_set'
    //       })

    //     if (leadError) throw leadError
      

    //   toast.success('Appointment scheduled successfully')
    //   setShowAddModal(false)
    //   setSelectedLead('')
    //   setAppointmentDate(new Date())
    //   setAppointmentTime('')
    //   setNewLead({
    //     firstName: '',
    //     lastName: '',
    //     phone: '',
    //     email: '',
    //     address: ''
    //   })
    // } catch (error) {
    //   console.error('Error scheduling appointment:', error)
    //   toast.error('Failed to schedule appointment')
    // }
  }

  async function handleBuyAppointments() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-appointment-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentAmount: 350,
        }),
      });
  
      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
          <p className="text-gray-600">Manage and track your appointments</p>
        </div>
        <div className="flex flex-col w-full lg:w-auto md:flex-row gap-3">
          <Button
            onClick={() => router.push("/contractor/purchase-leads")}
            className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add Purchase Leads</span>
          </Button>
          <Button
            onClick={() => setShowPurchasedModal(true)}
            className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Purchased Appointments</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md w-full border shadow-sm calendar-appointments"
                captionLayout="dropdown"
                fromYear={new Date().getFullYear() - 5}
                toYear={new Date().getFullYear() + 10}
                formatters={{
                  formatYearDropdown: (date) => date.getFullYear().toString(),
                  formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" })
                }}
                modifiers={{
                  hasAppointment: appointmentDates
                }}
                modifiersClassNames={{
                  hasAppointment: 'has-appointment'
                }}
              />
              <style dangerouslySetInnerHTML={{
                __html: `
                  .has-appointment {
                    position: relative;
                  }
                  .has-appointment::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #3b82f6;
                    z-index: 1;
                  }
                  .calendar-appointments button[aria-label*="Next"],
                  .calendar-appointments .rdp-button_next {
                    pointer-events: auto !important;
                    opacity: 1 !important;
                    cursor: pointer !important;
                  }
                  .calendar-appointments button[aria-label*="Next"][aria-disabled="true"],
                  .calendar-appointments .rdp-button_next[aria-disabled="true"] {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    cursor: pointer !important;
                    background-color: transparent !important;
                  }
                  .calendar-appointments button[aria-label*="Next"][aria-disabled="true"]:hover,
                  .calendar-appointments .rdp-button_next[aria-disabled="true"]:hover {
                    opacity: 1 !important;
                    background-color: rgba(0, 0, 0, 0.05) !important;
                  }
                `
              }}
               />
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">
                {date 
                  ? `Appointments for ${format(date, 'MMMM d, yyyy')}`
                  : 'Select a date to view appointments'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {date ? (
                selectedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="font-semibold text-lg">{appointment.clientName}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{appointment.propertyAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{appointment.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{appointment.email}</span>
                          </div>
                          {appointment.notes && (
                            <div className="flex items-start gap-2 pt-2 border-t">
                              <User className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div>
                                <span className="font-medium text-gray-700">Notes: </span>
                                <span>{appointment.notes}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No appointments scheduled for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Click on a date with an appointment to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">Schedule Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-black">Select Lead</Label>
                  <div className="space-y-3">
                    <Select value={selectedLead} onValueChange={setSelectedLead}>
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Choose a lead" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[350px] overflow-y-auto max-w-[300px]">
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead['First Name']} {lead['Last Name']} - {lead['Property Address']}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
              onClick={() => {
                setShowAddModal(false)
                setSelectedLead('')
                setAppointmentTime('')
                setNewLead({
                  firstName: '',
                  lastName: '',
                  phone: '',
                  email: '',
                  address: ''
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAppointment}
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
            >
              Mark as Appointment Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchasedModal} onOpenChange={setShowPurchasedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Lead Appointment – $350</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Buy pre-scheduled appointments and connect directly with ready-to-meet leads.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPurchasedModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {handleBuyAppointments()}}
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
