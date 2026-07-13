export interface ProjectFeedback {
  id: string;
  project_id: string;
  user_id: string;
  overall_rating: number;
  communication_rating: number | null;
  quality_rating: number | null;
  timeliness_rating: number | null;
  comments: string | null;
  would_recommend: boolean | null;
  created_at: string;
}

export function useProjectFeedback(_projectId: string) {
  return {
    data: null as ProjectFeedback | null,
    isLoading: false,
    error: null,
  };
}

export function useSubmitFeedback(_projectId: string) {
  return {
    mutate: (_feedback: {
      overall_rating: number;
      communication_rating?: number;
      quality_rating?: number;
      timeliness_rating?: number;
      comments?: string;
      would_recommend?: boolean;
    }) => {},
    isPending: false,
    error: null,
  };
}
