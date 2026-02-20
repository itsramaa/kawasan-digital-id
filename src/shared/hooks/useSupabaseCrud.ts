import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { toast } from "sonner";

type TableName = "clients" | "inquiries" | "quotations" | "contracts" | "projects" | "milestones" | "tasks" | "invoices" | "payments" | "support_tickets" | "domains" | "hostings";

export function useSupabaseQuery<T = any>(
  table: string,
  queryKey: string[],
  options?: {
    select?: string;
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, any>;
  }
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = (supabase.from as any)(table).select(options?.select ?? "*");
      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          query = query.eq(key, value);
        }
      }
      query = query.order(options?.orderBy ?? "created_at", { ascending: options?.ascending ?? false });
      const { data, error } = await query;
      if (error) throw error;
      return data as T[];
    },
  });
}

export function useSupabaseInsert(table: string, invalidateKeys: string[][]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Record<string, any>) => {
      const { data, error } = await (supabase.from as any)(table).insert(values).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateKeys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      toast.success("Created successfully");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useSupabaseUpdate(table: string, invalidateKeys: string[][]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: Record<string, any> & { id: string }) => {
      const { data, error } = await (supabase.from as any)(table).update(values).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateKeys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      toast.success("Updated successfully");
    },
    onError: (e: any) => toast.error(e.message),
  });
}

export function useSupabaseDelete(table: string, invalidateKeys: string[][]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateKeys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      toast.success("Deleted successfully");
    },
    onError: (e: any) => toast.error(e.message),
  });
}
