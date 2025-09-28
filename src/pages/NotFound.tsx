import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <Utensils className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            Oops! The recipe you're looking for seems to have wandered off the menu. 
            Let's get you back to exploring delicious, healthy meals.
          </p>
        </div>
        
        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href="/">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
