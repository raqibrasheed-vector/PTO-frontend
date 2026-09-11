import MuiDatePicker from "@/components/common/MuiDatePicker";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type {
  FilterStates,
  ReportsGeneratorDateSchema,
} from "../types/report-types";
import { useForm, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import ReportsViewer from "../components/reports-viewer";
import { ReportsTableContext } from "../context/report-table-context";
import { Loader2, Trash2 } from "lucide-react";
import useReportTableHooks from "../hooks/reportsTableHooks";
import {
  useExportAuditDataMutation,
  useExportFeedbackDataMutation,
  useGetAuditDataQuery,
  useGetFeedbackDataQuery,
} from "../api/reports-api";
import ReportError from "../components/report-error";

const MIN_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const REPORT_ROW_HEIGHT = 28;
const REPORT_RESERVED_HEIGHT = 260;

function getPageSize() {
  if (typeof window === "undefined") return MIN_PAGE_SIZE;

  return Math.max(
    MIN_PAGE_SIZE,
    Math.min(
      MAX_PAGE_SIZE,
      Math.floor(
        (window.innerHeight - REPORT_RESERVED_HEIGHT) / REPORT_ROW_HEIGHT,
      ),
    ),
  );
}

function downloadFile(file: Blob, filename: string) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getReportErrorMessage(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return fallback;
  }

  const data = error.data;
  if (typeof data === "object" && data !== null && "detail" in data) {
    const detail = data.detail;
    if (typeof detail === "string") return detail;
  }

  return fallback;
}

