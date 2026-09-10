import type { FilterStates } from "../types/report-types";

export interface AuditTableHeaders {
  user_name: string[];
  state: string[];
  employee_id: string[];
  feedback_type: string[];
}

export interface AuditTableResponse {
  employee_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  employee_name: string;
  client_name: string;
  total_hours: number;
  total_leaves_used: number;
  state: string;
  leaves_available: number;
  user_name: string;
  file_name?: string;
  feedback?: string;
  feedback_type?: string;
}


export interface AuditRequest {
    limit: number
    offset: number
    filters?: FilterStates[]
    start_date?: string
    end_date?: string
}