export interface AdminDashboardProps {
  children: React.ReactNode;
}

export interface AdminSectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

export interface sidebarItemsType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

export interface LeadType {
  id: string;
  "First Name": string;
  "Last Name": string;
  "Phone Number": string;
  "Email Address": string;
  "Property ZIP Code": string;
  "Address": string;
  "Status": string;
  "Assigned Date": string;
  "Insurance Company": string;
  "Policy Number": string;
  "Assigned To": string | null;
  "Purchase Date": string;
}

export interface ContractorType {
  user_id: string;
  fullName: string;
  title: string;
  phoneno: string;
  email: string;
  businessAddress: string;
  serviceRadius: string;
}

export interface dashboardCardType {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  time?: string;
}

export interface settingType {
  fullName: string;
  email: string;
  businessAddress: string;
  leads: string;
}

export interface requestLeadType {
  id: string;
  firstName: string;
  lastName: string;
  phoneno: string;
  noOfLeads: number;
  price: number;
  date: string;
  assignedDate: string;
  receivedLeads: number | string;
  pendingLeads: number | string;
  zipCode: string;
  status: string;
}