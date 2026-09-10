import MuiDatePicker from "@/components/common/MuiDatePicker";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, MoveRight, User, X } from "lucide-react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type {
  CalculateVacationResponse,
  EmployeeDetailsFomrm,
  EmployeesResponseDetail,
  ProcessDocumentResponse,
} from "../types/api-types";
import {
  useCalculateVacationMutation,
  useGetEmployeeDetailsMutation,
  useProcessDocumentMutation,
} from "../api/analytics/analytics-api";
import ErrorDisplay, { type ErrorState } from "../components/ErrorDisplay";
import { useEffect, useState } from "react";
import type { ApiErrorState } from "@/types/api-error";
import CalculatorLoading from "../components/CalculatorLoading";
import EmployeeDetails from "../components/EmployeeDetailsView";
import PTOResult from "../components/PTOResult";
import { cn } from "@/lib/utils";
import { handleDrag, handleDrop, isValidFile } from "../utils/utils";

const VacationCalculator = () => {
  /**
   * Local states
   */

  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [employeeDetails, setEmployeeDetails] =
    useState<EmployeesResponseDetail | null>(null);
  const [employeeSelectedIndex, setEmployeeSelectedIndex] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [documentErrorMessage, setDocumentErrorMessage] = useState<
    string | null
  >(null);
  const [documentResult, setDocumentResult] =
    useState<ProcessDocumentResponse | null>(null);
  const [calculationErrorMessage, setCalculationErrorMessage] = useState<
    string | null
  >(null);
  const [calculationResult, setCalculationResult] =
    useState<CalculateVacationResponse | null>(null);
  const [calculationDates, setCalculationDates] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [isLeavePolicyOpen, setIsLeavePolicyOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);

  /**
   * Employee details Response Form
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    getValues,
    reset,
  } = useForm<EmployeeDetailsFomrm>();

  const [getEmployeeData, { isLoading }] = useGetEmployeeDetailsMutation();
  const [processDocument, { isLoading: isProcessingDocument }] =
    useProcessDocumentMutation();
  const [calculateVacation, { isLoading: isCalculating }] =
    useCalculateVacationMutation();

  const handleEmployeeDetailsFomr: SubmitHandler<EmployeeDetailsFomrm> = async (
    data,
  ) => {
    try {
      /**
       * Reset the error state on every new Api request
       */
      setErrorState(null);
      setEmployeeDetails(null);
      setContractFile(null);
      setDocumentErrorMessage(null);
      setDocumentResult(null);
      setCalculationErrorMessage(null);
      setCalculationResult(null);
      setCalculationDates(null);
      setIsLeavePolicyOpen(false);
      setIsBreakdownOpen(false);
      setIsCalculationOpen(false);

      const employeeData = await getEmployeeData(data).unwrap();

      setEmployeeDetails(employeeData);
    } catch (err: unknown) {
      const error = err as ApiErrorState;

      const errorMessage =
        error.data?.detail ??
        "An unexpected error occurred. Please try again later.";

      setErrorState({ message: errorMessage });
    }
  };

  /**
   * Auto-upload and vectorize the contract document whenever a new file is
   * selected, mirroring the legacy `/process_doc` auto-upload-on-select flow.
   * The resulting `pto_logging` audit entry (employeeDetails.id) is patched
   * with the file name on the backend.
   */
  useEffect(() => {
    if (!contractFile || !employeeDetails) {
      return;
    }

    const uploadDocument = async () => {
      try {
        setDocumentErrorMessage(null);

        const result = await processDocument({
          file: contractFile,
          employee_id: employeeDetails.id,
          pto_logging_id: employeeDetails.id,
          client_name:
            employeeDetails.employee_list[employeeSelectedIndex].customer_name,
        }).unwrap();

        setDocumentResult(result);
      } catch (err: unknown) {
        const error = err as ApiErrorState;

        const errorMessage =
          error.data?.detail ??
          "Failed to process the uploaded document. Please try again.";

        setDocumentResult(null);
        setDocumentErrorMessage(errorMessage);
      }
    };

    uploadDocument();
  }, [contractFile, employeeDetails, employeeSelectedIndex, processDocument]);

  /**
   * Submit the accrual dates, employee accrual metadata, and the vectorized
   * contract text to the vacation-calculation endpoint (mirrors legacy
   * `/calculate_vacation_hours_new` submission flow).
   */
  const handleCalculateVacation = async () => {
    if (!employeeDetails || !documentResult) return;

    try {
      setCalculationErrorMessage(null);
      setCalculationResult(null);

      const { start_date, end_date } = getValues();

      const state =
        employeeDetails.employee_list[employeeSelectedIndex].remote_worker ===
        "Y"
          ? employeeDetails.employee_list[employeeSelectedIndex].home_state
          : employeeDetails.employee_list[employeeSelectedIndex].state;

      const result = await calculateVacation({
        start_date,
        end_date,
        state,
        used_vacations: String(
          employeeDetails.employee_list[employeeSelectedIndex].used_vacations,
        ),
        regular_hours_worked:
          employeeDetails.employee_list[employeeSelectedIndex]
            .regular_hours_worked,
        text_inputs: documentResult.results,
        pto_logging_id: employeeDetails.id,
        client_name:
          employeeDetails.employee_list[employeeSelectedIndex].customer_name,
      }).unwrap();

      setCalculationResult(result);
      setCalculationDates({ startDate: start_date, endDate: end_date });
    } catch (err: unknown) {
      const error = err as ApiErrorState;

      const errorMessage =
        error.data?.detail ??
        "Failed to calculate vacation hours. Please try again.";

      setCalculationErrorMessage(errorMessage);
    }
  };

  /**
   * Reset the entire calculator back to its initial state: clears the
   * employee-details form, fetched employee data, uploaded contract file,
   * vectorization result, and any lingering error/success messages.
   */
  const handleClearAll = () => {
    reset({ employee_id: "", start_date: "", end_date: "" });
    setErrorState(null);
    setEmployeeDetails(null);
    setContractFile(null);
    setDocumentErrorMessage(null);
    setDocumentResult(null);
    setCalculationErrorMessage(null);
    setCalculationResult(null);
    setCalculationDates(null);
    setIsLeavePolicyOpen(false);
    setIsBreakdownOpen(false);
    setIsCalculationOpen(false);
  };

  return (
    <>
      {(isLoading || isProcessingDocument || isCalculating) && (
        <CalculatorLoading />
      )}
      <div
        className="mx-3 mt-3 w-auto max-w-240 rounded-md border bg-white px-4 py-4 pb-8 shadow-md backdrop-blur-2xl sm:mx-4 sm:px-6 md:mx-auto md:mt-5 md:min-h-fit md:w-[90%] md:px-8"
      >
        <form
          className="my-6 grid grid-cols-1 items-center justify-end gap-4 sm:my-10 sm:grid-cols-3 lg:grid-cols-4"
          onSubmit={handleSubmit(handleEmployeeDetailsFomr)}
        >
          <div className="flex flex-col justify-between">
            <Label
              htmlFor="employeeID"
              className="block text-sm font-medium mb-2 text-black"
            >
              Employee ID
            </Label>
            <Input
              autoComplete="off"
              startIcon={User}
              id="employeeID"
              type="text"
              {...register("employee_id", {
                required: "Employee id is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Employee ID must contain only numbers",
                },
              })}
              placeholder="Enter Employee ID"
              className={`w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-md ${errors.employee_id ? "border-red-500" : "border-zinc-400/70"} outline-none`}
            />
            <small className="text-red-500">
              {errors.employee_id ? errors.employee_id.message : null}
            </small>
          </div>

          {/* Start Date */}
          <div className="flex flex-col justify-between">
            <Label
              htmlFor="startDate"
              className="block text-sm font-medium mb-2 text-black"
            >
              Accrual Start Date
            </Label>
            <MuiDatePicker<EmployeeDetailsFomrm>
              id={"start_date"}
              control={control}
              rules={{ required: "Start date is required" }}
              sx={{
                "& .MuiPickersOutlinedInput-root": {
                  height: "2.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                },
                "& .MuiPickersInputBase-sectionsContainer": {
                  padding: "0.5rem 1rem",
                },
                "& .MuiIconButton-root": {
                  padding: "0.375rem",
                },
              }}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col justify-between">
            <Label
              htmlFor="endDate"
              className="block text-sm font-medium mb-2 text-black"
            >
              Accrual End Date
            </Label>
            <MuiDatePicker<EmployeeDetailsFomrm>
              id={"end_date"}
              control={control}
              rules={{ required: "End date is required" }}
              sx={{
                "& .MuiPickersOutlinedInput-root": {
                  height: "2.5rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                },
                "& .MuiPickersInputBase-sectionsContainer": {
                  padding: "0.5rem 1rem",
                },
                "& .MuiIconButton-root": {
                  padding: "0.375rem",
                },
              }}
            />
          </div>

          <Button
            id="getDetailsBtn"
            type={"submit"}
            disabled={!isValid || isLoading}
            className="mt-auto flex h-9 w-full cursor-pointer gap-4 bg-[#c0d82e] text-black hover:border hover:bg-white disabled:bg-[#c0d82e] sm:w-auto"
          >
            Get Details <MoveRight />
          </Button>
        </form>

        <div className="mt-8">
          {errorState && (
            <ErrorDisplay
              error={errorState}
              onDismiss={() => {
                setErrorState(null);
              }}
            />
          )}
        </div>

        {employeeDetails && (
          <>
            <EmployeeDetails
              employeeData={employeeDetails.employee_list}
              setEmployeeSelectedIndex={setEmployeeSelectedIndex}
              employeeSelectedIndex={employeeSelectedIndex}
            />
            <div>
              <Label
                htmlFor="contract"
                className="block text-sm font-medium mb-2 text-black"
              >
                Employment Agreement
              </Label>
              <label
                htmlFor="contract" // Associate this label with the input using `htmlFor`
              >
                <div
                  className={cn(
                    "border-2 border-dashed bg-white rounded-md p-6 min-h-24 text-center transition flex justify-center items-center flex-col cursor-pointer",
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300",
                  )}
                  onDragEnter={(event) =>
                    handleDrag({ e: event, setDragActive })
                  }
                  onDragOver={(event) =>
                    handleDrag({ e: event, setDragActive })
                  }
                  onDragLeave={(event) =>
                    handleDrag({ e: event, setDragActive })
                  }
                  onDrop={(event) =>
                    handleDrop({ e: event, setDragActive, setContractFile })
                  }
                >
                  <input
                    type="file"
                    id="contract"
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      if (!isValidFile(file)) {
                        // Show error
                        setDocumentErrorMessage("InvalidFile uploaded");
                        return;
                      }

                      // Upload file
                      setContractFile(file);
                    }}
                  />
                  <FileUp size={48} className="text-gray-600" />
                  {contractFile ? (
                    <div className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-2">
                      <p
                        id="contractFileName"
                        className="text-sm text-gray-700"
                      >
                        {contractFile.name}
                      </p>
                      <Button
                        variant="ghost"
                        size={"icon"}
                        onClick={() => {
                          setContractFile(null);
                          setDocumentResult(null);
                          setDocumentErrorMessage(null);
                        }} // Remove the file
                        className=" text-red-600"
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-4">
                      Drag and drop or browse files
                    </p>
                  )}
                </div>
              </label>
              {documentErrorMessage && (
                <p className="text-red-500 text-base mt-2 font-medium">
                  {documentErrorMessage}
                </p>
              )}
              {isProcessingDocument && (
                <p className="text-gray-500 text-sm mt-2">
                  Processing document...
                </p>
              )}
              {documentResult && !isProcessingDocument && (
                <p className="text-green-600 text-sm mt-2 font-medium">
                  Document processed successfully.
                </p>
              )}
            </div>
            <div className="my-4 flex flex-wrap gap-3">
              <Button
                id="submitBtn"
                onClick={handleCalculateVacation}
                disabled={
                  !documentResult || isProcessingDocument || isCalculating
                }
                className={`px-4 py-2 rounded-md transition duration-300 font-medium border 
            ${
              documentResult
                ? "bg-[#c0d82e] disabled:bg-[#c0d82e] hover:bg-white hover:text-[#c0d82e] border-[#c0d82e] cursor-pointer"
                : "bg-[#c0d82e] text-black border-primarybtn cursor-not-allowed pointer-events-none"
            }`}
              >
                Submit
              </Button>

              <Button
                variant="outline"
                className="bg-[#021a32] text-white"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>

            {calculationErrorMessage && (
              <ErrorDisplay
                error={{ message: calculationErrorMessage }}
                onDismiss={() => setCalculationErrorMessage(null)}
              />
            )}

            {calculationResult && !isCalculating && (
              <PTOResult
                result={calculationResult}
                employeeDetails={
                  employeeDetails.employee_list[employeeSelectedIndex]
                }
                startDate={calculationDates?.startDate ?? ""}
                endDate={calculationDates?.endDate ?? ""}
                isLeavePolicyOpen={isLeavePolicyOpen}
                isBreakdownOpen={isBreakdownOpen}
                isCalculationOpen={isCalculationOpen}
                setIsLeavePolicyOpen={setIsLeavePolicyOpen}
                setIsBreakdownOpen={setIsBreakdownOpen}
                setIsCalculationOpen={setIsCalculationOpen}
                fileName={documentResult?.file_name}
                loggingId={employeeDetails.id}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default VacationCalculator;
