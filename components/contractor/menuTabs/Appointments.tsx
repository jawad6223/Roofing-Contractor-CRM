import { Button } from '@/components/ui/button'
import { Plus, ShoppingCart, Clock, MapPin, Phone, Mail, User, Calendar as CalendarIcon, Search, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { DayButton } from "react-day-picker"
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
import { fetchAppointmentPrice } from '@/lib/AppointmentPrice'

export const Appointments = () => {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPurchasedModal, setShowPurchasedModal] = useState(false)
  const [leads, setLeads] = useState<purchasedLeadType[]>([])
  const [appointments, setAppointments] = useState<appointmentType[]>([])
  const [selectedLead, setSelectedLead] = useState<string>('')
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(new Date())
  const [appointmentTime, setAppointmentTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leadSearchTerm, setLeadSearchTerm] = useState('')
  const [appointmentPrice, setAppointmentPrice] = useState<number>(0);
  const [sendAppointmentLoading, setSendAppointmentLoading] = useState(false);
  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  })
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastClickRef = useRef<{ date: Date; time: number } | null>(null)
  const dayButtonClicksRef = useRef<Map<string, { time: number; count: number }>>(new Map())

  useEffect(() => {
    const fetchAppointmentPriceData = async () => {
      const appointmentPriceData = await fetchAppointmentPrice();
      if (appointmentPriceData) {
        setAppointmentPrice((appointmentPriceData)['Price Per Appointment']);
      }
    };
    fetchAppointmentPriceData();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        return
      }
      const userId = authData.user.id

      const { data, error } = await supabase
        .from('Contractor_Leads')
        .select('*')
        .eq('contractor_id', userId)
        .eq('Appointment_Status', 'Yes')
        .not('Appointment_Date', 'is', null)
        .not('Appointment_Time', 'is', null)
        .order('Appointment_Date', { ascending: true })
        .order('Appointment_Time', { ascending: true })

      if (error) {
        console.error('Error fetching appointments:', error)
        return
      }

      if (data) {
        const transformedAppointments: appointmentType[] = data.map((lead: any) => {
          const appointmentDate = lead.Appointment_Date ? new Date(lead.Appointment_Date) : new Date()
          const timeStr = lead.Appointment_Time || ''
          const timeParts = timeStr.split(':')
          const formattedTime = timeParts.length >= 2 
            ? `${parseInt(timeParts[0]) % 12 || 12}:${timeParts[1]} ${parseInt(timeParts[0]) >= 12 ? 'PM' : 'AM'}`
            : ''

          return {
            id: lead.id.toString(),
            date: appointmentDate,
            time: formattedTime,
            clientName: `${lead['First Name'] || ''} ${lead['Last Name'] || ''}`.trim(),
            propertyAddress: lead['Property Address'] || '',
            phone: lead['Phone Number'] || '',
            email: lead['Email Address'] || '',
            notes: ''
          }
        })

        setAppointments(transformedAppointments)
      }
    } catch (error) {
      console.error('Error in fetchAppointments:', error)
    }
  }

  useEffect(() => {
    const fetchLeads = async () => {
      const leadsData = await fetchContractorLeads()
      if (leadsData) {
        setLeads(leadsData.filter((lead: any) => lead.status !== 'close' && lead.Appointment_Status !== 'Yes'))
      }
    }
    fetchLeads()
    fetchAppointments()
  }, [])

  const appointmentDates = appointments.map(apt => apt.date)

  const getAppointmentsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []
    return appointments.filter(apt => 
      format(apt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    )
  }

  const selectedAppointments = getAppointmentsForDate(date)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(selectedDate)
      return
    }

    const now = Date.now()
    const dateKey = format(selectedDate, 'yyyy-MM-dd')

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
    }

    if (lastClickRef.current) {
      const lastDateKey = format(lastClickRef.current.date, 'yyyy-MM-dd')
      const timeDiff = now - lastClickRef.current.time

      if (dateKey === lastDateKey && timeDiff < 500) {
        setDate(selectedDate)
        setAppointmentDate(selectedDate)
        setShowAddModal(true)
        lastClickRef.current = null
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
          clickTimeoutRef.current = null
        }
        return
      }
    }

    setDate(selectedDate)
    lastClickRef.current = { date: selectedDate, time: now }

    clickTimeoutRef.current = setTimeout(() => {
      lastClickRef.current = null
      clickTimeoutRef.current = null
    }, 500)
  }

  const selectTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const CustomDayButton = (props: React.ComponentProps<typeof DayButton>) => {
    const { day, onClick, ...restProps } = props

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!day) {
        onClick?.(e)
        return
      }

      const dateKey = format(day.date, 'yyyy-MM-dd')
      const now = Date.now()
      const clickData = dayButtonClicksRef.current.get(dateKey)
      
      const existingTimeout = selectTimeoutRef.current.get(dateKey)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
        selectTimeoutRef.current.delete(dateKey)
      }
      
      if (clickData) {
        const timeDiff = now - clickData.time
        if (timeDiff < 400) {
          e.preventDefault()
          e.stopPropagation()
          dayButtonClicksRef.current.delete(dateKey)
          handleDateDoubleClick(day.date)
          return
        }
      }

      dayButtonClicksRef.current.set(dateKey, { time: now, count: 1 })
      
      const timeout = setTimeout(() => {
        onClick?.(e)
        dayButtonClicksRef.current.delete(dateKey)
        selectTimeoutRef.current.delete(dateKey)
      }, 400)
      
      selectTimeoutRef.current.set(dateKey, timeout)
    }

    return (
      <CalendarDayButton
        {...restProps}
        day={day}
        onClick={handleClick}
      />
    )
  }

  const handleDateDoubleClick = (selectedDate: Date) => {
    setDate(selectedDate)
    setAppointmentDate(selectedDate)
    setShowAddModal(true)
  }

  const handleAddAppointment = async () => {
    setSendAppointmentLoading(true);
    if (!selectedLead) {
      toast.error('Please select a lead')
      setSendAppointmentLoading(false)
      return
    }
    if (!appointmentDate) {
      toast.error('Please select a date')
      setSendAppointmentLoading(false)
      return
    }
    if (!appointmentTime) {
      toast.error('Please select time')
      setSendAppointmentLoading(false)
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        toast.error('User not logged in')
        setSendAppointmentLoading(false)
        return
      }
      const userId = authData.user.id

      const formattedDate = format(appointmentDate, 'yyyy-MM-dd')
      const timeParts = appointmentTime.split(':')
      const selectedHour = parseInt(timeParts[0])
      const selectedMinute = parseInt(timeParts[1])
      const selectedTimeInMinutes = selectedHour * 60 + selectedMinute

      const { data: existingAppointments, error: checkError } = await supabase
        .from('Contractor_Leads')
        .select('Appointment_Time')
        .eq('contractor_id', userId)
        .eq('Appointment_Date', formattedDate)
        .not('Appointment_Time', 'is', null)
        .neq('id', selectedLead)

      if (checkError) {
        console.error('Error checking existing appointments:', checkError)
        toast.error('Failed to check appointment availability')
        setSendAppointmentLoading(false)
        return
      }

      if (existingAppointments && existingAppointments.length > 0) {
        for (const appointment of existingAppointments) {
          if (!appointment.Appointment_Time) continue
          
          const existingTimeParts = appointment.Appointment_Time.split(':')
          const existingHour = parseInt(existingTimeParts[0])
          const existingMinute = parseInt(existingTimeParts[1])
          const existingTimeInMinutes = existingHour * 60 + existingMinute

          const timeDifference = Math.abs(selectedTimeInMinutes - existingTimeInMinutes)
          
          if (timeDifference < 60) {
            toast.error(`Appointment time must be at least 1 hour apart from existing appointments.`)
            setSendAppointmentLoading(false)
            return
          }
        }
      }

      const { error: updateError } = await supabase
        .from('Contractor_Leads')
        .update({
          Appointment_Date: formattedDate,
          Appointment_Time: appointmentTime,
          Appointment_Status: 'Yes'
        })
        .eq('id', selectedLead)
        .eq('contractor_id', userId)

      if (updateError) {
        console.error('Error updating appointment:', updateError)
        toast.error('Failed to set appointment')
        setSendAppointmentLoading(false)
        return
      }

      toast.success('Appointment set successfully')
      setShowAddModal(false)
      setSelectedLead('')
      setAppointmentDate(new Date())
      setAppointmentTime('')

      const leadsData = await fetchContractorLeads()
      if (leadsData) {
        setLeads(leadsData.filter((lead: any) => lead.status !== 'close' && lead.Appointment_Status !== 'Yes'))
      }
      await fetchAppointments()
    } catch (error) {
      console.error('Error in handleAddAppointment:', error)
      toast.error('An error occurred while setting the appointment')
    } finally {
      setSendAppointmentLoading(false);
    }
  }

  async function handleBuyAppointments() {
    setIsLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        toast.error('User not logged in')
        setIsLoading(false)
        return
      }
      const contractorId = authData.user.id

      const response = await fetch("/api/create-appointment-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentAmount: appointmentPrice,
          contractorId: contractorId,
        }),
      });
  
      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create checkout session')
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
          onClick={() => setShowAddModal(true)}
          className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Add Appointment
        </Button>
          <Button
            onClick={() => router.push("/contractor/purchase-leads")}
            className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Purchase Leads</span>
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
                onSelect={handleDateSelect}
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
                components={{
                  DayButton: CustomDayButton
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
                  .calendar-appointments button[data-selected-single="true"] {
                    background-color: #122E5F !important;
                    color: white !important;
                    font-weight: 600 !important;
                  }
                  .calendar-appointments button[data-selected-single="true"]:hover {
                    background-color: #122E5F !important;
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
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">Schedule Appointment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <Label className="text-sm font-medium mb-2 block text-black">Select Lead</Label>
                  <div className="space-y-3">
                    <Select value={selectedLead} onValueChange={(value) => { setSelectedLead(value); setLeadSearchTerm(''); }}>
                      <SelectTrigger className="text-black h-auto py-3 px-4">
                        {selectedLead ? (() => {
                          const selectedLeadData = leads.find((lead) => lead.id.toString() === selectedLead);
                          if (!selectedLeadData) return <SelectValue placeholder="Choose a lead" />;
                          return (
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <div className="flex gap-1.5 text-xs font-semibold text-gray-600">
                                <User className="h-3 w-3 text-gray-400" />
                                <span className="truncate">{selectedLeadData['First Name']} {selectedLeadData['Last Name']}</span>
                              </div>
                              <div className="flex gap-1.5 text-xs text-gray-600">
                                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{selectedLeadData['Property Address']}</span>
                              </div>
                            </div>
                          );
                        })() : <SelectValue placeholder="Choose a lead" />}
                      </SelectTrigger>
                      <SelectContent position="popper" className="max-h-[400px] overflow-hidden w-[var(--radix-select-trigger-width)]">
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
                                lead['First Name']?.toLowerCase().includes(searchLower) ||
                                lead['Last Name']?.toLowerCase().includes(searchLower) ||
                                lead['Property Address']?.toLowerCase().includes(searchLower) ||
                                lead['Phone Number']?.includes(leadSearchTerm) ||
                                lead['Email Address']?.toLowerCase().includes(searchLower)
                              );
                            })
                            .map((lead) => (
                              <SelectItem 
                                key={lead.id} 
                                value={lead.id.toString()} 
                                className="py-3 px-4 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                              >
                                <div className="flex items-start justify-between gap-4 w-full ml-3 min-w-0">
                                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <div className="font-semibold flex items-start gap-1.5 text-xs text-gray-600">
                                      <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                                      <span className="truncate">{lead['First Name']} {lead['Last Name']}</span>
                                    </div>
                                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                                      <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                                      <span className="break-words leading-relaxed min-w-0">{lead['Property Address']}</span>
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          {leads.filter((lead) => {
                            if (!leadSearchTerm) return false;
                            const searchLower = leadSearchTerm.toLowerCase();
                            return (
                              lead['First Name']?.toLowerCase().includes(searchLower) ||
                              lead['Last Name']?.toLowerCase().includes(searchLower) ||
                              lead['Property Address']?.toLowerCase().includes(searchLower) ||
                              lead['Phone Number']?.includes(leadSearchTerm) ||
                              lead['Email Address']?.toLowerCase().includes(searchLower)
                            );
                          }).length === 0 && leadSearchTerm && (
                            <div className="py-6 text-center text-sm text-gray-500">
                              No leads found matching "{leadSearchTerm}"
                            </div>
                          )}
                        </div>
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
                    className="rounded-md border w-full"
                    captionLayout="dropdown"
                    fromYear={new Date().getFullYear() - 5}
                    toYear={new Date().getFullYear() + 10}
                    disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block text-black">Select Time</Label>
                  <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i
                        const time24 = `${hour.toString().padStart(2, '0')}:00`
                        const time12 = hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`
                        const currentHour = appointmentTime ? parseInt(appointmentTime.split(':')[0]) : null
                        const isSelected = currentHour === hour
                        const isPast = appointmentDate && (() => {
                          const today = new Date()
                          const selectedDate = new Date(appointmentDate)
                          selectedDate.setHours(hour, 0, 0, 0)
                          const todayDate = format(today, 'yyyy-MM-dd')
                          const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
                          return todayDate === selectedDateStr && selectedDate < today
                        })()
                        
                        return (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => setAppointmentTime(time24)}
                            disabled={isPast}
                            className={`
                              px-4 py-2 rounded-md text-sm font-medium transition-colors
                              ${isSelected 
                                ? 'bg-[#122E5F] text-white' 
                                : isPast
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }
                            `}
                          >
                            {time12}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="time" className="text-sm font-medium mb-2 block text-black">Or enter custom time</Label>
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
              disabled={sendAppointmentLoading}
            >
              {sendAppointmentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Appointment Set"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchasedModal} onOpenChange={setShowPurchasedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Lead Appointment – ${appointmentPrice}</DialogTitle>
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
