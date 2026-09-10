import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportErrorProps {
  message: string;
  onRetry: () => void;
  compact?: boolean;
}

export default function ReportError({
  message,
  onRetry,
  compact = false,
}: ReportErrorProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 text-red-800 ${
        compact ? "px-3 py-2 text-xs" : "mx-10 my-4 px-4 py-3 text-sm"
      }`}
      role="alert"
    >
      <span className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {message}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="shrink-0 gap-1 border-red-300 text-red-800 hover:bg-red-100"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}
