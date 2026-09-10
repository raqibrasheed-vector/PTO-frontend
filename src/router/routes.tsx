import { createBrowserRouter } from "react-router";
import LoginPage from "@/modules/authentication/pages/Login";
import HomeLayout from "@/modules/home/layouts/main";
import VacationCalculator from "@/modules/home/pages/VacationCalculator";
import ProtectedRoute from "./protected-route";
import ReportScreen from "@/modules/reports/pages/main";

/**
 * Global Routes controller for all the routes in the application.
 *
 */

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "home",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        Component: VacationCalculator,
      },
      {
        path: "report",
        Component: ReportScreen,
      },
    ],
  },
]);

export default router;
