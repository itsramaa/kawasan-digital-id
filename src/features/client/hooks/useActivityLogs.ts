export interface ActivityLog {
  id: string;
  client_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export function useActivityLogs(_limit = 20) {
  return {
    data: [] as ActivityLog[],
    isLoading: false,
    error: null,
  };
}

export function useLogActivity() {
  return {
    mutate: (_log: {
      action: string;
      entity_type: string;
      entity_id?: string;
      metadata?: Record<string, any>;
    }) => {},
    isPending: false,
  };
}
