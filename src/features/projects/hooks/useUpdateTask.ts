import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { toast } from "sonner";
import { CreateTaskDTO } from "../types";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateTaskDTO> }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          title: updates.title,
          project_id: updates.project_id,
          status: updates.status,
          priority: updates.priority,
          due_date: updates.due_date?.toISOString(),
          assigned_to: updates.assigned_to,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Also invalidate specific project tasks if project_id is available, but general tasks query invalidation should cover it
      if (variables.updates.project_id) {
         queryClient.invalidateQueries({ queryKey: ["tasks", variables.updates.project_id] });
      }
      toast.success("Task updated successfully");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    },
  });
};
