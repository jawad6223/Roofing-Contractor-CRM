import { ReactNode } from 'react';

export interface crmDataType {
  id: string;
  name: string;
  phoneno: string;
  email: string;
  location: string;
  insuranceCompany: string;
  policy: string;
}

export interface purchasedLeadType {
  location: ReactNode;
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

export interface purchaseFormType {
  zipCode: string;
  quantity: string;
}

export interface requestLeadType {
  id: string;
  firstName: string;
  lastName: string;
  phoneno: string;
  noOfLeads: number;
  zipCode: string;
  status: string;
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