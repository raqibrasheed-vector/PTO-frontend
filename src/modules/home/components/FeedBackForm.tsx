import type {
  EmployeeResponseForm,
  FeedBackFormSubmit,
} from "../types/api-types";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import type { feedBackForm } from "../types/form-types";
import { useSubmitFeedBackFormMutation } from "../api/analytics/analytics-api";
import { FeedBackTypes } from "./FeedBackButtons";
import type { ApiErrorState } from "@/types/api-error";
import { toast } from "sonner";

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeDetails: EmployeeResponseForm;
  employeeId?: string;
  startDate: string;
  endDate: string;
  leaves_available: number;
  fileName: string | undefined;
  logging_id: string;
  setFeedbackType: Dispatch<SetStateAction<"up" | "down" | null>>;
}

const feedbackOptions = [
  { id: "id_1", label: "Calculator provided incorrect balance" },
  { id: "id_2", label: "Calculator provided incorrect employee details" },
  { id: "id_3", label: "Calculator interpreted accrual rate incorrectly" },
  { id: "id_4", label: "Others" },
];

const FeedBackForm = ({
  open,
  onOpenChange,
  employeeDetails,
  startDate,
  endDate,
  leaves_available,
  fileName,
  logging_id,
  setFeedbackType,
}: FeedbackFormProps) => {
  /**
   * Local States
   */
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [submitFeedBackForm, { isLoading }] = useSubmitFeedBackFormMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<feedBackForm>({
    defaultValues: { feedback: "" },
  });

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const updatedOptions = checked
      ? [...selectedOptions, optionId]
      : selectedOptions.filter((id) => id !== optionId);
    setSelectedOptions(updatedOptions);
  };

  const handleFeedBackSubmitForm = async (data: feedBackForm) => {
    const selectedFeedback = feedbackOptions
      .filter((option) => selectedOptions.includes(option.id))
      .filter((option) => option.id !== "id_4")
      .map((option) => option.label);
    const feedbackParts = [...selectedFeedback];
    if (selectedOptions.includes("id_4") && data.feedback?.trim()) {
      feedbackParts.push(data.feedback.trim());
    }
    const feedbackParsed = {
      ...data,
      feedback: feedbackParts.join(", "),
    };

    try {
      const formPayload: FeedBackFormSubmit = {
        pto_logging_id: logging_id,
        feedback: feedbackParsed.feedback,
        feedback_type: FeedBackTypes.ThumbsDown,
        file_name: fileName ?? "",
        employee_id: employeeDetails?.employee_id,
        start_date: startDate,
        end_date: endDate,
        employee_name: employeeDetails.employee_name,
        client_name: employeeDetails.customer_name,
        total_hours: employeeDetails.regular_hours_worked,
        total_leaves_used: employeeDetails.used_vacations,
        state: employeeDetails?.state,
        leaves_available: leaves_available,
      };

      await submitFeedBackForm(formPayload).unwrap();
      setFeedbackType("down");

      toast.success("Feedback form submitted.");
    } catch (err: unknown) {
      const error = err as ApiErrorState;

      const errorMessage =
        error.data?.detail ?? "Failed to submit form. Please try again.";

      toast.error(errorMessage);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">Feedback</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFeedBackSubmitForm)}
          className="space-y-4"
        >
          {" "}
          <p className="pb-2 text-black"> Please submit your feedback </p>
          {feedbackOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 pt-2">
              {" "}
              <Checkbox
                id={option.id}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option.id, checked === true)
                }
              />{" "}
              <Label htmlFor={option.id}>{option.label}</Label>{" "}
            </div>
          ))}
          {selectedOptions.includes("id_4") && (
            <div className="space-y-2">
              {" "}
              <Label htmlFor="feedback">Enter your feedback</Label>{" "}
              <Textarea
                id="feedback"
                placeholder="Enter your feedback"
                {...register("feedback", {
                  required: "Please enter your feedback",
                })}
              />{" "}
              {errors.feedback && (
                <p className="text-sm text-red-500">
                  {" "}
                  {errors.feedback.message}{" "}
                </p>
              )}{" "}
            </div>
          )}{" "}
          <div className="flex justify-end gap-2">
            {" "}
            <Button
              type="button"
              title="Cancel"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="bg-[#021a32] text-white"
            >
              {" "}
              Cancel{" "}
            </Button>{" "}
            <Button
              type="submit"
              title="Submit Feedback"
              disabled={isLoading}
              className="bg-[#c0d82e] text-black hover:bg-white"
            >
              {" "}
              Submit Feedback{" "}
            </Button>{" "}
          </div>{" "}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedBackForm;
