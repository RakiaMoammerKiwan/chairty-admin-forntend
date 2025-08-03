// src/types/Project.ts

export interface Project {
  id: number;
  user_id: number | null;
  type_id: number;
  name: string;
  description: string;
  photo: string;
  total_amount: number | null;
  current_amount: number;
  status: string;
  priority: string;
  duration_type: string;
  location: string | null;
  volunteer_hours: string | null;
  required_tasks: string | null;
  created_at: string;
  updated_at: string;
}