import { ClientPayment } from "../types";

export const useClientPayments = () => {
  return {
    data: [] as ClientPayment[],
    isLoading: false,
    error: null,
  };
};
