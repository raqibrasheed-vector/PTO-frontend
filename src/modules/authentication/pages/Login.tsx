import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";

import Logo from "@/components/common/Logo";
import Spinner from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { useLazySignInQuery } from "@/modules/authentication/api/auth-api";
import { selectCurrentUSer } from "@/redux/selectors/auth/current-user-selector";

/**
 * Official four-colour Microsoft logo mark (inline so no extra asset/network
 * request is needed).
 */
const MicrosoftLogo = () => (
  <svg viewBox="0 0 21 21" className="h-4.5 w-4.5" aria-hidden="true">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUSer);

  const [signInUser, { isFetching, isLoading }] = useLazySignInQuery();
  const [error, setError] = useState(false);

  // Already signed in - skip the landing screen entirely.
  useEffect(() => {
    const hasValidUser =
      currentUser &&
      typeof currentUser === "object" &&
      Object.keys(currentUser).length > 0;

    if (hasValidUser) {
      navigate("/home", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignIn = useCallback(async () => {
    setError(false);

    try {
      const signInDetails = await signInUser().unwrap();
      window.location.href = signInDetails.url;
    } catch {
      setError(true);
    }
  }, [signInUser]);

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[#021A32] p-4">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(194,213,0,0.12),_transparent_55%)]" />

      <div className="relative w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-[#0d2a47] p-8 shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center gap-6 text-center">
          <Logo alt="Actalent" />

          <div className="space-y-1.5">
            <p className="text-sm text-gray-400">
              Sign in with your Microsoft account to continue.
            </p>
          </div>
        </div>

        {/* Sign in action */}
        <div className="space-y-3">
          <Button
            onClick={handleSignIn}
            disabled={isFetching}
            className="w-full gap-2 bg-white text-gray-900 hover:bg-gray-100"
          >
            {isFetching || isLoading ? (
              <Spinner className="text-gray-900" />
            ) : (
              <MicrosoftLogo />
            )}
            {isFetching || isLoading ? "Redirecting to Microsoft..." : "Sign in with Microsoft"}
          </Button>

          {error && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Couldn't start sign-in. Please try again.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">
          Secured by your Actalent's Single Sign-On (SAML).
        </p>
      </div>
    </div>
  );
};

export default LoginPage;