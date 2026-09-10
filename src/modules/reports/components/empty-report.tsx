import { Inbox } from "lucide-react";

export function EmptyDataTable() {
  return (
    <div className="rounded-lg border bg-background">
      
      {/* Empty state */}
      <div className="flex min-h-70 flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50">
          <Inbox className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="text-sm font-semibold">No data found</h3>

        <p className="mt-1 max-w-sm text-sm  text-muted-foreground">
          There are no records to display yet.
        </p>
      </div>
    </div>
  );
}