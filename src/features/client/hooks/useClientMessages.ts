import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect } from "react";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  user_id: string | null;
  unread_count: number;
  created_at: string | null;
  updated_at: string;
}

export interface MessageReply {
  id: string;
  message_id: string;
  sender_type: string;
  sender_id: string | null;
  body: string;
  created_at: string;
}

export function useClientMessages() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["client-messages", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    },
    enabled: !!user,
  });
}

export function useMessageReplies(messageId: string | null) {
  return useQuery({
    queryKey: ["message-replies", messageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_replies")
        .select("*")
        .eq("message_id", messageId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as MessageReply[];
    },
    enabled: !!messageId,
  });
}

export function useReplyMutation() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ messageId, body }: { messageId: string; body: string }) => {
      const { error } = await supabase.from("message_replies").insert({
        message_id: messageId,
        sender_type: "client",
        sender_id: user!.id,
        body,
      } as any);
      if (error) throw error;
      // Update updated_at on parent message
      await supabase
        .from("contact_messages")
        .update({ updated_at: new Date().toISOString() } as any)
        .eq("id", messageId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["message-replies", vars.messageId] });
      qc.invalidateQueries({ queryKey: ["client-messages"] });
    },
  });
}

export function useComposeMessage() {
  const qc = useQueryClient();
  const { user, profile } = useAuth();
  return useMutation({
    mutationFn: async ({ subject, message }: { subject: string; message: string }) => {
      const { error } = await supabase.from("contact_messages").insert({
        name: profile?.full_name || "Client",
        email: profile?.email || user!.email || "",
        subject,
        message,
        user_id: user!.id,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-messages"] });
    },
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["unread-messages-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gt("unread_count", 0);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });
}

export function useRealtimeReplies(messageId: string | null) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!messageId) return;
    const channel = supabase
      .channel(`replies-${messageId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_replies", filter: `message_id=eq.${messageId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["message-replies", messageId] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [messageId, qc]);
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      await supabase
        .from("contact_messages")
        .update({ unread_count: 0 } as any)
        .eq("id", messageId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-messages"] });
      qc.invalidateQueries({ queryKey: ["unread-messages-count"] });
    },
  });
}
