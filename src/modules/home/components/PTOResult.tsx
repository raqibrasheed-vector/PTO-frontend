import { useState } from "react";
import dayjs from "dayjs";
import { Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  CalculateVacationResponse,
  EmployeeResponseForm,
} from "../types/api-types";
import LeavePolicy from "./LeavePolicy";
import LeavePolicyBreakdown from "./LeavePolicyBreakdown";
import LeaveCalculation from "./LeaveCalculation";
import FeedBackButtons from "./FeedBackButtons";

interface PTOResultProps {
  result: CalculateVacationResponse;
  employeeDetails: EmployeeResponseForm;
  startDate: string;
  endDate: string;
  isLeavePolicyOpen: boolean;
  isBreakdownOpen: boolean;
  isCalculationOpen: boolean;
  fileName: string | undefined;
  loggingId: string,
  setIsLeavePolicyOpen: (value: boolean) => void;
  setIsBreakdownOpen: (value: boolean) => void;
  setIsCalculationOpen: (value: boolean) => void;
}

/**
 * Displays the calculated vacation hours available, along with links to
 * view the full leave policy, its section-by-section breakdown, and the
 * step-by-step accrual calculation (mirrors legacy `PTOResult` component).
 */
const PTOResult = ({
  result,
  employeeDetails,
  startDate,
  endDate,
  isLeavePolicyOpen,
  isBreakdownOpen,
  isCalculationOpen,
  fileName,
  loggingId,
  setIsLeavePolicyOpen,
  setIsBreakdownOpen,
  setIsCalculationOpen,
}: PTOResultProps) => {
  const [copySucceeded, setCopySucceeded] = useState(false);

  // Combine the step-by-step accrual calculation with the final
  // used-vacations subtraction, matching the legacy calculation modal.
  const calculationSteps = [
    ...result.leaves_accrued_calculation,
    "To get the available vacation hours, subtract used vacations from total accrued vacations.",
    result.leaves_available_calculation,
  ];

  /**
   * Copy a formatted summary of the vacation calculation to the clipboard
   * (mirrors legacy `handleCopyResult`). Since this frontend has no toast
   * library, success is shown via a short-lived inline message instead.
   */
  const handleCopyResult = async () => {
    const workLocationLabel =
      employeeDetails.remote_worker === "Y" ? "Home Location" : "Work Location";

    const workLocationValue =
      employeeDetails.remote_worker === "Y"
        ? employeeDetails.home_state
        : employeeDetails.state;

    const formattedStartDate = startDate
      ? dayjs(startDate).format("MM-DD-YYYY")
      : "N/A";
    const formattedEndDate = endDate
      ? dayjs(endDate).format("MM-DD-YYYY")
      : "N/A";

    const text = `
Hello ${employeeDetails.employee_name},

I've included your leave balance information below. If you have any other questions, feel free to let us know.

Accrual Start Date          : ${formattedStartDate}
Accrual End Date            : ${formattedEndDate}
${workLocationLabel}        : ${workLocationValue}
Total Hours Worked  : ${employeeDetails.regular_hours_worked || "N/A"}
Total Vacation Hours Used: ${employeeDetails.used_vacations || "0"}
Vacation Hours Available to Use: ${result.vacation_hours_available.toFixed(2)}
`;

    await navigator.clipboard.writeText(text);
    setCopySucceeded(true);
  };

  return (
    <div>
      <div className="mx-auto mt-8 w-full max-w-md rounded-md border bg-white p-5 text-center shadow-md sm:p-8">
        <div
          id="leavesAvailable"
          className="text-6xl font-bold text-[#0569ab] mb-2"
        >
          {result.vacation_hours_available.toFixed(2)}
        </div>
        <div className="text-gray-600">Vacation Hours Available</div>

        <Button onClick={handleCopyResult} className="mt-4" variant="ghost">
          <Files /> Copy Result
        </Button>
        {copySucceeded && (
          <p className="text-green-600 text-xs mt-1">
            Result copied to clipboard!
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm">
        <section className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLeavePolicyOpen(true)}
          >
            Leave Policy
          </button>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsBreakdownOpen(true)}
          >
            Leave Policy Breakdown
          </button>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsCalculationOpen(true)}
          >
            Leave Calculation
          </button>
        </section>

        <FeedBackButtons
          employeeDetails={employeeDetails}
          startDate={startDate}
          endDate={endDate}
          fileName={fileName ?? ""}
          leavesAvailable={result.vacation_hours_available}
          loggingId={loggingId}
        />
      </div>

      <LeavePolicy
        isOpen={isLeavePolicyOpen}
        onClose={() => setIsLeavePolicyOpen(false)}
        policyText={result.leaves_policy}
      />
      <LeavePolicyBreakdown
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        policyBreakdownText={result.leaves_policy_breakdown}
      />
      <LeaveCalculation
        isOpen={isCalculationOpen}
        onClose={() => setIsCalculationOpen(false)}
        calculationText={calculationSteps}
      />
    </div>
  );
};

export default PTOResult;
