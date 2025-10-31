import { supabase } from "@/lib/supabase";
import { calculateDistance } from "@/lib/distanceFormula";

export async function freeLeadsAssign(userId: string) {
  try {
    console.log('freeLeadsAssign:start', { userId });
    // 1️⃣ Fetch contractor data
    const { data: contractor } = await supabase
      .from("Roofing_Auth")
      .select('"Latitude", "Longitude", "Service Radius", "Is Verified", "Full Name", "Business Address", "Phone Number"')
      .eq("user_id", userId)
      .single();

    if (!contractor) {
      console.warn("Contractor not found");
      return;
    }
    console.log('freeLeadsAssign:contractor', contractor);

    if (contractor["Is Verified"] !== "confirmed") {
      console.log("⛔ Contractor not verified, skipping auto-assign");
      return;
    }

    const contractorLat = contractor["Latitude"];
    const contractorLng = contractor["Longitude"];
    const contractorRadius = parseFloat(contractor["Service Radius"]) || 0;
    const contractorName = contractor["Full Name"] || "";
    const contractorPhone = contractor["Phone Number"] || "";
    const contractorBusinessAddress = contractor["Business Address"] || "";

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
    console.log('freeLeadsAssign:openLeads', leads);

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
    const requestedQty = 3;
    const leadsToAssign = matchingLeads.slice(0, requestedQty);
    const pendingCount = Math.max(0, requestedQty - leadsToAssign.length);
    const status = pendingCount === 0 ? "assigned" : "pending";
    console.log('freeLeadsAssign:matchingLeads', matchingLeads.length);
    console.log('freeLeadsAssign:requestedQty', requestedQty);
    console.log('freeLeadsAssign:toAssign', leadsToAssign.length);
    console.log('freeLeadsAssign:pendingCount', pendingCount);
    console.log('freeLeadsAssign:status', status);

    // 5️⃣ Create a Leads_Request record (tracks counts)
    console.log('freeLeadsAssign:createLeadsRequest', {
      contractorName,
      contractorPhone,
      contractorBusinessAddress,
      requestedQty,
      send: leadsToAssign.length,
      pending: pendingCount,
      status,
      contractor_id: userId,
    });
    const { data: newRequest, error: insertRequestError } = await supabase
      .from("Leads_Request")
      .insert([
        {
          Name: contractorName,
          "Phone Number": contractorPhone,
          "Business Address": contractorBusinessAddress,
          Price: 0,
          "Purchase Date": new Date().toISOString(),
          "No. of Leads": requestedQty,
          "Send Leads": leadsToAssign.length,
          "Pending Leads": pendingCount,
          Status: status,
          contractor_id: userId,
        },
      ])
      .select("id")
      .single();

    if (insertRequestError) {
      console.error('freeLeadsAssign:createLeadsRequest:error', insertRequestError);
      throw insertRequestError;
    }
    console.log('freeLeadsAssign:createLeadsRequest:ok', newRequest);

    const requestId = newRequest.id;

    // 6️⃣ Insert selected leads into Contractor_Leads
    if (leadsToAssign.length > 0) {
      const { error: insertCL } = await supabase
        .from("Contractor_Leads")
        .insert(
          leadsToAssign.map((lead) => ({
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
          }))
        );
      if (insertCL) {
        console.error('freeLeadsAssign:insertContractorLeads:error', insertCL);
        throw insertCL;
      }
      console.log('freeLeadsAssign:insertContractorLeads:ok');
    }

    // 7️⃣ Close assigned leads in Leads_Data
    if (leadsToAssign.length > 0) {
      const { error: updateLeadsErr } = await supabase
        .from("Leads_Data")
        .update({ Status: "close" })
        .in("id", leadsToAssign.map((l) => l.id));
      if (updateLeadsErr) {
        console.error('freeLeadsAssign:updateLeads:error', updateLeadsErr);
        throw updateLeadsErr;
      }
      console.log('freeLeadsAssign:updateLeads:ok');
    }

    // 8️⃣ Insert into Assigned_Leads with request_id
    if (leadsToAssign.length > 0) {
      const { error: insertAssignedErr } = await supabase
        .from("Assigned_Leads")
        .insert(
          leadsToAssign.map((lead) => ({
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
          }))
        );
      if (insertAssignedErr) {
        console.error('freeLeadsAssign:insertAssignedLeads:error', insertAssignedErr);
        throw insertAssignedErr;
      }
      console.log('freeLeadsAssign:insertAssignedLeads:ok');
    }

    // 9️⃣ Mark contractor as assigned so free assignment runs once
    const { error: updateContractorError } = await supabase
      .from("Roofing_Auth")
      .update({ "Is Verified": "assigned" })
      .eq("user_id", userId);

    if (updateContractorError) {
      console.error('freeLeadsAssign:updateContractor:error', updateContractorError);
      throw updateContractorError;
    }
    console.log('freeLeadsAssign:done');

  } catch (error) {
    console.error("❌ Error auto-assigning leads:", error);
  }
}
