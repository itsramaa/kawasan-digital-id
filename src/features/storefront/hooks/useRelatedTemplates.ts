import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceTemplate } from "../types";

export function useRelatedTemplates(category: string | null | undefined, excludeId: string | undefined, limit = 4) {
  return useQuery({
    queryKey: ["related-templates", category, excludeId],
    enabled: !!category && !!excludeId,
    queryFn: async (): Promise<ServiceTemplate[]> => {
      const { data, error } = await supabase
        .from("service_templates")
        .select("*")
        .eq("is_active", true)
        .eq("category", category!)
        .neq("id", excludeId!)
        .order("display_order", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as ServiceTemplate[];
    },
  });
}
