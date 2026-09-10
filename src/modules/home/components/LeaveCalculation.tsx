import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeaveCalculationProps {
  isOpen: boolean;
  onClose: () => void;
  calculationText: string[];
}

/**
 * Modal showing the step-by-step vacation accrual calculation, followed by
 * the final subtraction of used vacations to arrive at the available hours.
 */
const LeaveCalculation = ({
  isOpen,
  onClose,
  calculationText,
}: LeaveCalculationProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Leave Calculation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
            {calculationText.map((step, index) => (
              <li key={index} className="first-letter:capitalize">
                {step}
              </li>
            ))}
          </ul>
        </div>

        <button
          title="Close"
          onClick={onClose}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          OK
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveCalculation;
