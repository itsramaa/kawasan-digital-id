import type { ServiceTemplate } from "../types";

export function useRelatedTemplates(
  _category: string | null | undefined,
  _excludeId: string | undefined,
  _limit = 4
) {
  return {
    data: [] as ServiceTemplate[],
    isLoading: false,
    error: null,
  };
}
