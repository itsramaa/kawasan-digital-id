import { toast } from "sonner";

export const useDeleteProject = () => {
  return {
    mutate: (_projectId: string, _opts?: any) => {
      toast.success("Project deleted successfully");
    },
    mutateAsync: async (_projectId: string) => {
      toast.success("Project deleted successfully");
    },
    isPending: false,
    error: null,
  };
};
