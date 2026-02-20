export interface Client {
  id: string;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  tax_id: string | null;
  status: "Active" | "Inactive" | "Suspended" | "Archived";
  created_at: string;
}
