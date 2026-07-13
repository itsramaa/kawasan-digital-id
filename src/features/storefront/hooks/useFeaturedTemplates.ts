import type { ServiceTemplate } from "../types";

export function useFeaturedTemplates(_limit = 8) {
  return {
    data: [] as ServiceTemplate[],
    isLoading: false,
    error: null,
  };
}
