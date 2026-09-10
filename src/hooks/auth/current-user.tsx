/**
 *
 * Hook to manage the current user State and Handles the user redirect state.
 */
import {
  useGetCurrentUserQuery,
  useLazySignInQuery,
} from "@/modules/authentication/api/auth-api";

import { useSelector } from "react-redux";

import { useEffect, useState } from "react";
import type { CurrentUser } from "@/modules/authentication/api/auth-api-types";
import { selectCurrentUSer } from "@/redux/selectors/auth/current-user-selector";

interface currentUserHookState {
  currentUser: CurrentUser;
  isLoading: boolean;
  isError: boolean;
  /**
   * True only when the current-user fetch failed with a genuine server
   * error (5xx / unknown), as opposed to an auth error (401/403) which is
   * handled by redirecting to the SSO login flow.
   */
  isServerError: boolean;
  /**
   * True while a 401/403 has been detected and we're in the process of
   * fetching the SSO login URL / redirecting away from the app. Callers
   * should treat this the same as `isLoading` (e.g. keep showing a spinner)
   * rather than surfacing an error screen.
   */
  isAuthRedirecting: boolean;
}

const useCurrentUserHook = (
  isLoginNavigate: boolean = true,
): currentUserHookState => {
  const currentUser = useSelector(selectCurrentUSer) as CurrentUser;

  const [signInUser, { isLoading: signInLoading, isFetching }] =
    useLazySignInQuery();

  const [redirectFailed, setRedirectFailed] = useState(false);

  // Check if we already have valid user data
  const hasValidUser =
    currentUser &&
    typeof currentUser === "object" &&
    Object.keys(currentUser).length > 0;

  // Fetch user data if we don't have it yet
  // Skip if we already have valid user data to prevent unnecessary refetches on navigation
  const { isLoading: userLoading, isError, error } = useGetCurrentUserQuery(
    { isShowError: isLoginNavigate },
    {
      skip: hasValidUser,
      refetchOnMountOrArgChange: 300, // Only refetch if last fetch was >5 minutes ago
      refetchOnReconnect: true,
    },
  );

  const isLoading = userLoading || signInLoading || isFetching;

  // Derive the status code once so both the effect and the returned state
  // agree on whether this is an auth error (401/403) or a real server error.
  const statusCode =
    isError && error && "status" in error
      ? typeof error.status === "number"
        ? error.status
        : parseInt(String(error.status), 10)
      : undefined;

  const isAuthError = statusCode === 401 || statusCode === 403;
  const isServerError = isError && !isAuthError;

  // Derived directly from render-time state (no need to wait for the effect
  // to run), so the very first render after the error already reports
  // "redirecting" and ProtectedRoute shows a spinner instead of flashing an
  // error screen.
  const isAuthRedirecting = isLoginNavigate && isAuthError && !redirectFailed;

  useEffect(() => {
    if (!isLoginNavigate) return;
    if (!isAuthError) return;

    // initialize login url
    (async () => {
      try {
        const SignInDetails = await signInUser().unwrap();
        window.location.href = SignInDetails.url;
      } catch {
        // Could not obtain the SSO login URL - stop pretending we're
        // redirecting so the caller can fall back to an error state.
        setRedirectFailed(true);
      }
    })();

    // For server errors (500+), the Redux slice automatically clears user data via matchRejected
    // This will cause the error screen to be displayed in ProtectedRoute
    // No need to manually clear state here

    // Don't redirect on network errors - these might be temporary
    // Removed: FETCH_ERROR, TIMEOUT_ERROR redirects
  }, [isAuthError, isLoginNavigate, signInUser]);

  return {
    currentUser,
    isLoading,
    isError,
    isServerError,
    isAuthRedirecting,
  };
};

export default useCurrentUserHook;
