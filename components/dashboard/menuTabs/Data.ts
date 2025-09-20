 export const crmData = [
    {
      id: 'L001',
      homeowner: 'Michael Johnson',
      location: 'Houston, TX',
      damageType: 'Hail Damage',
      claimAmount: '$32,500',
      status: 'Closed',
      dateAdded: '2024-01-10',
      closedDate: '2024-01-15'
    },
    {
      id: 'L002',
      homeowner: 'Jennifer Martinez',
      location: 'Dallas, TX',
      damageType: 'Storm Damage',
      claimAmount: '$45,800',
      status: 'Closed',
      dateAdded: '2024-01-08',
      closedDate: '2024-01-14'
    },
    {
      id: 'L003',
      homeowner: 'Robert Wilson',
      location: 'Austin, TX',
      damageType: 'Wind Damage',
      claimAmount: '$28,900',
      status: 'Closed',
      dateAdded: '2024-01-05',
      closedDate: '2024-01-12'
    },
    {
      id: 'L004',
      homeowner: 'Sarah Thompson',
      location: 'San Antonio, TX',
      damageType: 'Hail Damage',
      claimAmount: '$38,200',
      status: 'Closed',
      dateAdded: '2024-01-03',
      closedDate: '2024-01-11'
    },
    {
      id: 'L005',
      homeowner: 'David Chen',
      location: 'Fort Worth, TX',
      damageType: 'Water Damage',
      claimAmount: '$41,600',
      status: 'Closed',
      dateAdded: '2024-01-01',
      closedDate: '2024-01-09'
    }
  ];

 export const leadPricing = [
    {
      zipCode: '75201',
      firstName:'John',
      lastName:'Doe',
      phoneno:'1234567890',
      email:'john.doe@example.com',
      company:'ABC Inc',
      policy:'1234567890'

    },
    {
      zipCode: '75202',
      firstName:'Jane',
      lastName:'Doe',
      phoneno:'1234567890',
      email:'jane.doe@example.com',
      company:'ABC Inc',
      policy:'1234567890'
    },
    {
      zipCode: '75203',
      firstName:'Jim',
      lastName:'Beam',
      phoneno:'1234567890',
      email:'jim.beam@example.com',
      company:'ABC Inc',
      policy:'1234567890'
    }
  ];

  export const purchasedLeads = [
    {
      id: 'PL001',
      zipCode: '75201',
      firstName: 'John',
      lastName: 'Smith',
      phoneno: '(214) 555-0123',
      email: 'john.smith@email.com',
      company: 'State Farm',
      policy: 'SF123456789',
      claimAmount: '$32,500',
      damageType: 'Hail Damage',
      status: 'New',
      purchaseDate: '2024-01-15',
      leadType: 'Premium'
    },
    {
      id: 'PL002',
      zipCode: '75202',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneno: '(214) 555-0456',
      email: 'sarah.johnson@email.com',
      company: 'Allstate',
      policy: 'AL987654321',
      claimAmount: '$45,800',
      damageType: 'Storm Damage',
      status: 'Contacted',
      purchaseDate: '2024-01-14',
      leadType: 'Exclusive'
    },
    {
      id: 'PL003',
      zipCode: '75203',
      firstName: 'Michael',
      lastName: 'Davis',
      phoneno: '(214) 555-0789',
      email: 'michael.davis@email.com',
      company: 'USAA',
      policy: 'US456789123',
      claimAmount: '$28,900',
      damageType: 'Wind Damage',
      status: 'In Progress',
      purchaseDate: '2024-01-13',
      leadType: 'Premium'
    },
    {
      id: 'PL004',
      zipCode: '75204',
      firstName: 'Jennifer',
      lastName: 'Wilson',
      phoneno: '(214) 555-0321',
      email: 'jennifer.wilson@email.com',
      company: 'Farmers',
      policy: 'FM789123456',
      claimAmount: '$38,200',
      damageType: 'Hail Damage',
      status: 'Quote Sent',
      purchaseDate: '2024-01-12',
      leadType: 'Basic'
    }
  ];

  export const teamMembers = [
    { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Sales Manager', status: 'Active' },
    { name: 'Mike Davis', email: 'mike@company.com', role: 'Lead Coordinator', status: 'Active' },
    { name: 'Lisa Chen', email: 'lisa@company.com', role: 'Project Manager', status: 'Pending' }
  ]