import ServerErrorScreen from "@/components/error-screen/error-screen";
import Spinner from "@/components/spinner/spinner";
import useCurrentUserHook from "@/hooks/auth/current-user";
import { useSignoutMutation } from "@/modules/authentication/api/auth-api";
import { resetCurrentUserState } from "@/redux/slices/auth/current-user-slice";
import { allApi } from "@/services/all-api";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const { isLoading, currentUser, isServerError, isAuthRedirecting } =
    useCurrentUserHook();

  const dispatch = useDispatch();

  const [signout] = useSignoutMutation();

  /**
   * Handle sign out action
   * Clears session and redirects to login
   */
  const handleSignOut = useCallback(async () => {
    try {
      await signout().unwrap();
    } catch {
      // Even if signout fails, clear local state
    } finally {
      // Clear the in-memory Redux state so the app doesn't still think
      // we're signed in after clearing storage alone.
      dispatch(resetCurrentUserState());
      dispatch(allApi.util.resetApiState());

      // Clear all storage and redirect to login
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [signout, dispatch]);

  /**
   * Handle reload action
   * Reloads the entire application
   */
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  /**
   * Display the spinner component while loading the current user, or while
   * a 401/403 has been detected and we're redirecting to the SSO login flow.
   */
  if (isLoading || isAuthRedirecting) {
    return (
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }

  /**
   * Check if currentUser has actual data (not just an empty object)
   */
  const hasValidUser =
    currentUser &&
    typeof currentUser === "object" &&
    Object.keys(currentUser).length > 0;

  /**
   * Display server error screen only for genuine server errors (5xx/unknown).
   * Auth errors (401/403) are handled above via the SSO redirect flow.
   */
  if (isServerError && !hasValidUser) {
    return (
      <ServerErrorScreen onSignOut={handleSignOut} onReload={handleReload} />
    );
  }

  /**
   * Navigate to login screen if current user is not present
   */
  if (!hasValidUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
