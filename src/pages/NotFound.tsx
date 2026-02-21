
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center px-4 max-w-lg mx-auto">
          <div className="text-9xl font-serif font-bold text-brand-blue/10 mb-4">404</div>
          <h1 className="text-4xl font-serif font-semibold mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
