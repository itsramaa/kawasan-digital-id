import type { Testimonial } from "../types";

export function useTestimonials() {
  return {
    data: [] as Testimonial[],
    isLoading: false,
    error: null,
  };
}
