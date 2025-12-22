"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, X, AlertCircle } from "lucide-react";
import { useEffect, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const verifyAndCreate = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("invalid");
        return;
      }

      const res = await fetch(
        `/api/verify-appointment-session?session_id=${sessionId}`
      );
      const { paid, calendlyConnected, error } = await res.json();

      if (paid && !error) {
        if (calendlyConnected) {
          router.push("/contractor/appointment-info");
        } else {
          setStatus("connect-calendly");
        }
      } else {
        setStatus("failed");
      }
    };

    verifyAndCreate();
  }, [searchParams]);

  const handleConnectCalendly = async () => {
    const { data } = await supabase.auth.getUser();
    const contractorId = data?.user?.id;
  
    if (!contractorId) return;
  
    window.location.href = `/api/calendly/connect?contractorId=${contractorId}`;
  };
  

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-50"></div>

      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "checking" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#122E5F] mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your payment
            </p>
          </>
        )}

        {status === "connect-calendly" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful 🎉
            </h1>

            <p className="text-gray-600 mb-6">
              Please connect your Calendly to select your appointment date &
              time.
            </p>

            <Button
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white w-full"
              onClick={handleConnectCalendly}
            >
              Connect Calendly
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact support if you
              were charged.
            </p>
            <Button
              onClick={() => router.push("/contractor/appointments")}
              variant="outline"
            >
              Go Back
            </Button>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Session
            </h1>
            <p className="text-gray-600 mb-6">
              The payment session is invalid or expired.
            </p>
            <Button
              onClick={() => router.push("/contractor/appointments")}
              variant="outline"
            >
              Go Back
            </Button>
          </>
        )}

        {status === "already-processed" && (
          <>
            <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Already Processed
            </h1>
            <p className="text-gray-600 mb-6">
              This payment has already been processed.
            </p>
            <Button
              onClick={() => router.push("/contractor/appointments")}
              className="bg-[#122E5F] hover:bg-[#0f2347]/80 text-white"
            >
              Go to Appointments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AppointmentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#122E5F]"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
