import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col bg-[#f5f7f8]">
      <header className="flex h-20 items-center bg-[#021a32] px-6 shadow-md sm:px-10">
        <Logo alt="Actalent" />
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-7xl font-bold text-[#021a32]">404</p>
          <h1 className="mt-4 text-2xl font-semibold text-[#021a32]">
            Page not found
          </h1>
          <p className="mt-2 text-gray-600">
            The page you are looking for does not exist.
          </p>
          <Button asChild className="mt-6 bg-[#c0d82e] text-[#021a32] hover:bg-[#d0e94a]">
            <Link to="/home">Go to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
