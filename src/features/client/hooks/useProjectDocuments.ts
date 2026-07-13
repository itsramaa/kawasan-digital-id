export interface ProjectDocument {
  id: string;
  project_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string | null;
  description: string | null;
  created_at: string;
}

export function useProjectDocuments(_projectId: string) {
  return {
    data: [] as ProjectDocument[],
    isLoading: false,
    error: null,
  };
}

export function useUploadDocument(_projectId: string) {
  return {
    mutate: (_payload: { file: File; description?: string }, _opts?: { onSuccess?: () => void }) => {},
    isPending: false,
    error: null,
  };
}
