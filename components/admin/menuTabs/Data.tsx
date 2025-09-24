import { FileText, Users, DollarSign } from 'lucide-react';

// Leads Data
export const allLeads = [
    {
      id: 1,
      zipCode: '75201',
      firstName:'John',
      lastName:'Doe',
      phoneno:'1234567890',
      email:'john.doe@example.com',
      company:'ABC Inc',
      policy:'1234567890',
      status: "Available",
      assignedTo: null,
    },
    {
      id: 2,
      zipCode: '75202',
      firstName:'Jane',
      lastName:'Doe',
      phoneno:'1234567890',
      email:'jane.doe@example.com',
      company:'ABC Inc',
      policy:'1234567890',
      status: "Assigned",
      assignedTo: "Mike Rodriguez",
    },
    {
      id: 3,
      zipCode: '75203',
      firstName:'Jim',
      lastName:'Beam',
      phoneno:'1234567890',
      email:'jim.beam@example.com',
      company:'XYZ Corp',
      policy:'1234567890',
      status: "Closed",
      assignedTo: "Jennifer Martinez",
    },
    {
      id: 4,
      zipCode: '75204',
      firstName:'Sarah',
      lastName:'Johnson',
      phoneno:'0987654321',
      email:'sarah.johnson@example.com',
      company:'DEF Ltd',
      policy:'0987654321',
      status: "In Progress",
      assignedTo: "Robert Wilson",
    },
    {
      id: 5,
      zipCode: '75205',
      firstName:'Mike',
      lastName:'Wilson',
      phoneno:'5555555555',
      email:'mike.wilson@example.com',
      company:'GHI Inc',
      policy:'5555555555',
      status: "Available",
      assignedTo: null,
    }
  ];

  // contractors Data
  export const contractors = [
    {
      id: "C001",
      name: "Mike Rodriguez",
      company: "Elite Roofing Solutions",
      location: "Houston, TX",
      leadsAssigned: 12,
      leadsCompleted: 9,
      conversionRate: "75%",
      totalEarnings: "$252,000",
      leadsRequest: "10",
      zipCode: "75201",
      joinDate: "2023-06-15",
    },
    {
      id: "C002",
      name: "Jennifer Martinez",
      company: "Premier Roofing Co",
      location: "Dallas, TX",
      leadsAssigned: 15,
      leadsCompleted: 13,
      conversionRate: "87%",
      totalEarnings: "$364,000",
      leadsRequest: "10",
      zipCode: "75202",
      joinDate: "2023-04-22",
    },
    {
      id: "C003",
      name: "Robert Wilson",
      company: "Reliable Storm Solutions",
      location: "Austin, TX",
      leadsAssigned: 8,
      leadsCompleted: 6,
      conversionRate: "75%",
      totalEarnings: "$168,000",
      leadsRequest: "-",
      zipCode: "",
      joinDate: "2023-08-10",
    },
    
  ];

  // adminStats Data
  export const adminStats = [
    {
      title: "Total Leads",
      value: "2,847",
      change: "+12.5%",
      icon: FileText,
      color: "bg-[#122E5F]",
    },
    {
      title: "Active Contractors",
      value: "156",
      change: "+8.2%",
      icon: Users,
      color: "bg-[#286BBD]",
    },
    {
      time :'Last Month',
      title: "Total Sales",
      value: "$284,750",
      change: "+15.3%",
      icon: DollarSign,
      color: "bg-[#122E5F]",
    },
  ];

  // recentLeads Data
  export const recentLeads = [
    {
      id: "L001",
      homeowner: "John Smith",
      location: "Houston, TX",
      damageType: "Hail Damage",
      claimAmount: "$28,500",
      status: "Available",
      dateAdded: "2024-01-15",
      assignedTo: null,
    },
    {
      id: "L002",
      homeowner: "Sarah Johnson",
      location: "Dallas, TX",
      damageType: "Wind Damage",
      claimAmount: "$35,200",
      status: "Available",
      dateAdded: "2024-01-14",
      assignedTo: "Mike Rodriguez",
    },
    {
      id: "L003",
      homeowner: "David Chen",
      location: "Austin, TX",
      damageType: "Storm Damage",
      claimAmount: "$42,100",
      status: "Available",
      dateAdded: "2024-01-13",
      assignedTo: "Jennifer Martinez",
    },
    {
      id: "L004",
      homeowner: "Lisa Wilson",
      location: "San Antonio, TX",
      damageType: "Hail Damage",
      claimAmount: "$31,800",
      status: "Available",
      dateAdded: "2024-01-12",
      assignedTo: "Robert Wilson",
    },
  ];

  // leadPrice Data
  export const leadPricing = [
    {
      zipCode: "75201",
      firstName: "John",
      lastName: "Doe",
      phoneno: "1234567890",
      email: "john.doe@example.com",
      company: "ABC Inc",
      policy: "1234567890",
    },
    {
      zipCode: "75202",
      firstName: "Jane",
      lastName: "Doe",
      phoneno: "1234567890",
      email: "jane.doe@example.com",
      company: "ABC Inc",
      policy: "1234567890",
    },
    {
      zipCode: "75203",
      firstName: "Jim",
      lastName: "Beam",
      phoneno: "1234567890",
      email: "jim.beam@example.com",
      company: "ABC Inc",
      policy: "1234567890",
    },
  ];

  export const pricingTiers = [
    {
      id: 'basic',
      name: 'Basic Leads',
      description: 'Standard quality leads for new contractors',
      price: 45,
      features: ['Basic verification', 'Email support', '48hr delivery'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Leads',
      description: 'High-quality verified leads with insurance approval',
      price: 89,
      features: ['Insurance verified', 'Priority support', '24hr delivery', 'Damage photos'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      popular: true
    },
    {
      id: 'exclusive',
      name: 'Exclusive Leads',
      description: 'Premium leads shared with maximum 2 contractors',
      price: 149,
      features: ['Exclusive access', 'Dedicated manager', 'Instant delivery', 'Full documentation'],
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      popular: false
    }
  ];