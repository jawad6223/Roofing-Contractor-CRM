"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function SuccessContent() {
const router = useRouter();

const searchParams = useSearchParams();

useEffect(() => {
  const verifyAndAssignLead = async () => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const res = await fetch(`/api/verify-premium-session?session_id=${sessionId}`);
    const { paid, lead_id, user_id } = await res.json();

    if (paid && lead_id && user_id) {
      console.log("✅ Payment confirmed for lead:", lead_id);

      // Get lead details
      const { data: lead } = await supabase
        .from("Leads_Data")
        .select("*")
        .eq("id", lead_id)
        .single();

      if (!lead) return;

      // Add to Contractor_Leads
      await supabase.from("Contractor_Leads").insert([
        {
          contractor_id: user_id,
          lead_id: lead.id,
          "First Name": lead["First Name"],
          "Last Name": lead["Last Name"],
          "Phone Number": lead["Phone Number"],
          "Email Address": lead["Email Address"],
          "Property Address": lead["Property Address"],
          "Insurance Company": lead["Insurance Company"],
          "Policy Number": lead["Policy Number"],
          "Latitude": lead["Latitude"],
          "Longitude": lead["Longitude"],
          status: "open",
        },
      ]);

      // Close the lead in Leads_Data
      await supabase.from("Leads_Data").update({ Status: "close" }).eq("id", lead_id);
    }
  };

  verifyAndAssignLead();
}, [searchParams]);



  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="text-center max-w-lg w-full relative z-10">
        {/* Main Success Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 border border-white/20">
          {/* Success Icon with Glow */}
          <div className="w-20 h-20 bg-[#122E5F] hover:bg-[#0f2347] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce">
            <CheckCircle className="h-10 w-10 text-white drop-shadow-lg" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-black mb-4 bg-[#122E5F] hover:bg-[#0f2347] bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">
            Your payment has been processed successfully
          </p>

          {/* Status Card */}
          <div className="bg-[#F5F5F5] rounded-2xl p-6 mb-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <div className="w-2 h-2 bg-[#286BBD] rounded-full mr-2 animate-pulse"></div>
              <h3 className="text-base font-bold text-gray-800">
                Request Status
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-3">
              ✅ Your lead request has been{" "}
              <span className="text-[#286BBD] font-bold">submitted</span> and
              payment{" "}
              <span className="text-[#122E5F] font-bold">confirmed</span>
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              🚀 Our team will process your request and provide you with{" "}
              <span className="text-[#286BBD] font-semibold">
                qualified leads
              </span>{" "}
              within{" "}
              <span className="text-[#122E5F] font-bold">24-48 hours</span>
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/contractor")}
            className="w-full bg-[#122E5F] hover:bg-[#0f2347] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center">
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#122E5F]"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}