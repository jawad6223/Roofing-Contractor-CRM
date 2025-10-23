"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { autoAssignLeads } from "@/lib/autoAssignLeads";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const verifyAndAssign = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("invalid");
        return;
      }

      // ✅ Check if this session has already been processed
      const { data: existing, error: checkError } = await supabase
        .from("Processed_Sessions")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking session:", checkError);
        return;
      }

      if (existing) {
        console.error("⚠️ Session already processed — skipping lead assignment");
        setStatus("already-processed");
        return;
      }

      // ✅ Verify Stripe session
      const res = await fetch(`/api/verify-session?session_id=${sessionId}`);
      const { paid, quantity } = await res.json();

      if (paid) {
        console.log("✅ Payment confirmed, assigning leads...");
        console.log("📊 Quantity purchased:", quantity);

        await autoAssignLeads(quantity);

        // 🧠 Mark this session as processed
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        await supabase.from("Processed_Sessions").insert([
          { session_id: sessionId, contractor_id: userId },
        ]);

        setStatus("success");
      } else {
        setStatus("failed");
      }
    };

    verifyAndAssign();
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
            onClick={() => router.push("/contractor/purchase-leads")}
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