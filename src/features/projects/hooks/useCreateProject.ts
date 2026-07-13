import { toast } from "sonner";
import { CreateProjectDTO } from "../types";

export const useCreateProject = () => {
  return {
    mutate: (_newProject: CreateProjectDTO, _opts?: any) => {
      toast.success("Project created successfully");
    },
    mutateAsync: async (_newProject: CreateProjectDTO) => {
      toast.success("Project created successfully");
      return null;
    },
    isPending: false,
    error: null,
  };
};
