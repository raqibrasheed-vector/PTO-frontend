import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeavePolicyProps {
  isOpen: boolean;
  onClose: () => void;
  policyText: string;
}

/**
 * Modal showing the full extracted vacation policy text.
 */
const LeavePolicy = ({ isOpen, onClose, policyText }: LeavePolicyProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4 text-black">
            Leave Policy
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <p className="text-sm">{policyText}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          OK
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default LeavePolicy;
