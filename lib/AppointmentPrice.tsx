import { supabase } from "./supabase";

export const fetchAppointmentPrice = async () => {
  try {
    const { data, error } = await supabase
      .from("Admin_Data")
      .select('"Price Per Appointment"')
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching appointment price:", error);
  }
};
