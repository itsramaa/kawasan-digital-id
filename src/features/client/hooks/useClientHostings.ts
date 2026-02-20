import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientHosting } from "../types";

export const useClientHostings = () => {
  return useQuery({
    queryKey: ["client-hostings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hostings")
        .select("id, name, provider, status, server_type, expiry_date")
        .order("expiry_date", { ascending: true });

      if (error) throw error;
      return data as ClientHosting[];
    },
  });
};
