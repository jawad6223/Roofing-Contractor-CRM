import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distanceFormula";
import { fetchLeadPrice } from "./leadPrice";

export async function autoAssignLeads(quantity: number) {
  const leadPriceData = await fetchLeadPrice();
  const pricePerLead = leadPriceData ? leadPriceData['Price Per Lead'] : 0;
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) throw new Error("User not logged in");

    console.log("🎯 Auto-assigning leads for quantity:", quantity);
    console.log('userId', userId);

    const { data: contractor } = await supabase
      .from("Roofing_Auth")
      .select('"Latitude", "Longitude", "Service Radius", "Full Name", "Business Address", "Phone Number"')
      .eq("user_id", userId)
      .single();

    if (!contractor) return;

    const contractorLat = contractor["Latitude"];
    const contractorLng = contractor["Longitude"];
    const contractorRadius = parseFloat(contractor["Service Radius"]);
    const contractorPhone = contractor["Phone Number"];
    const contractorBusinessAddress = contractor["Business Address"];

    const { data: leads } = await supabase
      .from("Leads_Data")
      .select('*')
      .eq("Status", "open");

    if (!leads) return;

    const matchingLeads = leads.filter(lead => {
        const distance = calculateDistance(
          contractorLat,
          contractorLng,
          lead["Latitude"],
          lead["Longitude"]
        );
  
        return distance <= contractorRadius;
      });

    console.log("📍 Total matching leads found:", matchingLeads.length);
    console.log("🎯 Quantity requested:", quantity);

    // Filter to only return the requested quantity of leads
    const leadsToAssign = matchingLeads.slice(0, quantity);
    const status = quantity > leadsToAssign.length ? "pending" : "assigned";
    console.log("📋 Selected leads:", leadsToAssign);

    // 5️⃣ Insert into Leads_Request table
    const { data: newRequest, error: insertError } = await supabase.from("Leads_Request")
    .insert([
      {
        Name: contractor["Full Name"],
        "Phone Number": contractorPhone,
        "Business Address": contractorBusinessAddress,
        Price: pricePerLead,
        "Purchase Date": new Date().toISOString(),
        "No. of Leads": quantity,
        "Send Leads": leadsToAssign.length,
        "Pending Leads": quantity - leadsToAssign.length,
        Status: status,
        contractor_id: userId,
      },
    ])
    .select("id")
    .single();

    if (insertError) throw insertError;

    const requestId = newRequest.id;

    console.log(`📦 Lead request added with status: ${status}`);

    // Update lead status to assigned
    const { error: updateError } = await supabase.from("Leads_Data").update({
        Status: "close",
    }).in("id", leadsToAssign.map(lead => lead.id));

    if (updateError) throw updateError;

    console.log("✅ Leads updated to closed status");

    // add leads to contractor leads table
    const { error: insertLeadsError } = await supabase.from("Contractor_Leads").insert(leadsToAssign.map(lead => ({
        contractor_id: userId,
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

    })));
    if (insertLeadsError) throw insertLeadsError;

    console.log("✅ Leads added to contractor leads table");

    // add leads to the assigned leads table
    const { error: insertAssignedLeadsError } = await supabase.from("Assigned_Leads").insert(leadsToAssign.map(lead => ({
        contractor_id: userId,
        request_id: requestId,
        "First Name": lead["First Name"],
        "Last Name": lead["Last Name"],
        "Phone Number": lead["Phone Number"],
        "Email Address": lead["Email Address"],
        "Property Address": lead["Property Address"],
        "Insurance Company": lead["Insurance Company"],
        "Policy Number": lead["Policy Number"],
        "Assigned Date": new Date().toISOString(),
        "Latitude": lead["Latitude"],
        "Longitude": lead["Longitude"],
    })));

    if (insertAssignedLeadsError) throw insertAssignedLeadsError;

    console.log("✅ Leads added to assigned leads table");

    console.log("✅ Leads added to contractor leads table");
  } catch (error) {
    console.error("Auto assignment error:", error);
  }
}
