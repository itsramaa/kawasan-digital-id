export interface ActivityItem {
  id: string;
  type: "project" | "invoice" | "ticket";
  title: string;
  status: string;
  created_at: string;
}

export const useClientActivity = () => {
  return {
    data: [] as ActivityItem[],
    isLoading: false,
    error: null,
  };
};
