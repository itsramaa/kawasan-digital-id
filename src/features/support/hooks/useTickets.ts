import { Ticket } from "../types";

export const useTickets = () => {
  return {
    data: [] as Ticket[],
    isLoading: false,
    error: null,
  };
};
