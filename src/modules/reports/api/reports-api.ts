import { allApi } from "@/services/all-api";
import { ApiMethod } from "@/types/api-enums";
import type {
  AuditRequest,
  AuditTableHeaders,
  AuditTableResponse,
} from "./reports-api-types";
import type { PaginationResponse } from "@/modules/authentication/api/auth-api-types";

/**
 * Api Manager for all the table headers route
 */

export const reportsApiServices = allApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    /**
     * get the list of table filter headers
     */
    getTableHeaders: builder.query<
      AuditTableHeaders,
      { tableFilters: "audit" | "feedback" }
    >({
      query: ({ tableFilters }) => ({
        url: "/api/reporting/table-filters",
        method: ApiMethod.GET,
        params: { filter_data: tableFilters },
      }),
      keepUnusedDataFor: 0,
      providesTags: [],
    }),

    getAuditData: builder.query<
      PaginationResponse<AuditTableResponse>,
      AuditRequest
    >({
      query: ({ ...auditRequest }) => ({
        url: "/api/reporting/audit-data",
        method: ApiMethod.POST,
        body: auditRequest,
      }),
      keepUnusedDataFor: 0,
      providesTags: [],
    }),
    getFeedbackData: builder.query<
      PaginationResponse<AuditTableResponse>,
      AuditRequest
    >({
      query: (request) => ({
        url: "/api/reporting/feedback-data",
        method: ApiMethod.POST,
        body: request,
      }),
      keepUnusedDataFor: 0,
      providesTags: [],
    }),
    exportAuditData: builder.mutation<
      Blob,
      Omit<AuditRequest, "limit" | "offset">
    >({
      query: (request) => ({
        url: "/api/reporting/audit-export",
        method: ApiMethod.POST,
        body: request,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportFeedbackData: builder.mutation<
      Blob,
      Omit<AuditRequest, "limit" | "offset">
    >({
      query: (request) => ({
        url: "/api/reporting/feedback-export",
        method: ApiMethod.POST,
        body: request,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetTableHeadersQuery,
  useGetAuditDataQuery,
  useGetFeedbackDataQuery,
  useExportAuditDataMutation,
  useExportFeedbackDataMutation,
} = reportsApiServices;
