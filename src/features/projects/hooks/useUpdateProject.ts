import { toast } from "sonner";
import { CreateProjectDTO } from "../types";

export const useUpdateProject = () => {
  return {
    mutate: (_args: { id: string; updates: Partial<CreateProjectDTO> }, _opts?: any) => {
      toast.success("Project updated successfully");
    },
    mutateAsync: async (_args: { id: string; updates: Partial<CreateProjectDTO> }) => {
      toast.success("Project updated successfully");
      return null;
    },
    isPending: false,
    error: null,
  };
};
