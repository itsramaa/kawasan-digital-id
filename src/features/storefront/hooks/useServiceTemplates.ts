import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceTemplate } from "../types";

export function useServiceTemplates() {
  return useQuery({
    queryKey: ["service-templates"],
    queryFn: async (): Promise<ServiceTemplate[]> => {
      const { data, error } = await supabase
        .from("service_templates")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ServiceTemplate[];
    },
  });
}
