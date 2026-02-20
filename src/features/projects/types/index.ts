export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  progress: number;
  deadline: string | null;
  start_date: string | null;
  client_id?: string;
  clients: {
    name: string;
  } | null;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  project_id?: string;
  created_at: string;
  projects: {
    name: string;
  } | null;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  client_id: string;
  status: string;
  deadline?: Date;
  start_date?: Date;
  progress?: number;
}

export interface CreateTaskDTO {
  title: string;
  project_id: string;
  status: string;
  priority: string;
  due_date?: Date;
  assigned_to?: string;
}
