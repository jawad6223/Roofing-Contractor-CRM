import { ReactNode } from 'react';

export interface PurchasedLead {
  location: ReactNode;
  id: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  phoneno: string;
  email: string;
  company: string;
  policy: string;
  claimAmount: string;
  damageType: string;
  status: string;
  purchaseDate: string;
  leadType: string;
}

export interface PurchaseForm {
  zipCode: string;
  quantity: string;
}
