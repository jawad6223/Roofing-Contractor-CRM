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
  created_at?: string;
  id: number;
  "First Name": string;
  "Last Name": string;
  "Phone Number": string;
  "Email Address": string;
  "Property Address": string;
  "Address": string;
  "Status": string;
  "Assigned Date": string;
  "Insurance Company": string;
  "Policy Number": string;
  "Assigned To": string | null;
  "Purchase Date": string;
  "Latitude"?: number;
  "Longitude"?: number;
}

export interface ContractorType {
  user_id: string;
  fullName: string;
  title: string;
  phoneno: string;
  email: string;
  businessAddress: string;
  serviceRadius: string;
  latitude?: number;
  longitude?: number;
}

export interface contractorDataType {
  user_id: string;
  fullName: string;
  title?: string;
  phoneno?: string;
  email?: string;
  businessAddress: string;
  serviceRadius: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  radius?: number;
  text?: string;
  color?: string;
}

export interface dashboardCardType {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  time?: string;
}

export interface settingType {
  fullName: string;
  email?: string;
  businessAddress: string;
  leads: string;
  latitude?: number;
  longitude?: number;
  appointmentPrice: string;
}

export interface requestLeadType {
  id: string;
  contractor_id: string;
  "Name": string;
  "Phone Number": string;
  "No. of Leads": number;
  "Price": number;
  "Purchase Date": string;
  "Assigned Date": string;
  "Send Leads": number | string;
  "Pending Leads": number | string;
  "Business Address": string;
  "Status": string;
}