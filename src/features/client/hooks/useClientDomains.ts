import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientDomain } from "../types";

export const useClientDomains = () => {
  return useQuery({
    queryKey: ["client-domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("id, domain_name, status, registrar, expiry_date, auto_renew")
        .order("expiry_date", { ascending: true });

      if (error) throw error;
      return data as ClientDomain[];
    },
  });
};
