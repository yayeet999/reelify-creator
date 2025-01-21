import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logonotreel.png" 
              alt="NotReel Logo" 
              className="h-8 w-auto"
            />
            <span className="text-2xl font-bold text-primary">
              notreel.ai
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/auth" className="text-gray-600 hover:text-primary">
              Sign In
            </Link>
            <Link to="/auth">
              <Button>Get Started Free</Button>
            </Link>
          </nav>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};