import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-[#021a32]">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600">
          The page you are looking for does not exist.
        </p>
        <Button asChild className="mt-6 bg-[#021a32] text-white">
          <Link to="/home">Go to home</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
