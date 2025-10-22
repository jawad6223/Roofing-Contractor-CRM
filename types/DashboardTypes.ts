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

export interface sampleLeadType {
  id: number;
  firstName: string;
  lastName: string;
  propertyAddress: string;
  phone: string;
  email: string;
  price: number;
}

export interface purchaseFormType {
  quantity: string;
}

export interface leadsInfoType {
  id: string;
  zipCode: string;
  date: string;
  price: number;
  noOfLeads: number;
  receivedLeads: number;
  pendingLeads: number;
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
}

export interface  paymentMethodType {
  id: string;
  card_last4: string;
  expiry_date: string;
  cvv: string;
  card_holder_name: string;
  card_brand: string;
}