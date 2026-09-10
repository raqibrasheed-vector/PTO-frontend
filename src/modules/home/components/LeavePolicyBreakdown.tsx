import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeavePolicyBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  policyBreakdownText: string[];
}

/**
 * Splits a "Heading: description" string into its heading and description
 * parts (on the first colon only), so the heading can be styled distinctly.
 */
const splitHeading = (policy: string): [string, string] => {
  const separatorIndex = policy.indexOf(":");

  if (separatorIndex === -1) {
    return ["", policy];
  }

  return [
    policy.slice(0, separatorIndex + 1),
    policy.slice(separatorIndex + 1).trim(),
  ];
};

/**
 * Modal showing the section-by-section breakdown of the vacation policy
 * (Initial Eligibility, Earning & Accruing Vacations, Carryovers, etc).
 */
const LeavePolicyBreakdown = ({
  isOpen,
  onClose,
  policyBreakdownText: policies,
}: LeavePolicyBreakdownProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            Leave Policy Breakdown
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
          {policies.length > 1 ? (
            <ul className="list-disc pl-9 space-y-1">
              {policies.map((policy, index) => {
                const [heading, description] = splitHeading(policy);

                return (
                  <li key={index} className="text-sm">
                    {heading && (
                      <span className="font-semibold text-black">
                        {heading}{" "}
                      </span>
                    )}
                    {description}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm">
              {(() => {
                const [heading, description] = splitHeading(policies[0]);

                return (
                  <>
                    {heading && (
                      <span className="font-semibold text-black">
                        {heading}{" "}
                      </span>
                    )}
                    {description}
                  </>
                );
              })()}
            </p>
          )}
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

export default LeavePolicyBreakdown;
