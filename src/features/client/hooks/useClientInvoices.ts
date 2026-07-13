import { ClientInvoice } from "../types";

export const useClientInvoices = () => {
  return {
    data: [] as ClientInvoice[],
    isLoading: false,
    error: null,
  };
};