const ReportScreen = () => {
  const [currentView, setCurrentVier] = useState<"audit" | "feedback">("audit");
  const { tableHeadersParsed, isHeadersError, retryHeaders } =
    useReportTableHooks(currentView);
  /**
   * Local states
   */

  const [filterStates, setFilterStates] = useState<
    Record<"audit" | "feedback", FilterStates[]>
  >({ audit: [], feedback: [] });
  const [pageSize, setPageSize] = useState(getPageSize);
  const filterState = filterStates[currentView];
  const setFilterState: Dispatch<SetStateAction<FilterStates[]>> = (value) => {
    setFilterStates((previous) => ({
      ...previous,
      [currentView]:
        typeof value === "function" ? value(previous[currentView]) : value,
    }));
  };
  const [offset, setOffset] = useState(0);
  const [exportError, setExportError] = useState<unknown>(null);
  const [exportingType, setExportingType] = useState<
    "all" | "current-year" | null
  >(null);
  const [exportAuditData, { isLoading: isExporting }] =
    useExportAuditDataMutation();
  const [exportFeedbackData, { isLoading: isExportingFeedback }] =
    useExportFeedbackDataMutation();

  const auditForm = useForm<ReportsGeneratorDateSchema>();
  const feedbackForm = useForm<ReportsGeneratorDateSchema>();
  const { control, reset } =
    currentView === "audit" ? auditForm : feedbackForm;
  const startDate = useWatch({ control, name: "start_date" });
  const endDate = useWatch({ control, name: "end_date" });

  const {
    data: auditTableData,
    error: auditError,
    isFetching,
    refetch: retryAudit,
  } = useGetAuditDataQuery(
    {
      limit: pageSize,
      offset,
      filters: filterState,
      start_date: startDate && endDate ? startDate : undefined,
      end_date: startDate && endDate ? endDate : undefined,
    },
    { skip: currentView !== "audit" },
  );
  const {
    data: feedbackTableData,
    error: feedbackError,
    isFetching: isFeedbackFetching,
    refetch: retryFeedback,
  } = useGetFeedbackDataQuery(
    {
      limit: pageSize,
      offset,
      filters: filterState,
      start_date: startDate && endDate ? startDate : undefined,
      end_date: startDate && endDate ? endDate : undefined,
    },
    { skip: currentView !== "feedback" },
  );

  useEffect(() => {
    // Filter changes represent a new result set, so the first request must
    // always start at its first page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset(0);
  }, [filterState, startDate, endDate]);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(getPageSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // A changed page size invalidates the current offset.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset(0);
  }, [pageSize]);

  const reportData =
    currentView === "audit" ? auditTableData : feedbackTableData;
  const reportError = currentView === "audit" ? auditError : feedbackError;
  const isReportFetching =
    currentView === "audit" ? isFetching : isFeedbackFetching;
  const retryReport = currentView === "audit" ? retryAudit : retryFeedback;
  const totalRecords = reportData?.total_records ?? 0;
  const totalPages = reportData?.total_pages ?? 0;
  const currentPage = reportData?.page ?? Math.floor(offset / pageSize) + 1;
  const firstResult =
    totalRecords === 0 ? 0 : (reportData?.start ?? offset) + 1;
  const lastResult =
    totalRecords === 0
      ? 0
      : Math.min(
          reportData?.end ?? offset + (reportData?.data.length ?? 0),
          totalRecords,
        );
  const hasPreviousPage = totalPages > 0 && currentPage > 1;
  const hasNextPage = totalPages > 0 && currentPage < totalPages;

  const handleExport = async (currentYear = false) => {
    setExportError(null);
    setExportingType(currentYear ? "current-year" : "all");
    const year = new Date().getFullYear();
    try {
      const exportRequest = {
        filters: filterState,
        start_date: currentYear ? `${year}-01-01` : startDate,
        end_date: currentYear ? `${year}-12-31` : endDate,
      };
      const file = await (
        currentView === "audit"
          ? exportAuditData(exportRequest)
          : exportFeedbackData(exportRequest)
      ).unwrap();
      downloadFile(
        file,
        currentYear
          ? `${currentView}-report-${year}.csv`
          : `${currentView}-report.csv`,
      );
    } catch (error) {
      setExportError(error);
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-y-2 overflow-hidden pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-6 md:px-10">
        <h1 className="font-bold text-gray-800"></h1>

        <div className="flex">
          <div
            className={`cursor-pointer p-0.75 min-w-20 text-center rounded-l-md transition-all ${
              currentView == "audit"
                ? "bg-[#C0D82E] text-black font-bold"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setCurrentVier("audit")}
          >
            Audit
          </div>
          <div
            className={`cursor-pointer p-0.75 min-w-20 text-center rounded-r-md transition-all ${
              currentView === "feedback"
                ? "bg-[#C0D82E] text-black font-bold"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setCurrentVier("feedback")}
          >
            Feedback
          </div>
        </div>
      </div>
      <div className="px-3 sm:px-6 md:px-10">
        <div className="flex flex-wrap gap-3">
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <div>
              <Label
                htmlFor="startDate"
                className="block text-xs text-gray-600 font-bold"
              >
                Submission Start Date
              </Label>
              <MuiDatePicker<ReportsGeneratorDateSchema>
                id={"start_date"}
                control={control}
                rules={{ required: "Start date is required" }}
                sx={{
                  "& .MuiPickersOutlinedInput-root": {
                    height: "2rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.775rem",
                    width: "12rem",
                  },
                  "& .MuiPickersInputBase-sectionsContainer": {
                    padding: "0.0rem 0rem",
                  },
                  "& .MuiIconButton-root": {
                    padding: "0.375rem",
                  },
                }}
              />
            </div>
            <div>
              <Label
                htmlFor="endDate"
                className="block text-xs text-gray-600 font-bold"
              >
                Submission End Date
              </Label>
              <MuiDatePicker<ReportsGeneratorDateSchema>
                id={"end_date"}
                control={control}
                rules={{ required: "Start date is required" }}
                sx={{
                  "& .MuiPickersOutlinedInput-root": {
                    height: "2rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.775rem",
                    width: "12rem",
                  },
                  "& .MuiPickersInputBase-sectionsContainer": {
                    padding: "0.0rem 0rem",
                  },
                  "& .MuiIconButton-root": {
                    padding: "0.375rem",
                  },
                }}
              />
            </div>
            {(filterState.length >= 1 || (startDate && endDate)) && (
              <div
                className="group relative mt-4 cursor-pointer rounded border border-gray-300 p-1 transition-colors duration-200 hover:border-gray-400"
                onClick={() => {
                  setFilterState([]);
                  reset();
                }}
              >
                <span
                  aria-label={`${filterState.length + (startDate && endDate ? 1 : 0)} filters applied`}
                  className="absolute -right-2 -top-2 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c0d82e] px-1 text-[10px] font-bold leading-none text-black"
                >
                  {filterState.length + (startDate && endDate ? 1 : 0)}
                </span>
                <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
                  Clear Filters
                </div>
              </div>
            )}
          </div>
          <div className="flex w-full flex-wrap justify-start gap-2 sm:ml-auto sm:w-auto sm:justify-end">
            <button
              type="button"
              className="flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gray-400 bg-gray-700 px-1 text-[14px] text-white shadow-sm hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-3 sm:w-36"
              disabled={isExporting || isExportingFeedback}
              onClick={() => void handleExport()}
            >
              {exportingType === "all" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {exportingType === "all" ? "Exporting..." : "Export"}
            </button>
            <button
              type="button"
              className="flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gray-400 bg-gray-700 px-1 text-[14px] text-white shadow-sm hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-3 sm:w-36"
              disabled={isExporting || isExportingFeedback}
              onClick={() => void handleExport(true)}
            >
              {exportingType === "current-year" && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {exportingType === "current-year"
                ? "Exporting..."
                : "Export Current Year"}
            </button>
          </div>
        </div>
      </div>

      {isHeadersError && (
        <ReportError
          compact
          message="Unable to load report filters. You can still view the report, but filter options may be unavailable."
          onRetry={retryHeaders}
        />
      )}
      {Boolean(exportError) && (
        <ReportError
          compact
          message={getReportErrorMessage(
            exportError,
            "Unable to export the report.",
          )}
          onRetry={() => void handleExport()}
        />
      )}

      <ReportsTableContext.Provider
        value={{
          tableHeaders: tableHeadersParsed,
          filterState: filterState,
          setFilterState: setFilterState,
        }}
      >
        <ReportsViewer
          className="mx-3 mt-5 sm:mx-6 md:mx-10"
          auditTableData={reportData?.data ?? []}
          reportType={currentView}
          isLoading={isReportFetching}
          hideEmptyState={Boolean(reportError)}
        />
        {reportError && (
          <ReportError
            message={getReportErrorMessage(
              reportError,
              `Unable to load ${currentView} report data.`,
            )}
            onRetry={retryReport}
          />
        )}
        <div className="mx-3 flex flex-wrap items-center justify-center gap-3 pb-4 text-sm text-gray-700 sm:mx-6 md:mx-10">
          <span className="font-medium">Total Results: {totalRecords}</span>
          <span className="h-5 w-px bg-gray-400" />
          <span className="font-medium">
            Current Result: {firstResult} - {lastResult}
          </span>
          <button
            type="button"
            onClick={() =>
              setOffset(Math.max(0, (currentPage - 2) * pageSize))
            }
            disabled={!hasPreviousPage || isReportFetching}
            className={`rounded px-3 py-1 font-medium ${
              !hasPreviousPage || isReportFetching
                ? "cursor-not-allowed bg-gray-300 text-gray-600"
                : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
          >
            Prev
          </button>
          <span className="font-medium">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setOffset(currentPage * pageSize)}
            disabled={!hasNextPage || isReportFetching}
            className={`rounded px-3 py-1 font-medium ${
              !hasNextPage || isReportFetching
                ? "cursor-not-allowed bg-gray-300 text-gray-600"
                : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
      </ReportsTableContext.Provider>
    </div>
  );
};

export default ReportScreen;
