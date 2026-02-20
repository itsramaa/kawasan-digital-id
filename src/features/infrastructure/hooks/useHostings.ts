import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { Hosting } from "../types";

export const useHostings = () => {
  return useQuery({
    queryKey: ["hostings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hostings")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Hosting[];
    },
  });
};
