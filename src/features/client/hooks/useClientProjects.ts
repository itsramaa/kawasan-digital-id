import { ClientProject } from "../types";

export const useClientProjects = () => {
  return {
    data: [] as ClientProject[],
    isLoading: false,
    error: null,
  };
};
