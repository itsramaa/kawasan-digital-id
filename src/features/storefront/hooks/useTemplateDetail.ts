import type { ServiceTemplate, TemplateFeature } from "../types";

export function useTemplateDetail(_id: string | undefined) {
  return {
    template: undefined as ServiceTemplate | undefined,
    features: [] as TemplateFeature[],
    isLoading: false,
    error: null,
  };
}
