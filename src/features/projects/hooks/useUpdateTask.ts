import { toast } from "sonner";
import { CreateTaskDTO } from "../types";

export const useUpdateTask = () => {
  return {
    mutate: (_args: { id: string; updates: Partial<CreateTaskDTO> }, _opts?: any) => {
      toast.success("Task updated successfully");
    },
    mutateAsync: async (_args: { id: string; updates: Partial<CreateTaskDTO> }) => {
      toast.success("Task updated successfully");
      return null;
    },
    isPending: false,
    error: null,
  };
};
