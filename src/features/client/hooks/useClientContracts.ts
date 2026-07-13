import { ClientContract } from "../types";

export const useClientContracts = () => {
  return {
    data: [] as ClientContract[],
    isLoading: false,
    error: null,
  };
};
