import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier } from "@/types/subscription";
import { toast } from "@/components/ui/use-toast";
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// Enhanced timeout and caching constants
const AUTH_TIMEOUT = 10000;
const SUBSCRIPTION_TIMEOUT = 10000;
const SUBSCRIPTION_CACHE_TTL = 5 * 60 * 1000;

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

const withTimeout = <T,>(promise: Promise<T>, timeout: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeout);
    }),
  ]);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("free");
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [lastSubscriptionCheck, setLastSubscriptionCheck] = useState(0);
  const [cachedSubscriptionTier, setCachedSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const navigate = useNavigate();

  const cleanupAuthResources = useCallback(() => {
    setIsAuthenticated(false);
    setSubscriptionTier("free");
    setSubscriptionError(null);
    setCachedSubscriptionTier(null);
    setLastSubscriptionCheck(0);
  }, []);

  const checkSubscription = useCallback(async () => {
    const now = Date.now();
    if (cachedSubscriptionTier && (now - lastSubscriptionCheck < SUBSCRIPTION_CACHE_TTL)) {
      setSubscriptionTier(cachedSubscriptionTier);
      return;
    }

    try {
      setIsSubscriptionLoading(true);
      setSubscriptionError(null);

      const userResponse = await withTimeout(
        supabase.auth.getUser(),
        SUBSCRIPTION_TIMEOUT,
        "Subscription check timed out"
      );

      if (!userResponse.data.user) {
        setSubscriptionTier(cachedSubscriptionTier || "free");
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
        setSubscriptionTier(cachedSubscriptionTier || "free");
        return;
      }

      setLastSubscriptionCheck(now);
      setCachedSubscriptionTier(profileResponse.data.subscription_tier);
      setSubscriptionTier(profileResponse.data.subscription_tier);
    } catch (error) {
      console.error("Error in checkSubscription:", error);
      setSubscriptionError(error instanceof Error ? error.message : "An unexpected error occurred");
      setSubscriptionTier(cachedSubscriptionTier || "free");
    } finally {
      setIsSubscriptionLoading(false);
    }
  }, [cachedSubscriptionTier, lastSubscriptionCheck]);

  const retrySubscriptionCheck = useCallback(async () => {
    await checkSubscription();
  }, [checkSubscription]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
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
            description: err instanceof Error ? err.message : "There was a problem initializing the application",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setIsAuthenticated(!!session);
      
      if (event === "SIGNED_IN" && session) {
        await checkSubscription();
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        cleanupAuthResources();
        navigate("/auth");
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, checkSubscription, cleanupAuthResources]);

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