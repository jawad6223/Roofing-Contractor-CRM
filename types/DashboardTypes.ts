export interface DashboardSectionPageProps {
  params: {
    section: string;
  };
}

export interface CrmDashboardProps {
  children: React.ReactNode;
}

export interface crmDataType {
  name: string;
  phoneno: string;
  email: string;
  location: string;
  insuranceCompany: string;
  policy: string;
}

export interface purchasedLeadType {
  location: string;
  id: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  phoneno: string;
  email: string;
  company: string;
  policy: string;
  purchaseDate: string;
}

export interface sampleLeadType {
  id: number;
  firstName: string;
  lastName: string;
  zipCode: string;
  phone: string;
  email: string;
  price: number;
}

export interface purchaseFormType {
  zipCode: string;
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
  name: string;
  email: string;
  phoneno: string;
}

export interface settingType {
  fullName: string;
  email: string;
  serviceRadius: string;
  businessAddress: string;
}

export interface  paymentMethodType {
  id: string;
  card_last4: string;
  expiry_date: string;
  cvv: string;
  cardholderName: string;
  card_brand: string;
}