import { Quotation } from "../types";

export const useQuotations = () => {
  return {
    data: [] as Quotation[],
    isLoading: false,
    error: null,
  };
};
