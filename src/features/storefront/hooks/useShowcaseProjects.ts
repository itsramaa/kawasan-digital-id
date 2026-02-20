import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ShowcaseProject } from "../types";

export function useShowcaseProjects() {
  return useQuery({
    queryKey: ["showcase-projects"],
    queryFn: async (): Promise<ShowcaseProject[]> => {
      const { data, error } = await supabase
        .from("showcase_projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ShowcaseProject[];
    },
  });
}
