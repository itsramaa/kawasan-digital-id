
-- Create domains table
CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  registrar TEXT,
  registration_date DATE,
  expiry_date DATE NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hostings table
CREATE TABLE public.hostings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT,
  server_type TEXT DEFAULT 'Shared',
  ip_address TEXT,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostings ENABLE ROW LEVEL SECURITY;

-- RLS for domains
CREATE POLICY "Internal users can manage domains" ON public.domains FOR ALL USING (is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own domains" ON public.domains FOR SELECT USING (client_id = get_user_client_id(auth.uid()));

-- RLS for hostings
CREATE POLICY "Internal users can manage hostings" ON public.hostings FOR ALL USING (is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own hostings" ON public.hostings FOR SELECT USING (client_id = get_user_client_id(auth.uid()));

-- Indexes
CREATE INDEX idx_domains_client_id ON public.domains(client_id);
CREATE INDEX idx_domains_expiry ON public.domains(expiry_date);
CREATE INDEX idx_hostings_client_id ON public.hostings(client_id);
CREATE INDEX idx_hostings_expiry ON public.hostings(expiry_date);

-- Updated_at triggers
CREATE TRIGGER update_domains_modtime BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hostings_modtime BEFORE UPDATE ON public.hostings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Also add missing triggers for existing tables
CREATE TRIGGER update_clients_modtime BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_modtime BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_modtime BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_modtime BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_modtime BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotations_modtime BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_modtime BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
