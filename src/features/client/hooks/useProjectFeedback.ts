import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ProjectFeedback {
  id: string;
  project_id: string;
  user_id: string;
  overall_rating: number;
  communication_rating: number | null;
  quality_rating: number | null;
  timeliness_rating: number | null;
  comments: string | null;
  would_recommend: boolean | null;
  created_at: string;
}

export function useProjectFeedback(projectId: string) {
  return useQuery({
    queryKey: ["project-feedback", projectId],
    queryFn: async (): Promise<ProjectFeedback | null> => {
      const { data, error } = await supabase
        .from("project_feedback")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();
      if (error) throw error;
      return data as ProjectFeedback | null;
    },
    enabled: !!projectId,
  });
}

export function useSubmitFeedback(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedback: {
      overall_rating: number;
      communication_rating?: number;
      quality_rating?: number;
      timeliness_rating?: number;
      comments?: string;
      would_recommend?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("project_feedback")
        .insert({
          project_id: projectId,
          user_id: user.id,
          ...feedback,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-feedback", projectId] });
      toast.success("Thank you for your feedback!");
    },
    onError: (err: Error) => {
      toast.error("Failed to submit: " + err.message);
    },
  });
}
