import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier } from "@/types/subscription";
import { toast } from "@/components/ui/use-toast";
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// Constants for timeouts
const AUTH_TIMEOUT = 10000; // 10 seconds
const SUBSCRIPTION_TIMEOUT = 5000; // 5 seconds

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

// Utility function for timeout handling
const withTimeout = <T,>(promise: Promise<T>, timeout: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeout);
    }),
  ]);
};

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
      
      const userResponse = await withTimeout(
        supabase.auth.getUser(),
        SUBSCRIPTION_TIMEOUT,
        "Subscription check timed out"
      );

      if (!userResponse.data.user) {
        setSubscriptionTier("free");
        return;
      }

      const profileResponse = await withTimeout(
        supabase
          .from("users")
          .select("subscription_tier")
          .eq("id", userResponse.data.user.id)
          .single() as unknown as Promise<PostgrestSingleResponse<{ subscription_tier: SubscriptionTier }>>,
        SUBSCRIPTION_TIMEOUT,
        "Subscription data fetch timed out"
      );

      if (profileResponse.error) {
        console.error("Error checking subscription:", profileResponse.error);
        setSubscriptionError("Failed to check subscription status");
        setSubscriptionTier("free");
        // Only show toast for non-timeout errors
        if (!profileResponse.error.message.includes("timed out")) {
          toast({
            title: "Subscription Check Failed",
            description: "Using free tier as fallback. Click to retry.",
            variant: "destructive",
            action: <button onClick={retrySubscriptionCheck}>Retry</button>,
          });
        }
        return;
      }

      setSubscriptionTier(profileResponse.data.subscription_tier);
    } catch (error) {
      console.error("Error in checkSubscription:", error);
      setSubscriptionError(error instanceof Error ? error.message : "An unexpected error occurred");
      setSubscriptionTier("free");
      // Only show toast for non-timeout errors
      if (error instanceof Error && !error.message.includes("timed out")) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          action: <button onClick={retrySubscriptionCheck}>Retry</button>,
        });
      }
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
        const sessionResponse = await withTimeout(
          supabase.auth.getSession(),
          AUTH_TIMEOUT,
          "Auth session check timed out"
        );
        
        if (sessionResponse.error) {
          console.error("Session error:", sessionResponse.error);
          toast({
            title: "Authentication Error",
            description: "There was a problem checking your session. Please try signing in again.",
            variant: "destructive",
            action: <button onClick={() => navigate("/auth")}>Sign In</button>,
          });
        }
        
        if (mounted) {
          setIsAuthenticated(!!sessionResponse.data.session);
          if (sessionResponse.data.session) {
            await checkSubscription().catch(error => {
              console.error("Error checking subscription during init:", error);
              setSubscriptionTier("free");
            });
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          toast({
            title: "Error",
            description: err instanceof Error ? err.message : "There was a problem initializing the application. Please refresh the page.",
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

    // Set up auth state change listener with correct subscription handling
    const { data: subscriptionData } = supabase.auth.onAuthStateChange(async (event, session) => {
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

    // Store just the actual subscription
    authSubscription = subscriptionData.subscription;

    // Set up subscription update listener
    if (mounted) {
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
    }

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