// ponytail: replace with tRPC or server actions when API layer is ready
import { useQuery } from "@tanstack/react-query";
import { Client } from "../types";

export const useClients = () => {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      return res.json();
    },
  });
};
