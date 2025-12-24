import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Calendar as CalendarIcon, CheckCircle2, Clock, Sparkles, ArrowRight, DollarSign, TrendingUp, Users, Zap, Shield, Target, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-4xl border-0 shadow-lg">
          <CardHeader className="bg-white border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#122E5F]/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-[#122E5F]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Purchase Pre-Scheduled Appointments
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Get ready-to-meet leads with confirmed availability
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-2xl font-bold text-[#122E5F]">${appointmentPrice}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#2563eb] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      What are Pre-Scheduled Appointments?
                    </p>
                    <p className="text-sm text-gray-700">
                      Leads that have confirmed availability and are ready to meet. Pre-qualified and actively seeking roofing services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#122E5F] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Ready-to-Meet Leads
                  </p>
                  <p className="text-xs text-gray-600">
                    Connect with leads who have scheduled appointment times
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#122E5F] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Pre-Qualified Prospects
                  </p>
                  <p className="text-xs text-gray-600">
                    Verified leads interested in your services
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#122E5F] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Save Time & Effort
                  </p>
                  <p className="text-xs text-gray-600">
                    Skip scheduling and meet potential clients directly
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    handleBuyAppointments();
                  }}
                  className="w-full bg-[#122E5F] hover:bg-[#0f2347] text-white font-semibold py-6 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#122E5F]" />
              Why Choose Pre-Scheduled Appointments?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Higher Conversion Rates</p>
                  <p className="text-xs text-gray-600">Pre-scheduled leads are more likely to convert since they've already committed to meeting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Faster Sales Cycle</p>
                  <p className="text-xs text-gray-600">Skip the scheduling phase and go straight to meeting qualified prospects</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Better Time Management</p>
                  <p className="text-xs text-gray-600">Plan your schedule more effectively with confirmed appointment times</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#122E5F]" />
              Quick Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#122E5F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Purchase</p>
                  <p className="text-xs text-gray-600">Buy appointments based on your availability</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#122E5F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Receive Leads</p>
                  <p className="text-xs text-gray-600">Get matched with confirmed appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#122E5F] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Meet & Close</p>
                  <p className="text-xs text-gray-600">Attend scheduled meetings and close deals</p>
                </div>
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
