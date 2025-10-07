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
  id: number;
  firstName: string;
  lastName: string;
  phoneno: string;
  email: string;
  zipCode: string;
  company: string;
  policy: string;
  assignedTo: string | null;
  purchaseDate: string;
}

export interface ContractorType {
  id: string;
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
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  time?: string;
}

export interface settingType {
  fullName: string;
  email: string;
  serviceRadius: string;
  businessAddress: string;
  leads: string;
}

export interface requestLeadType {
  id: string;
  firstName: string;
  lastName: string;
  phoneno: string;
  noOfLeads: number;
  receivedLeads: number | string;
  pendingLeads: number | string;
  zipCode: string;
  status: string;
}