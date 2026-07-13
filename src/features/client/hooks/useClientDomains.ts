import { ClientDomain } from "../types";

export const useClientDomains = () => {
  return {
    data: [] as ClientDomain[],
    isLoading: false,
    error: null,
  };
};
