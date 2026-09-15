import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Spinner from "@/components/spinner/spinner";
import useCurrentUserHook from "@/hooks/auth/current-user";
import { useLazySignInQuery } from "@/modules/authentication/api/auth-api";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    isLoading: currentUserLoading,
    isError: currentUserError,
    isServerError,
  } = useCurrentUserHook(false);

  const [signInUser] = useLazySignInQuery();
  const [error, setError] = useState(false);

  useEffect(() => {
    const hasValidUser =
      currentUser &&
      typeof currentUser === "object" &&
      Object.keys(currentUser).length > 0;

    if (hasValidUser) {
      navigate("/home", { replace: true });
      return;
    }

    if (currentUserLoading || !currentUserError || isServerError) {
      return;
    }

    let cancelled = false;

    void signInUser()
      .unwrap()
      .then(({ url }) => {
        if (!cancelled) {
          window.location.replace(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentUser,
    currentUserError,
    currentUserLoading,
    isServerError,
    navigate,
    signInUser,
  ]);

  return (
    <div className="flex min-h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center text-white">
        <Spinner />
        <p>
          {error
            ? "Unable to start Microsoft sign-in."
            : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;