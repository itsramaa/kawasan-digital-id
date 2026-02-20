import { useSupabaseQuery } from "@/shared/hooks/useSupabaseCrud";
import { Client } from "../types";

export const useClients = () => {
  return useSupabaseQuery<Client>("clients", ["clients"], { select: "*" });
};
