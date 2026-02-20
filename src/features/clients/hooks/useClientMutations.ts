import { useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from "@/shared/hooks/useSupabaseCrud";

export const useClientMutations = () => {
  const insertMut = useSupabaseInsert("clients", [["clients"]]);
  const updateMut = useSupabaseUpdate("clients", [["clients"]]);
  const deleteMut = useSupabaseDelete("clients", [["clients"]]);

  return { insertMut, updateMut, deleteMut };
};
