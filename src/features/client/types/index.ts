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
  created_at: string;
  projects: {
    name: string;
  } | null;
}
