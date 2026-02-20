import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientTicket } from "../types";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";

export const useClientTickets = () => {
  return useQuery({
    queryKey: ["client-tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, projects(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ClientTicket[];
    },
  });
};

export const useClientTicketMutation = () => {
  const qc = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (values: { subject: string; description: string; priority: string }) => {
      const ticketNumber = `TK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
      const { error } = await supabase.from("support_tickets").insert({
        ...values,
        ticket_number: ticketNumber,
        client_id: profile?.client_id,
        created_by: profile?.user_id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-tickets"] });
      toast.success("Ticket created!");
    },
    onError: (e: any) => toast.error(e.message),
  });
};
