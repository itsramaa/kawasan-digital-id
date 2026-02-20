import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { toast } from "sonner";
import { CreateProjectDTO } from "../types";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateProjectDTO> }) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: updates.name,
          description: updates.description,
          client_id: updates.client_id,
          status: updates.status,
          deadline: updates.deadline?.toISOString(),
          start_date: updates.start_date?.toISOString(),
          progress: updates.progress,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    },
  });
};
