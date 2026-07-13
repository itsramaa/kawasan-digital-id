import { Hosting } from "../types";

export const useHostings = () => {
  return {
    data: [] as Hosting[],
    isLoading: false,
    error: null,
  };
};
