export interface Inquiry {
  id: string;
  title: string;
  budget_estimate: number;
  status: string;
  created_at: string;
  clients: {
    name: string;
  } | null;
}

export interface Contract {
  id: string;
  title: string;
  total_value: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  clients: {
    name: string;
  } | null;
}

export interface Quotation {
  id: string;
  total_amount: number;
  status: string;
  valid_until: string | null;
  created_at: string;
  clients: {
    name: string;
  } | null;
  inquiries: {
    title: string;
  } | null;
}
