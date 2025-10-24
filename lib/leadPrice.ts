import { supabase } from "./supabase";

export const fetchLeadPrice = async () => {
  try {
    const { data, error } = await supabase
      .from("Admin_Data")
      .select('"Price Per Lead"')
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching lead price:", error);
  }
};
