import { Button } from "@/components/ui/button";
import {
  Plus,
  ShoppingCart,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar as CalendarIcon,
  Search,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { DayButton } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { appointmentType, purchasedLeadType } from "@/types/DashboardTypes";
import { fetchContractorLeads } from "./Data";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { fetchAppointmentPrice } from "@/lib/AppointmentPrice";

export const Appointments = () => {
  const router = useRouter();
  const [showPurchasedModal, setShowPurchasedModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentPrice, setAppointmentPrice] = useState<number>(0);

  useEffect(() => {
    const fetchAppointmentPriceData = async () => {
      const appointmentPriceData = await fetchAppointmentPrice();
      if (appointmentPriceData) {
        setAppointmentPrice(appointmentPriceData["Price Per Appointment"]);
      }
    };
    fetchAppointmentPriceData();
  }, []);

  async function handleBuyAppointments() {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        toast.error("User not logged in");
        setIsLoading(false);
        return;
      }
      const contractorId = authData.user.id;

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
      toast.error("Failed to create checkout session");
    } finally {
      setIsLoading(false);
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
          {/* <Button
            onClick={() => router.push("/contractor/purchase-leads")}
            className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Purchase Leads</span>
          </Button> */}
          {/* <Button
            onClick={() => setShowPurchasedModal(true)}
            className="bg-[#286BBD] hover:bg-[#1d4ed8] text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>Purchased Appointments</span>
          </Button> */}
        </div>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-2xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 text-center">
              Purchase Pre-Scheduled Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-3 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  What are Pre-Scheduled Appointments?
                </p>
                <p className="text-sm text-blue-800">
                  Leads that have confirmed availability and are ready to meet.
                  Pre-qualified and actively seeking roofing services.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#122E5F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Ready-to-Meet Leads
                    </p>
                    <p className="text-sm text-gray-600">
                      Connect with leads who have scheduled appointment times
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#122E5F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Pre-Qualified Prospects
                    </p>
                    <p className="text-sm text-gray-600">
                      Verified leads interested in your services
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#122E5F] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Save Time & Effort
                    </p>
                    <p className="text-sm text-gray-600">
                      Skip scheduling and meet potential clients directly
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Price per Appointment:
                  </span>
                  <span className="text-2xl font-bold text-[#122E5F]">
                    ${appointmentPrice}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    handleBuyAppointments();
                  }}
                  className="w-full bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPurchasedModal} onOpenChange={setShowPurchasedModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black">
              Purchase Pre-Scheduled Appointments
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-900 mb-1">
                What are Pre-Scheduled Appointments?
              </p>
              <p className="text-xs text-blue-800">
                Leads that have confirmed availability and are ready to meet.
                Pre-qualified and actively seeking roofing services.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#122E5F] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Ready-to-Meet Leads
                  </p>
                  <p className="text-xs text-gray-600">
                    Connect with leads who have scheduled appointment times
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#122E5F] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Pre-Qualified Prospects
                  </p>
                  <p className="text-xs text-gray-600">
                    Verified leads interested in your services
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#122E5F] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Save Time & Effort
                  </p>
                  <p className="text-xs text-gray-600">
                    Skip scheduling and meet potential clients directly
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">
                  Price per Appointment:
                </span>
                <span className="text-xl font-bold text-[#122E5F]">
                  ${appointmentPrice}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setShowPurchasedModal(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleBuyAppointments();
              }}
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
