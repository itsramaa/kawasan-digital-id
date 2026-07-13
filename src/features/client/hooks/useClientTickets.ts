import { ClientTicket } from "../types";

export const useClientTickets = () => {
  return {
    data: [] as ClientTicket[],
    isLoading: false,
    error: null,
  };
};

export const useClientTicketMutation = () => {
  return {
    mutate: (_values: { subject: string; description: string; priority: string }) => {},
    isPending: false,
    error: null,
  };
};
