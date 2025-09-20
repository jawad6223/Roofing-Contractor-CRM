export interface Lead {
  id: number;
  zipCode: string;
  firstName: string;
  lastName: string;
  phoneno: string;
  email: string;
  company: string;
  policy: string;
  status: string;
  assignedTo: string | null;
}

export interface Contractor {
  id: string;
  name: string;
  company: string;
  location: string;
  leadsAssigned: number;
  leadsCompleted: number;
  conversionRate: string;
  totalEarnings: string;
  status: string;
  joinDate: string;
}