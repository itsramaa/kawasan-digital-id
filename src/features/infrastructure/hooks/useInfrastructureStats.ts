import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/integrations/supabase/client";

export function useInfrastructureStats() {
  const { data: domains } = useQuery({
    queryKey: ["expiring-domains"],
    queryFn: async () => {
      const { data } = await (supabase.from as any)("domains")
        .select("domain_name, expiry_date, status, clients(name)")
        .in("status", ["Expiring Soon", "Expired"])
        .order("expiry_date", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return { domains };
}
