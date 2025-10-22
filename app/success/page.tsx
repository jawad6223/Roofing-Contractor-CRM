"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const router = useRouter();

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (angle: number) => (angle * Math.PI) / 180;
    const R = 3958.8; // Earth radius in miles
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  }
  

  useEffect(() => {
    const getUserAfterPayment = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (!authData?.user) throw new Error("User not found");
    
        const userId = authData.user.id;
    
        // 1. Get contractor location and radius (in miles)
        const { data: userData, error: userError } = await supabase
          .from("Roofing_Auth")
          .select('"Latitude", "Longitude", "Service Radius"')
          .eq("user_id", userId)
          .single();
    
        if (userError || !userData) {
          console.error("Error fetching user coordinates:", userError);
          return;
        }
    
        const contractorLat = userData["Latitude"];
        const contractorLng = userData["Longitude"];
        const contractorRadius = userData["Service Radius"]; // in miles
    
        console.log("Contractor location and radius:", contractorLat, contractorLng, contractorRadius);
    
        // 2. Fetch all leads (clients)
        const { data: leads, error: leadsError } = await supabase
      .from("Leads_Data")
      .select('id, "Latitude", "Longitude", Status')
      .eq("Status", "open");
    
        if (leadsError || !leads) {
          console.error("Error fetching leads:", leadsError);
          return;
        }
    
        // 3. Filter leads within contractor's radius
        const matchingLeads = leads.filter(lead => {
          const distance = haversineDistance(
            contractorLat,
            contractorLng,
            lead["Latitude"],
            lead["Longitude"]
          );
    
          return distance <= contractorRadius;
        });
    
        console.log("Matched leads within service area:", matchingLeads);
        
        // Optional: return or store matched leads
        return matchingLeads;
    
      } catch (error) {
        console.error("Error fetching user after payment:", error);
      }
    };
    

    getUserAfterPayment();
  }, []);

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