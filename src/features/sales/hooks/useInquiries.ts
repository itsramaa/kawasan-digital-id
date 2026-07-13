import { Inquiry } from "../types";

export const useInquiries = () => {
  return {
    data: [] as Inquiry[],
    isLoading: false,
    error: null,
  };
};
