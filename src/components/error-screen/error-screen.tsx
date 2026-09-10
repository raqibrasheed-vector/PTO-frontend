
import { AlertCircle, LogOut, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"

interface ServerErrorScreenProps {
  onSignOut: () => void
  onReload: () => void
}

/**
 * Server Error Screen Component
 *
 * Displayed when the current-user endpoint returns a 500 server error.
 * Provides options to sign out or reload the application.
 */
export default function ServerErrorScreen({ onSignOut, onReload }: ServerErrorScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            We're unable to load your account information. This might be a temporary issue with our
            servers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={onReload} variant="default" className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Reload
          </Button>

          <Button onClick={onSignOut} variant="outline" className="w-full gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Additional Help */}
        <div className="rounded-lg border bg-muted/20 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            If this problem persists after reloading, please try signing out and signing back in.
          </p>
        </div>
      </div>
    </div>
  )
}
