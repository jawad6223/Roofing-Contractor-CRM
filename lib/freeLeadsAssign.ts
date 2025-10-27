import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distanceFormula";

export async function freeLeadsAssign(userId: string) {
  try {
    // 1️⃣ Fetch contractor data
    const { data: contractor } = await supabase
      .from("Roofing_Auth")
      .select('"Latitude", "Longitude", "Service Radius", "Is Verified"')
      .eq("user_id", userId)
      .single();

    if (!contractor) {
      console.warn("Contractor not found");
      return;
    }

    if (contractor["Is Verified"] !== "confirmed") {
      console.log("⛔ Contractor not verified, skipping auto-assign");
      return;
    }

    const contractorLat = contractor["Latitude"];
    const contractorLng = contractor["Longitude"];
    const contractorRadius = parseFloat(contractor["Service Radius"]) || 0;

    if (!contractorLat || !contractorLng) {
      console.warn("Contractor location missing");
      return;
    }

    // 2️⃣ Fetch open leads
    const { data: leads, error: leadsError } = await supabase
      .from("Leads_Data")
      .select("*")
      .eq("Status", "open");

    if (leadsError) throw leadsError;
    if (!leads || leads.length === 0) return;

    // 3️⃣ Filter leads within radius
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

    if (matchingLeads.length === 0) return;

    // 4️⃣ Limit to 3 leads max
    const leadsToAssign = matchingLeads.slice(0, 3);

    // 5️⃣ Insert into Contractor_Leads
    const { error: insertError } = await supabase.from("Contractor_Leads").insert(
      leadsToAssign.map((lead) => ({
        contractor_id: userId,
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
      }))
    );

    if (insertError) throw insertError;

    // 6️⃣ Update assigned leads in Leads_Data → closed
    const assignedLeadEmails = leadsToAssign.map((l) => l["Email Address"]);

    const { error: updateError } = await supabase
      .from("Leads_Data")
      .update({ Status: "close" })
      .in("Email Address", assignedLeadEmails);

    if (updateError) throw updateError;

    // 7️⃣ ✅ Update contractor status so they don’t get more free leads
    const { error: updateContractorError } = await supabase
      .from("Roofing_Auth")
      .update({ "Is Verified": "assigned" })
      .eq("user_id", userId);

    if (updateContractorError) throw updateContractorError;

  } catch (error) {
    console.error("❌ Error auto-assigning leads:", error);
  }
}
