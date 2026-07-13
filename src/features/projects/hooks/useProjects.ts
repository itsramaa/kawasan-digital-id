import { Project } from "../types";

export const useProjects = () => {
  return {
    data: [] as Project[],
    isLoading: false,
    error: null,
  };
};
