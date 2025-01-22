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
  const navigate = useNavigate();
  const { isLoading, subscriptionTier } = useAuth();

  const handleLogout = async () => {
    try {
      // 1. Unsubscribe from all channels
      const allChannels = supabase.getChannels();
      allChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });

      // 2. Sign out with Supabase
      await supabase.auth.signOut();

      // 3. Force-remove the local storage token and cookies
      localStorage.removeItem("sb-tdfqshwqqsdjsicrrajl-auth-token");
      document.cookie = "sb-tdfqshwqqsdjsicrrajl-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 4. Show success toast and redirect
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
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
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Button onClick={handleLogout}>
                Log out
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
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                ) : (
                  <Button onClick={handleLogout} className="w-full">
                    Log out
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