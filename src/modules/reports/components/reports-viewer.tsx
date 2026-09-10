import { cn } from "@/lib/utils";
import { EmptyDataTable } from "./empty-report";

import ReportsTableHeaders from "./table-headers";
import type { AuditTableResponse } from "../api/reports-api-types";

interface ReportViewerTypes extends React.ComponentProps<"div"> {
  auditTableData: AuditTableResponse[];
  isLoading?: boolean;
  hideEmptyState?: boolean;
  reportType?: "audit" | "feedback";
}

function formatDate(dateString: string) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatFeedbackType(feedbackType?: string) {
  if (feedbackType === "thumbs_up") return "Positive";
  if (feedbackType === "thumbs_down") return "Negative";
  return feedbackType || "NA";
}

const ReportsViewer = ({
  auditTableData,
  isLoading = false,
  hideEmptyState = false,
  reportType = "audit",
  className,
  ...props
}: ReportViewerTypes) => {

  return (
    <div className={cn("min-w-0 overflow-x-auto", className)} {...props}>
      <ReportsTableHeaders />

      <div className="relative min-h-[240px] min-w-[1200px] overflow-y-auto rounded-b-md border border-gray-300">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700"
              role="status"
              aria-label="Loading report data"
            />
          </div>
        )}
        <div className="text-gray-700 text-xs ">
          {auditTableData.length >= 1 ? (
            <>
              {auditTableData.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={`flex min-w-[1200px] py-1 transition hover:bg-gray-200 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <div className="flex-1 text-center max-w-45 truncate">
                      {data.employee_id}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {formatDate(data.start_date)}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {formatDate(data.end_date)}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {data.employee_name}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {data.client_name}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {data.total_hours}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {data.total_leaves_used}
                    </div>
                    <div className="flex-1 text-center -mx-1 max-w-45 truncate">
                      {data.state}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {Number(data.leaves_available) === -99999
                        ? "NA"
                        : data.leaves_available}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {formatDate(data.created_at)}
                    </div>
                    <div className="flex-1 text-left -mx-1 max-w-45 truncate">
                      {data.user_name}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {reportType === "feedback"
                        ? data.feedback || "NA"
                        : data.file_name || "NA"}
                    </div>
                    <div className="flex-1 text-center max-w-45 truncate">
                      {formatFeedbackType(data.feedback_type)}
                    </div>
                  </div>
                );
              })}
            </>
          ) : isLoading || hideEmptyState ? null : (
            <><EmptyDataTable /></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsViewer;
