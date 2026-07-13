export interface ClientMilestone {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  order_index: number;
}

export interface ClientTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  is_client_visible: boolean;
  due_date: string | null;
}

export interface ClientProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  deadline: string | null;
  created_at: string;
  milestones: ClientMilestone[];
  tasks: ClientTask[];
}

export interface ClientInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  projects: {
    name: string;
  } | null;
}

export interface ClientTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  sla_deadline: string | null;
  created_at: string;
  resolved_at: string | null;
  project_id: string | null;
  projects: {
    name: string;
  } | null;
}

export interface ClientContract {
  id: string;
  title: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  total_value: number;
  created_at: string;
}

export interface ClientPayment {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: string | null;
  reference_number: string | null;
  invoices: {
    invoice_number: string;
    amount: number;
    projects: {
      name: string;
    } | null;
  };
}

export interface ClientDomain {
  id: string;
  domain_name: string;
  status: string;
  registrar: string | null;
  expiry_date: string;
  auto_renew: boolean | null;
}

export interface ClientHosting {
  id: string;
  name: string;
  provider: string | null;
  status: string;
  server_type: string | null;
  expiry_date: string | null;
}
