import { ClientHosting } from "../types";

export const useClientHostings = () => {
  return {
    data: [] as ClientHosting[],
    isLoading: false,
    error: null,
  };
};
