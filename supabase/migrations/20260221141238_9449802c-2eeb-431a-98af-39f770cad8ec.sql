
-- Add columns to contact_messages
ALTER TABLE public.contact_messages 
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS unread_count integer NOT NULL DEFAULT 0;

-- Create trigger for updated_at on contact_messages
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: Client can SELECT own messages
CREATE POLICY "Clients can view own messages"
  ON public.contact_messages FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Client can UPDATE own messages (for marking read)
CREATE POLICY "Clients can update own messages"
  ON public.contact_messages FOR UPDATE
  USING (auth.uid() = user_id);

-- Create message_replies table
CREATE TABLE public.message_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('client', 'admin')),
  sender_id uuid,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

-- RLS: Client can SELECT replies on own messages
CREATE POLICY "Clients can view replies on own messages"
  ON public.message_replies FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.contact_messages cm
    WHERE cm.id = message_replies.message_id AND cm.user_id = auth.uid()
  ));

-- RLS: Client can INSERT replies on own messages
CREATE POLICY "Clients can reply to own messages"
  ON public.message_replies FOR INSERT
  WITH CHECK (
    sender_type = 'client' 
    AND sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.contact_messages cm
      WHERE cm.id = message_replies.message_id AND cm.user_id = auth.uid()
    )
  );

-- RLS: Internal users can manage all replies
CREATE POLICY "Internal users can manage replies"
  ON public.message_replies FOR ALL
  USING (is_internal_user(auth.uid()));

-- Enable realtime for message_replies
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_replies;
