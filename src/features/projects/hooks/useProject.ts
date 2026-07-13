import { Project } from "../types";

export const useProject = (_id: string) => {
  return {
    data: null as Project | null,
    isLoading: false,
    error: null,
  };
};
