import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="/logonotreel.png" 
                alt="NotReel Logo" 
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-primary">
                notreel.ai
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="hidden sm:flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Log in
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};