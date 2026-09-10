import { allApi } from "@/services/all-api";
import { ApiMethod } from "@/types/api-enums";
import type {
  CalculateVacationForm,
  CalculateVacationResponse,
  EmployeeDetailsFomrm,
  EmployeesResponseDetail,
  FeedBackFormSubmit,
  ProcessDocumentForm,
  ProcessDocumentResponse,
} from "@/modules/home/types/api-types";

/**
 * Api Manager for all the analytics route
 */

const analyticsApi = allApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    /**
     * Mutation query to get the employee details from the api
     */
    getEmployeeDetails: builder.mutation<
      EmployeesResponseDetail,
      EmployeeDetailsFomrm
    >({
      query: (employeeDetails) => ({
        url: "/analytics/employee-details",
        method: ApiMethod.POST,
        body: employeeDetails,
      }),
    }),

    /**
     * Mutation to upload/vectorize a PTO document (PDF/DOCX) and run a
     * semantic search against it. When `pto_logging_id` is supplied, the
     * matching Cosmos DB audit entry is patched with the file name.
     */
    processDocument: builder.mutation<
      ProcessDocumentResponse,
      ProcessDocumentForm
    >({
      query: ({ file, employee_id, pto_logging_id, client_name, query }) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("employee_id", employee_id);
        formData.append("client_name", client_name);

        if (pto_logging_id) {
          formData.append("pto_logging_id", pto_logging_id);
        }

        if (query) {
          formData.append("query", query);
        }

        return {
          url: "/analytics/process-document",
          method: ApiMethod.POST,
          body: formData,
        };
      },
    }),

    /**
     * Mutation to analyze the uploaded contract text and employee
     * accrual details, returning the calculated vacation breakdown
     * (available hours, leave policy text, breakdown, and the
     * step-by-step accrual calculation).
     */
    calculateVacation: builder.mutation<
      CalculateVacationResponse,
      CalculateVacationForm
    >({
      query: (calculateVacationDetails) => ({
        url: "/analytics/calculate-vacation",
        method: ApiMethod.POST,
        body: calculateVacationDetails,
      }),
    }),

    submitFeedBackForm: builder.mutation<
      FeedBackFormSubmit,
      FeedBackFormSubmit
    >({
      query: (feedBackData) => ({
        url: "/analytics/submit-feedback",
        method: ApiMethod.POST,
        body: feedBackData,
      }),
    }),
  }),
});

export const {
  useGetEmployeeDetailsMutation,
  useProcessDocumentMutation,
  useCalculateVacationMutation,
  useSubmitFeedBackFormMutation,
} = analyticsApi;
