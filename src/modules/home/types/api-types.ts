export interface EmployeeDetailsFomrm {
  employee_id: string;
  end_date: string;
  start_date: string;
}

export interface EmployeeResponseForm {
  customer_id: string;
  customer_name: string;
  employee_id: string;
  employee_name: string;
  home_state: string;
  job_req_status: string;
  regular_hours_worked: number;
  remote_worker: string;
  state: string;
  used_vacations: number;
}

export interface EmployeesResponseDetail {
  id: string
  employee_list: EmployeeResponseForm[]
}

export interface DocumentChunk {
  text: string;
}

export interface ProcessDocumentForm {
  file: File;
  employee_id: string;
  pto_logging_id: string;
  client_name: string;
  query?: string;
}

export interface ProcessDocumentResponse {
  employee_id: string;
  file_name: string;
  query: string;
  pto_logging_id: string | null;
  results: DocumentChunk[];
}

export interface CalculateVacationForm {
  pto_logging_id: string;
  start_date: string;
  end_date: string;
  client_name: string;
  regular_hours_worked: number;
  state: string;
  used_vacations: string;
  text_inputs: DocumentChunk[];
}

export interface CalculateVacationResponse {
  vacation_hours_uncalculated: number;
  vacation_hours_available: number;
  leaves_policy_breakdown: string[];
  leaves_accrued_calculation: string[];
  leaves_available_calculation: string;
  leaves_policy: string;
  leaves_available_calculation_raw_json: {
    calculation: string;
    available_vacation_hours: number;
  };
}

export interface FeedBackFormSubmit {
  pto_logging_id: string
  feedback: string;
  feedback_type: string;
  file_name: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  employee_name: string;
  client_name: string;
  total_hours: number;
  total_leaves_used: number;
  state: string;
  leaves_available: number;
}
