
import { AlertCircle, LogOut, RefreshCw } from "lucide-react";
import Logo from "@/components/common/Logo";
import { Button } from "../ui/button";

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
    <div className="flex min-h-screen flex-col bg-[#f5f7f8]">
      <header className="flex h-20 items-center bg-[#021a32] px-6 shadow-md sm:px-10">
        <Logo alt="Actalent" />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#c0d82e]/20">
              <AlertCircle className="h-8 w-8 text-[#021a32]" />
            </div>
          </div>

          <div className="mt-6 space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-[#021a32]">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600">
              We&apos;re unable to load your account information. This might be a temporary issue with our servers.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={onReload}
              className="w-full gap-2 bg-[#c0d82e] text-[#021a32] hover:bg-[#d0e94a]"
            >
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>

            <Button
              onClick={onSignOut}
              variant="outline"
              className="w-full gap-2 border-[#021a32] text-[#021a32] hover:bg-[#021a32] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="mt-6 rounded-md bg-[#f5f7f8] p-3 text-center">
            <p className="text-xs text-gray-600">
              If this problem persists after reloading, please try signing out and signing back in.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
