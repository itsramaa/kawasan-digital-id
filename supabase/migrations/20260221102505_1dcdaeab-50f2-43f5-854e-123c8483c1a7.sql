
-- Activity Logs table
CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_client ON public.activity_logs(client_id, created_at DESC);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own activity logs"
  ON public.activity_logs FOR SELECT
  USING (client_id = get_user_client_id(auth.uid()));

CREATE POLICY "Internal users can manage activity logs"
  ON public.activity_logs FOR ALL
  USING (is_internal_user(auth.uid()));

CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id AND client_id = get_user_client_id(auth.uid()));

-- Project Documents table
CREATE TABLE public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint DEFAULT 0,
  file_type text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_documents_project ON public.project_documents(project_id, created_at DESC);

ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own project documents"
  ON public.project_documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = project_documents.project_id AND p.client_id = get_user_client_id(auth.uid())
  ));

CREATE POLICY "Clients can upload to own projects"
  ON public.project_documents FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_documents.project_id AND p.client_id = get_user_client_id(auth.uid()))
  );

CREATE POLICY "Internal users can manage project documents"
  ON public.project_documents FOR ALL
  USING (is_internal_user(auth.uid()));

-- Project Feedback / Survey table
CREATE TABLE public.project_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  overall_rating integer NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  communication_rating integer CHECK (communication_rating BETWEEN 1 AND 5),
  quality_rating integer CHECK (quality_rating BETWEEN 1 AND 5),
  timeliness_rating integer CHECK (timeliness_rating BETWEEN 1 AND 5),
  comments text,
  would_recommend boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_feedback_project ON public.project_feedback(project_id);

ALTER TABLE public.project_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own feedback"
  ON public.project_feedback FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Clients can submit feedback"
  ON public.project_feedback FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_feedback.project_id AND p.client_id = get_user_client_id(auth.uid()))
  );

CREATE POLICY "Internal users can view all feedback"
  ON public.project_feedback FOR SELECT
  USING (is_internal_user(auth.uid()));

-- Storage bucket for project documents
INSERT INTO storage.buckets (id, name, public) VALUES ('project-documents', 'project-documents', false);

CREATE POLICY "Clients can upload to own project folders"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Clients can view own project documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Internal users can manage all project documents"
  ON storage.objects FOR ALL
  USING (bucket_id = 'project-documents' AND is_internal_user(auth.uid()));
