import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { ClientProject } from "../types";

export const useClientProjects = () => {
  return useQuery({
    queryKey: ["client-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, milestones(id, title, status, due_date, order_index), tasks(id, title, status, priority, is_client_visible, due_date)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ClientProject[];
    },
  });
};
