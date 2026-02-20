import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { toast } from "sonner";
import { CreateTaskDTO } from "../types";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: CreateTaskDTO) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: newTask.title,
            project_id: newTask.project_id,
            status: newTask.status,
            priority: newTask.priority,
            due_date: newTask.due_date?.toISOString(),
            // assigned_to: newTask.assigned_to, // If we have user assignments later
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.project_id] });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    },
  });
};
