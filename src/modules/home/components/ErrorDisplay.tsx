
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export type ErrorState = {
  message: string;
};

type ErrorDisplayProps = {
  error: ErrorState;
  onDismiss: () => void;
};

const ErrorDisplay = ({ error, onDismiss }: ErrorDisplayProps) => {
  return (
    <Alert
      variant="destructive"
      className="my-4 flex items-start gap-3"
    >
      <AlertDescription className="flex flex-1 items-center justify-between gap-4 text-sm font-medium sm:text-base">
        <span>{error.message}</span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDismiss}
          className="shrink-0 border-destructive/30 hover:bg-destructive/10"
        >
          <X className="mr-1.5 h-4 w-4" />
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;

