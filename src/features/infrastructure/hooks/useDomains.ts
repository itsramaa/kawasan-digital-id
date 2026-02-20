import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { Domain } from "../types";

export const useDomains = () => {
  return useQuery({
    queryKey: ["domains"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("domains")
        .select("*, clients(name)")
        .order("expiry_date", { ascending: true });
      if (error) throw error;
      return data as Domain[];
    },
  });
};
