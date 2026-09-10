import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type {
  EmployeeResponseForm,
  FeedBackFormSubmit,
} from "../types/api-types";
import FeedBackForm from "./FeedBackForm";
import type { ApiErrorState } from "@/types/api-error";
import { useSubmitFeedBackFormMutation } from "../api/analytics/analytics-api";
import { toast } from "sonner";

type Props = {
  employeeDetails: EmployeeResponseForm;
  startDate: string;
  endDate: string;
  leavesAvailable: number;
  fileName: string;
  loggingId: string;
};

export const FeedBackTypes = {
  ThumbsUp: "thumbs_up",
  ThumbsDown: "thumbs_down",
} as const;

const FeedBackButtons = ({
  employeeDetails,
  startDate,
  endDate,
  leavesAvailable,
  fileName,
  loggingId,
}: Props) => {
  console.log(employeeDetails);
  /**
   * Local feedback states
   */
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [submitFeedBackForm, { isLoading }] = useSubmitFeedBackFormMutation();

  const handlePositiveFeedback = async () => {
    // Update the feedback state
    setFeedback("up");

    try {
      const formPayload: FeedBackFormSubmit = {
        pto_logging_id: loggingId,
        feedback: "Positive Feedback",
        feedback_type: FeedBackTypes.ThumbsUp,
        file_name: fileName ?? "",
        employee_id: employeeDetails?.employee_id,
        start_date: startDate,
        end_date: endDate,
        employee_name: employeeDetails.employee_name,
        client_name: employeeDetails.customer_name,
        total_hours: employeeDetails.regular_hours_worked,
        total_leaves_used: employeeDetails.used_vacations,
        state: employeeDetails?.state,
        leaves_available: leavesAvailable,
      };

      await submitFeedBackForm(formPayload).unwrap();
      toast.success("Feedback form submitted.");
    } catch (err: unknown) {
      const error = err as ApiErrorState;

      const errorMessage =
        error.data?.detail ?? "Failed to submit form. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          title="Like"
          variant="ghost"
          className="cursor-pointer"
          size="icon"
          disabled={isLoading}
          onClick={handlePositiveFeedback}
        >
          <ThumbsUp className={feedback === "up" ? "text-blue-600" : ""} />
        </Button>
        <Button
          variant="ghost"
          title="Dislike"
          size="icon"
          className="cursor-pointer"
          disabled={isLoading}
          onClick={() => setShowFeedbackForm(true)}
        >
          <ThumbsDown
            xlinkTitle=""
            className={feedback === "down" ? "text-blue-600" : ""}
          />
        </Button>
      </div>
      <FeedBackForm
        open={showFeedbackForm}
        onOpenChange={setShowFeedbackForm}
        employeeDetails={employeeDetails}
        startDate={startDate}
        endDate={endDate}
        leaves_available={leavesAvailable}
        fileName={fileName}
        setFeedbackType={setFeedback}
        logging_id={loggingId}
      />
    </>
  );
};

export default FeedBackButtons;
