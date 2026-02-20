
-- ============================================
-- 1. ROLE ENUM & USER ROLES TABLE
-- ============================================
CREATE TYPE public.app_role AS ENUM (
  'super_admin', 'sales', 'project_manager', 'developer', 
  'finance', 'support', 'infra', 'client_admin', 'client_contact'
);

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- ============================================
-- 2. CLIENTS TABLE
-- ============================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  industry TEXT,
  tax_id TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link client users to clients
ALTER TABLE public.profiles ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- ============================================
-- 3. SALES / CRM TABLES
-- ============================================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id),
  title TEXT NOT NULL,
  description TEXT,
  budget_estimate DECIMAL(15,2),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Qualified', 'Proposal Sent', 'Contract Pending', 'Won', 'Lost', 'Rejected')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES public.inquiries(id),
  client_id UUID REFERENCES public.clients(id),
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  line_items JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired')),
  valid_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id),
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Signed', 'Active', 'Completed', 'Terminated')),
  start_date DATE,
  end_date DATE,
  total_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 4. PROJECTS & TASKS
-- ============================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id),
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled')),
  pm_id UUID REFERENCES auth.users(id),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Approved')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES public.milestones(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'In Review', 'Done')),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  assigned_to UUID REFERENCES auth.users(id),
  is_client_visible BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 5. FINANCE TABLES
-- ============================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  project_id UUID REFERENCES public.projects(id),
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  milestone_id UUID REFERENCES public.milestones(id),
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Viewed', 'Paid', 'Overdue', 'Void', 'Bad Debt')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT,
  reference_number TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 6. SUPPORT TICKETS
-- ============================================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Escalated', 'Resolved', 'Closed')),
  assigned_to UUID REFERENCES auth.users(id),
  sla_deadline TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 7. SECURITY DEFINER FUNCTION FOR ROLE CHECKS
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user's client_id
CREATE OR REPLACE FUNCTION public.get_user_client_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id FROM public.profiles WHERE user_id = _user_id
$$;

-- Check if user is internal (has any non-client role)
CREATE OR REPLACE FUNCTION public.is_internal_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'sales', 'project_manager', 'developer', 'finance', 'support', 'infra')
  )
$$;

-- ============================================
-- 8. RLS POLICIES
-- ============================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Internal users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()));

-- USER ROLES
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- CLIENTS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can view all clients" ON public.clients FOR SELECT TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Internal users can manage clients" ON public.clients FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Client users can view own client" ON public.clients FOR SELECT TO authenticated USING (id = public.get_user_client_id(auth.uid()));

-- INQUIRIES
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage inquiries" ON public.inquiries FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));

-- QUOTATIONS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage quotations" ON public.quotations FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own quotations" ON public.quotations FOR SELECT TO authenticated USING (client_id = public.get_user_client_id(auth.uid()));

-- CONTRACTS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage contracts" ON public.contracts FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own contracts" ON public.contracts FOR SELECT TO authenticated USING (client_id = public.get_user_client_id(auth.uid()));

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own projects" ON public.projects FOR SELECT TO authenticated USING (client_id = public.get_user_client_id(auth.uid()));

-- MILESTONES
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage milestones" ON public.milestones FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own milestones" ON public.milestones FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = public.get_user_client_id(auth.uid()))
);

-- TASKS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage tasks" ON public.tasks FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view visible tasks" ON public.tasks FOR SELECT TO authenticated USING (
  is_client_visible AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.client_id = public.get_user_client_id(auth.uid()))
);

-- INVOICES
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own invoices" ON public.invoices FOR SELECT TO authenticated USING (client_id = public.get_user_client_id(auth.uid()));

-- PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own payments" ON public.payments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.client_id = public.get_user_client_id(auth.uid()))
);

-- SUPPORT TICKETS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Internal users can manage tickets" ON public.support_tickets FOR ALL TO authenticated USING (public.is_internal_user(auth.uid()));
CREATE POLICY "Clients can view own tickets" ON public.support_tickets FOR SELECT TO authenticated USING (client_id = public.get_user_client_id(auth.uid()));
CREATE POLICY "Clients can create tickets" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (client_id = public.get_user_client_id(auth.uid()));

-- ============================================
-- 9. AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 10. UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
