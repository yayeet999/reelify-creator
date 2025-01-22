import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logonotreel.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-semibold text-lg text-primary">Notreel</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}