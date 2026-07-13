export interface Domain {
  id: string;
  domain_name: string;
  registrar: string | null;
  expiry_date: string;
  auto_renew: boolean;
  status: string;
  created_at: string;
  clients: {
    name: string;
  } | null;
}

export interface Hosting {
  id: string;
  name: string;
  provider: string | null;
  server_type: string | null;
  ip_address: string | null;
  expiry_date: string | null;
  status: string;
  created_at: string;
  clients: {
    name: string;
  } | null;
}
