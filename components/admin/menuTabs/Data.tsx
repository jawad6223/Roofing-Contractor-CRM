import { FileText, Users, DollarSign } from 'lucide-react';

// Leads Data
export const allLeads = [
    {
      id: 1,
      firstName:'John',
      lastName:'Doe',
      phoneno:'1234567890',
      email:'john.doe@example.com',
      zipCode: '75201',
      company:'ABC Inc',
      policy:'1234567890',
      assignedTo: null,
      purchaseDate: '2024-01-15',
    },
    {
      id: 2,
      zipCode: '75202',
      firstName:'Jane',
      lastName:'Smith',
      phoneno:'1234567890',
      email:'jane.doe@example.com',
      company:'ABC Inc',
      policy:'1234567890',
      assignedTo: "Mike Rodriguez",
      purchaseDate: '2024-01-14',
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
      assignedTo: "Jennifer Martinez",
      purchaseDate: '2024-01-13',
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
      assignedTo: "Robert Wilson",
      purchaseDate: '2024-01-12',
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
      assignedTo: null,
      purchaseDate: '2024-01-11',
    }
  ];

  // contractors Data
  export const contractors = [
    {
      id: "01",
      fullName: "Mike Rodriguez",
      title: "manager",
      phoneno: "1234567890",
      email: "mike.rodriguez@example.com",
      location: "Houston, TX",
      serviceRadius: "100 miles",
    },
    {
      id: "02",
      fullName: "Jennifer Martinez",
      title: "manager",
      phoneno: "1234567890",
      email: "jennifer.martinez@example.com",
      location: "Dallas, TX",
      serviceRadius: "26 miles",
    },
    {
      id: "03",
      fullName: "Robert Wilson",
      title: "Contractor",
      phoneno: "1234567890",
      email: "robert.wilson@example.com",
      location: "Austin, TX",
      serviceRadius: "90 miles",
    },
    
  ];

  // adminStats Data
  export const dashboardCard = [
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