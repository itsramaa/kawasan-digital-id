import { Domain } from "../types";

export const useDomains = () => {
  return {
    data: [] as Domain[],
    isLoading: false,
    error: null,
  };
};
