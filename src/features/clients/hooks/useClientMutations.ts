// ponytail: replace with tRPC or server actions when API layer is ready
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Client } from "../types";

export const useClientMutations = () => {
  const qc = useQueryClient();

  const insertMut = useMutation({
    mutationFn: async (data: Partial<Client>) => {
      const res = await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to create client");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Client> & { id: string }) => {
      const res = await fetch(`/api/clients/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to update client");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete client");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });

  return { insertMut, updateMut, deleteMut };
};
