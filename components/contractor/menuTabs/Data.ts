import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";

export const crmData = [
    {
      id: '01',
      name: 'Michael Johnson',
      phoneno: '1234567890',
      email: 'michael.johnson@example.com',
      location: 'Houston, TX',
      insuranceCompany: 'State Farm',
      policy: '1234567890',
    },
    {
      id: '02',
      name: 'Jennifer Martinez',
      phoneno: '1234567890',
      email: 'jennifer.martinez@example.com',
      location: 'Dallas, TX',
      insuranceCompany: 'Allstate',
      policy: '1234567890',
    },
    {
      id: '03',
      name: 'Robert Wilson',
      phoneno: '1234567890',
      email: 'robert.wilson@example.com',
      location: 'Austin, TX',
      insuranceCompany: 'USAA',
      policy: '1234567890',
    },
    {
      id: '04',
      name: 'Sarah Thompson',
      phoneno: '1234567890',
      email: 'sarah.thompson@example.com',
      location: 'San Antonio, TX',
      insuranceCompany: 'Farmers',
      policy: '1234567890',
    },
    {
      id: '05',
      name: 'David Chen',
      phoneno: '1234567890',
      email: 'david.chen@example.com',
      location: 'Fort Worth, TX',
      insuranceCompany: 'State Farm',
      policy: '1234567890',
    }
  ];

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

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (angle: number) => (angle * Math.PI) / 180;
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  export const fetchMatchLeads = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      // Get contractor's location and service radius
      const { data: contractor } = await supabase
        .from("Roofing_Auth")
        .select('"Latitude", "Longitude", "Service Radius", "Full Name", "Business Address", "Phone Number"')
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

      // Get all open leads
      const { data: leads } = await supabase
        .from("Leads_Data")
        .select('*')
        .eq("Status", "open");

      if (!leads) return;

      // Calculate distance and filter leads within radius
      const matchingLeads = leads.filter(lead => {
        if (!lead["Latitude"] || !lead["Longitude"]) return false;
        
        const distance = haversineDistance(
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
  }

  export const purchasedLeads = [
    {
      id: '01',
      zipCode: '75201',
      firstName: 'John',
      lastName: 'Smith',
      phoneno: '(214) 555-0123',
      email: 'john.smith@email.com',
      location: 'Houston, TX',
      company: 'State Farm',
      policy: 'SF123456789',
      purchaseDate: '2024-01-15',
    },
    {
      id: '02',
      zipCode: '75202',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneno: '(214) 555-0456',
      email: 'sarah.johnson@email.com',
      location: 'Dallas, TX',
      company: 'Allstate',
      policy: 'AL987654321',
      purchaseDate: '2024-01-14',
    },
    {
      id: '03',
      zipCode: '75203',
      firstName: 'Michael',
      lastName: 'Davis',
      phoneno: '(214) 555-0789',
      email: 'michael.davis@email.com',
      location: 'Austin, TX',
      company: 'USA',
      policy: 'US456789123',
      purchaseDate: '2024-01-13',
    },
    {
      id: '04',
      zipCode: '75204',
      firstName: 'Jennifer',
      lastName: 'Wilson',
      phoneno: '(214) 555-0321',
      email: 'jennifer.wilson@email.com',
      location: 'San Antonio, TX',
      company: 'Farmers',
      policy: 'FM789123456',
      purchaseDate: '2024-01-12',
    },
  ];

  export const sampleLeads = [
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      propertyAddress: "75201",
      phone: "(555) 123-****",
      email: "john.sm***@email.com",
      price: 75,
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      propertyAddress: "75202",
      phone: "(555) 987-****",
      email: "sarah.jo***@email.com",
      price: 100,
    },
  ];

  export const LeadsInfo = [
    {
      id: '01',
      zipCode: '75201',
      date: '2024-01-15',
      price: 100,
      noOfLeads: 10,
      receivedLeads: 10,
      pendingLeads: 0,
    },
    {
      id: '02',
      zipCode: '75202',
      date: '2024-01-14',
      price: 100,
      noOfLeads: 6,
      receivedLeads: 3,
      pendingLeads: 3,
    },
    {
      id: '03',
      zipCode: '75203',
      date: '2024-01-13',
      price: 100,
      noOfLeads: 7,
      receivedLeads: 4,
      pendingLeads: 3,
    },
    {
      id: '04',
      zipCode: '75204',
      date: '2024-01-12',
      price: 100,
      noOfLeads: 5,
      receivedLeads: 0,
      pendingLeads: 5,
    },
    {
      id: '05',
      zipCode: '75205',
      date: '2024-01-11',
      price: 100,
      noOfLeads: 13,
      receivedLeads: 7,
      pendingLeads: 6,
    },
  ]

  export const teamMembers = [
    { name: 'Sarah Johnson', email: 'sarah@company.com', phoneno: '(214) 555-0123'},
    { name: 'Mike Davis', email: 'mike@company.com', phoneno: '(214) 555-0123'},
    { name: 'Lisa Chen', email: 'lisa@company.com', phoneno: '1234567890'}
  ]