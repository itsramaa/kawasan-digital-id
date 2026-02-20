import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";
import { toast } from "sonner";
import { CreateProjectDTO } from "../types";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: CreateProjectDTO) => {
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: newProject.name,
            description: newProject.description,
            client_id: newProject.client_id,
            status: newProject.status,
            deadline: newProject.deadline?.toISOString(),
            start_date: newProject.start_date?.toISOString(),
            progress: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });
};
