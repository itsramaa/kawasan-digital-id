import { Contract } from "../types";

export const useContracts = () => {
  return {
    data: [] as Contract[],
    isLoading: false,
    error: null,
  };
};
