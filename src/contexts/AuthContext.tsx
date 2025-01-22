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
  retrySubscriptionCheck: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("free");
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const cleanupAuthResources = () => {
    try {
      // Clean up all realtime subscriptions
      const allChannels = supabase.getChannels();
      allChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });

      // Clear local storage with retry mechanism
      const clearStorageWithRetry = () => {
        localStorage.removeItem("sb-tdfqshwqqsdjsicrrajl-auth-token");
        // Double-check if token was actually removed (Norton interference check)
        if (localStorage.getItem("sb-tdfqshwqqsdjsicrrajl-auth-token")) {
          localStorage.setItem("sb-tdfqshwqqsdjsicrrajl-auth-token", ""); // Force blank
          localStorage.removeItem("sb-tdfqshwqqsdjsicrrajl-auth-token"); // Try remove again
        }
      };
      clearStorageWithRetry();
      
      // Clear cookies with all possible paths
      const paths = ['/', '/auth', '/dashboard'];
      paths.forEach(path => {
        document.cookie = `sb-tdfqshwqqsdjsicrrajl-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      });
      
      // Reset all state
      setSubscriptionTier("free");
      setIsAuthenticated(false);
      setSubscriptionError(null);
      setRetryCount(0);
    } catch (error) {
      console.error("Error during cleanup:", error);
      toast({
        title: "Cleanup Error",
        description: "There was an issue cleaning up your session. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

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
        setSubscriptionTier("free");
        toast({
          title: "Subscription Check Failed",
          description: "Using free tier as fallback. Click to retry.",
          variant: "destructive",
          action: <button onClick={retrySubscriptionCheck}>Retry</button>,
        });
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
        action: <button onClick={retrySubscriptionCheck}>Retry</button>,
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const retrySubscriptionCheck = async () => {
    if (retryCount >= 3) {
      toast({
        title: "Too Many Retries",
        description: "Please refresh the page or contact support if the issue persists.",
        variant: "destructive",
      });
      return;
    }
    setRetryCount(prev => prev + 1);
    await checkSubscription();
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    let subscriptionChannel: ReturnType<typeof supabase.channel> | null = null;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try signing in again.",
            variant: "destructive",
            action: <button onClick={() => navigate("/auth")}>Sign In</button>,
          });
        }
        
        if (mounted) {
          setIsAuthenticated(!!session);
          if (session) {
            await checkSubscription();
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          toast({
            title: "Error",
            description: "There was a problem initializing the application. Please refresh the page.",
            variant: "destructive",
            action: <button onClick={() => window.location.reload()}>Refresh</button>,
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize auth and set up listeners
    initializeAuth();

    // Set up auth state change listener
    authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
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
    });

    // Set up subscription update listener
    subscriptionChannel = supabase
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
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
      if (subscriptionChannel) {
        supabase.removeChannel(subscriptionChannel);
      }
    };
  }, [navigate, subscriptionTier]);

  const value: AuthState = {
    isAuthenticated,
    isLoading,
    subscriptionTier,
    isSubscriptionLoading,
    subscriptionError,
    checkSubscription,
    retrySubscriptionCheck,
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