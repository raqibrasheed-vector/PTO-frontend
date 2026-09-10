import type { ReportTableHeaders } from "../types/report-types";

export const auditTableHeaders: ReportTableHeaders[] = [
  {
    name: "employee_id",
    label: "Employee_ID",
    isFilter: true,
    isSort: false,
    filterData: [],
  },
  {
    name: "start_date",
    label: "Accural Start Date",
    isFilter: false,
    isSort: true,
    filterData: undefined,
  },
  {
    name: "end_date",
    label: "Accural End Date",
    isFilter: false,
    isSort: true,
    filterData: undefined,
  },
  {
    name: "employee_name",
    label: "Employee Name",
    isFilter: false,
    isSort: false,
    filterData: undefined,
  },
  {
    name: "client_name",
    label: "Client Name",
    isFilter: false,
    isSort: false,
    filterData: undefined,
  },
  {
    name: "total_hours",
    label: "Total Hours",
    isFilter: false,
    isSort: false,
    filterData: undefined,
  },
  {
    name: "total_leaves",
    label: "Total Leaves Used",
    isFilter: false,
    isSort: false,
    filterData: undefined,
  },
  {
    name: "state",
    label: "State",
    isFilter: true,
    isSort: false,
    filterData: [],
  },
  {
    name: "leaves_available",
    label: "Leaves Available",
    isFilter: false,
    isSort: false,
    filterData: undefined,
  },
  {
    name: "created_at",
    label: "Submission Date",
    isFilter: false,
    isSort: true,
    filterData: undefined,
  },
  {
    name: "user_name",
    label: "User Name",
    isFilter: true,
    isSort: false,
    filterData: [],
  },
  {
    name: "file_name",
    label: "File Name",
    isFilter: false,
    isSort: false,
    filterData: undefined,
  },
  {
    name: "feedback_type",
    label: "FeedBack Type",
    isFilter: true,
    isSort: false,
    filterData: [],
  },
];

export const feedbackTableHeaders: ReportTableHeaders[] =
  auditTableHeaders.map((header) =>
    header.name === "file_name"
      ? { ...header, name: "feedback", label: "Feedback" }
      : header,
  );
