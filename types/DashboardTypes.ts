export interface PurchasedLead {
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
  leadType: string;
  quantity: string;
  zipCode: string;
  maxBudget: string;
  notes: string;
}

export interface DashBoardProps {
    onTabChange: (tabName: string) => void;
  }