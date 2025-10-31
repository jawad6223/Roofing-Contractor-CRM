export interface DashboardSectionPageProps {
  params: {
    section: string;
  };
}

export interface CrmDashboardProps {
  children: React.ReactNode;
}

export interface crmDataType {
  "First Name": string;
  "Last Name": string;
  "Phone Number": string;
  "Email Address": string;
  "Property Address": string;
  "Insurance Company": string;
  "Policy Number": string;
  "status": string;
}

export interface purchasedLeadType {
  id: string;
  "First Name": string;
  "Last Name": string;
  "Phone Number": string;
  "Email Address": string;
  "Property Address": string;
  "Insurance Company": string;
  "Policy Number": string;
  "Purchase Date": string;
  "status": string;
}

export interface premiumLeadType {
  id: number;
  "First Name": string;
  "Last Name": string;
  "Property Address": string;
  "Phone Number": string;
  "Email Address": string;
  "Price": number;
}

export interface purchaseFormType {
  quantity: string;
}

export interface leadsInfoType {
  id: string;
  "Business Address": string;
  "Purchase Date": string;
  "Price": number;
  "No. of Leads": number;
  "Send Leads": number;
  "Pending Leads": number;
}

export interface teamMemberType {
  Full_Name: string;
  Email_Address: string;
  Phone_Number: string;
}

export interface settingType {
  fullName: string;
  email?: string;
  serviceRadius: string;
  businessAddress: string;
  latitude?: number;
  longitude?: number;
  phoneNumber: string;
}

export interface  paymentMethodType {
  id: string;
  card_last4: string;
  expiry_date: string;
  cvv: string;
  card_holder_name: string;
  card_brand: string;
}