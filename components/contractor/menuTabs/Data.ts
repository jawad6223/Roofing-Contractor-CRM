import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { calculateDistance } from "@/lib/distanceFormula";

export const fetchContractorLeads = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      toast.error("User not logged in");
      return;
    }
    const userId = authData.user.id;

    const { data, error } = await supabase
      .from("Contractor_Leads")
      .select("*")
      .eq("contractor_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching contractor leads:", error);
    toast.error("Failed to fetch leads");
  }
};

export const fetchMatchLeads = async () => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    const { data: contractor } = await supabase
      .from("Roofing_Auth")
      .select(
        '"Latitude", "Longitude", "Service Radius", "Full Name", "Business Address", "Phone Number"'
      )
      .eq("user_id", userId)
      .single();

    if (!contractor) {
      toast.error("Contractor data not found");
      return;
    }

    const contractorLat = contractor["Latitude"];
    const contractorLng = contractor["Longitude"];
    const contractorRadius = parseFloat(contractor["Service Radius"]) || 0;

    if (!contractorLat || !contractorLng) {
      toast.error("Contractor location not set");
      return;
    }

    const { data: leads } = await supabase
      .from("Leads_Data")
      .select("*")
      .eq("Status", "open");

    if (!leads) return;

    // Calculate distance and filter leads within radius
    const matchingLeads = leads.filter((lead) => {
      if (!lead["Latitude"] || !lead["Longitude"]) return false;

      const distance = calculateDistance(
        contractorLat,
        contractorLng,
        lead["Latitude"],
        lead["Longitude"]
      );

      return distance <= contractorRadius;
    });

    return matchingLeads;
  } catch (error) {
    console.error("Error fetching matching leads:", error);
    toast.error("Failed to fetch matching leads");
  }
};

export const fetchTeamMembers = async () => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      toast.error("User not logged in");
      return;
    }
    const userId = authData.user.id;
    const { data, error } = await supabase
      .from("Team_Members")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    toast.error("Failed to fetch team members");
  }
};