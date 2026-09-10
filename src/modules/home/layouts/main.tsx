import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import useCurrentUserHook from "@/hooks/auth/current-user";
import { useSignoutMutation } from "@/modules/authentication/api/auth-api";
import { RolesEnums } from "@/modules/authentication/enums/auth-enums";
import { resetCurrentUserState } from "@/redux/slices/auth/current-user-slice";
import { allApi } from "@/services/all-api";
import { FileSpreadsheet, LogOut, User } from "lucide-react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet } from "react-router";
import { useNavigate } from "react-router";

const HomeLayout = () => {
  /**
   * Hooks and condifurations
   */
  const { currentUser } = useCurrentUserHook();

  const navigate = useNavigate();
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
      // Clear the in-memory Redux state (currentUser slice + all RTK Query
      // caches) - without this the app still "thinks" it's signed in since
      // clearing localStorage/sessionStorage alone doesn't touch the store.
      dispatch(resetCurrentUserState());
      dispatch(allApi.util.resetApiState());

      // Clear all storage and redirect to login
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  }, [signout, dispatch, navigate]);

  return (
    <div>
      {/**
       * Navbar layout for the entire dashboard and appplication
       */}
      <div className="bg-[#021A32] z-50 sticky top-0 shadow-md py-6 w-full">
        <section className="w-[90%] mx-auto max-w-350 flex justify-between items-center">
          <Logo alt="Logo Image" />

          <p className="text-white md:text-2xl font-semibold hidden md:flex">
            Vacation Hours Calculator
          </p>

          <nav>
            <ul className="flex items-center gap-2 text-gray-400">
              {currentUser.group == RolesEnums.Admin && (
                <>
                  <li>
                    <Link
                      to="report"
                      className="flex gap-2 items-center hover:text-white p-2 rounded-md"
                    >
                      <FileSpreadsheet size={16} />
                      <span className="hidden md:block">Reports</span>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Button
                  onClick={handleSignOut}
                  variant={"link"}
                  className="text-gray-400 text-base hover:no-underline flex gap-2 items-center hover:text-white p-2 rounded-md"
                >
                  <LogOut size={16} />
                  <span className="hidden md:block">Logout</span>
                </Button>
              </li>
              <li>
                <h1 className="user-name text-base bg-[#0d2a47] rounded-md p-2 px-3 flex gap-2 items-center font-medium text-gray-200">
                  <User size={16} />
                  {currentUser.name}
                </h1>
              </li>
            </ul>
          </nav>
        </section>
      </div>

      <Outlet />
    </div>
  );
};

export default HomeLayout;
