import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier } from "@/types/subscription";
import { toast } from "@/components/ui/use-toast";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  subscriptionTier: SubscriptionTier;
  isSubscriptionLoading: boolean;
  subscriptionError: string | null;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("free");
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      setIsSubscriptionLoading(true);
      setSubscriptionError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscriptionTier("free");
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking subscription:", error);
        setSubscriptionError("Failed to check subscription status");
        toast({
          title: "Error",
          description: "Failed to check subscription status. Using free tier as fallback.",
          variant: "destructive",
        });
        setSubscriptionTier("free");
        return;
      }

      setSubscriptionTier(profile.subscription_tier);
    } catch (error) {
      console.error("Error in checkSubscription:", error);
      setSubscriptionError("An unexpected error occurred");
      setSubscriptionTier("free");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Using free tier as fallback.",
        variant: "destructive",
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const cleanupAuthResources = () => {
    // Clean up all realtime subscriptions
    const allChannels = supabase.getChannels();
    allChannels.forEach((channel) => {
      supabase.removeChannel(channel);
    });

    // Clear local storage and cookies
    localStorage.removeItem("sb-tdfqshwqqsdjsicrrajl-auth-token");
    document.cookie = "sb-tdfqshwqqsdjsicrrajl-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Reset all state
    setSubscriptionTier("free");
    setIsAuthenticated(false);
    setSubscriptionError(null);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try signing in again.",
            variant: "destructive",
          });
        }
        
        if (mounted) {
          setIsAuthenticated(!!session);
          if (session) {
            try {
              await checkSubscription();
            } catch (err) {
              console.error("checkSubscription error:", err);
              setSubscriptionTier("free");
            }
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          toast({
            title: "Error",
            description: "There was a problem initializing the application. Please refresh the page.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setIsAuthenticated(!!session);
        
        if (event === "SIGNED_IN" && session) {
          try {
            await checkSubscription();
            navigate("/dashboard");
          } catch (error) {
            console.error("Error during sign in:", error);
            setSubscriptionTier("free");
          } finally {
            setIsLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          cleanupAuthResources();
          navigate("/auth");
        }
      }
    );

    // Listen for real-time subscription updates
    const subscriptionChannel = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        },
        async (payload) => {
          if (!mounted) return;
          
          if (payload.new.subscription_tier !== subscriptionTier) {
            setSubscriptionTier(payload.new.subscription_tier as SubscriptionTier);
            toast({
              title: "Subscription Updated",
              description: `Your subscription has been updated to ${payload.new.subscription_tier}`,
            });
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      mounted = false;
      authSubscription.unsubscribe();
      supabase.removeChannel(subscriptionChannel);
    };
  }, [navigate, subscriptionTier]);

  const value: AuthState = {
    isAuthenticated,
    isLoading,
    subscriptionTier,
    isSubscriptionLoading,
    subscriptionError,
    checkSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}