import { toast } from "sonner";
import { CreateTaskDTO } from "../types";

export const useCreateTask = () => {
  return {
    mutate: (_newTask: CreateTaskDTO, _opts?: any) => {
      toast.success("Task created successfully");
    },
    mutateAsync: async (_newTask: CreateTaskDTO) => {
      toast.success("Task created successfully");
      return null;
    },
    isPending: false,
    error: null,
  };
};
