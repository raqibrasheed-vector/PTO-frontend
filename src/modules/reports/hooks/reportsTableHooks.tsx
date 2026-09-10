import { useSelector } from "react-redux";
import { useGetTableHeadersQuery } from "../api/reports-api";
import { selectReportsHeader } from "@/redux/selectors/reports/reports-table-selectors";
import { auditTableHeaders, feedbackTableHeaders } from "../utils/table-utils";
import type { AuditTableHeaders } from "@/modules/reports/api/reports-api-types";
import type { ReportTableHeaders } from "../types/report-types";

interface ReportsTabeHooks {
  tableHeadersParsed: ReportTableHeaders[];
  isHeadersLoading: boolean
  isHeadersError: boolean
  retryHeaders: () => void
}

const useReportTableHooks = (tableFilters: "audit" | "feedback"): ReportsTabeHooks => {
  const tableHeadersData = useSelector(
    selectReportsHeader,
  ) as AuditTableHeaders;

  // Check if we already have valid user data
  const hasValidHeaderData =
    tableHeadersData &&
    typeof tableHeadersData === "object" &&
    Object.keys(tableHeadersData).length > 0;

  // Fetch user data if we don't have it yet
  // Skip if we already have valid user data to prevent unnecessary refetches on navigation
  const { isLoading: userLoading, isFetching, isError, refetch } = useGetTableHeadersQuery(
    { tableFilters: "audit" },
    {
      skip: hasValidHeaderData,
    },
  );

  const headers = tableFilters === "feedback"
    ? feedbackTableHeaders
    : auditTableHeaders;
  const tableHeadersParsed = headers.map((header) => ({
    ...header,
    filterData: header.isFilter
      ? (tableHeadersData?.[header.name as keyof AuditTableHeaders] ?? [])
      : header.filterData,
  })) as ReportTableHeaders[];

  const isHeadersLoading = userLoading || isFetching;

  return {
    tableHeadersParsed,
    isHeadersLoading,
    isHeadersError: isError,
    retryHeaders: refetch,
  };
};

export default useReportTableHooks;
