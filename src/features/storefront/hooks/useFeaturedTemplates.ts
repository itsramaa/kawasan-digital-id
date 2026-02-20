import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceTemplate } from "../types";

export function useFeaturedTemplates(limit = 8) {
  return useQuery({
    queryKey: ["featured-templates", limit],
    queryFn: async (): Promise<ServiceTemplate[]> => {
      const { data, error } = await supabase
        .from("service_templates")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return data as ServiceTemplate[];
    },
  });
}
