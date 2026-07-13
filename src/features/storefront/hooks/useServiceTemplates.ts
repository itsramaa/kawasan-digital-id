import type { ServiceTemplate } from "../types";

export function useServiceTemplates() {
  return {
    data: [] as ServiceTemplate[],
    isLoading: false,
    error: null,
  };
}
