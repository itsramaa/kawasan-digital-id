import { Task } from "../types";

export const useTasks = (_projectId?: string) => {
  return {
    data: [] as Task[],
    isLoading: false,
    error: null,
  };
};
