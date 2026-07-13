import type { StoreFAQ } from "../types";

export function useFAQs(_limit?: number) {
  return {
    data: [] as StoreFAQ[],
    isLoading: false,
    error: null,
  };
}
