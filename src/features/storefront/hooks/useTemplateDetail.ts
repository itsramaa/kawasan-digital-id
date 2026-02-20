import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ServiceTemplate, TemplateFeature } from "../types";

export function useTemplateDetail(id: string | undefined) {
  const templateQuery = useQuery({
    queryKey: ["service-template", id],
    enabled: !!id,
    queryFn: async (): Promise<ServiceTemplate> => {
      const { data, error } = await supabase
        .from("service_templates")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as ServiceTemplate;
    },
  });

  const featuresQuery = useQuery({
    queryKey: ["template-features", id],
    enabled: !!id,
    queryFn: async (): Promise<TemplateFeature[]> => {
      const { data, error } = await supabase
        .from("template_features")
        .select("*")
        .eq("template_id", id!)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as TemplateFeature[];
    },
  });

  return {
    template: templateQuery.data,
    features: featuresQuery.data ?? [],
    isLoading: templateQuery.isLoading || featuresQuery.isLoading,
    error: templateQuery.error || featuresQuery.error,
  };
}
