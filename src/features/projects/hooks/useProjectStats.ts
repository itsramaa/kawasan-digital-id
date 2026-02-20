import { supabase } from "@/lib/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useProjectStats() {
  const { data: projectCount } = useQuery({
    queryKey: ["projects-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .in("status", ["Planning", "In Progress", "On Hold"]);
      return count ?? 0;
    },
  });

  const { data: recentTasks } = useQuery({
    queryKey: ["recent-tasks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("id, title, status, priority, due_date, projects(name)")
        .in("status", ["In Progress", "To Do", "Review"])
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  return { projectCount, recentTasks };
}
