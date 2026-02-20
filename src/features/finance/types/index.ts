export interface Payment {
  id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference_number: string;
  invoices: {
    invoice_number: string;
    clients: {
      name: string;
    } | null;
  } | null;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
  clients: {
    name: string;
  } | null;
  projects: {
    name: string;
  } | null;
}
