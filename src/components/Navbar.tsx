import { Button } from "@/components/ui/button";
import { Menu, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { isLoading, subscriptionTier, retrySubscriptionCheck } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // 1. Unsubscribe from all channels
      const allChannels = supabase.getChannels();
      allChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });

      // 2. Sign out with Supabase
      await supabase.auth.signOut();

      // 3. Clear storage with retry mechanism for Norton interference
      const clearStorageWithRetry = () => {
        localStorage.removeItem("sb-tdfqshwqqsdjsicrrajl-auth-token");
        // Double-check if token was actually removed
        if (localStorage.getItem("sb-tdfqshwqqsdjsicrrajl-auth-token")) {
          localStorage.setItem("sb-tdfqshwqqsdjsicrrajl-auth-token", ""); // Force blank
          localStorage.removeItem("sb-tdfqshwqqsdjsicrrajl-auth-token"); // Try remove again
        }
      };
      clearStorageWithRetry();

      // 4. Clear cookies with all possible paths
      const paths = ['/', '/auth', '/dashboard'];
      paths.forEach(path => {
        document.cookie = `sb-tdfqshwqqsdjsicrrajl-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      });

      // 5. Show success toast and redirect
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again or refresh the page.",
        variant: "destructive",
        action: <button onClick={() => window.location.reload()}>Refresh Page</button>,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
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

          {/* Subscription Badge */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoading || isLoggingOut ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Button 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <div className="px-4 py-2">
                <span className="text-sm font-medium text-gray-600">
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                </span>
              </div>
              <div className="flex flex-col space-y-2 px-4">
                {isLoading || isLoggingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                ) : (
                  <Button 
                    onClick={handleLogout} 
                    className="w-full"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};