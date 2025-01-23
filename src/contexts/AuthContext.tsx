import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier } from "@/types/subscription";
import { toast } from "@/components/ui/use-toast";
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

// Constants for timeouts and caching
const AUTH_TIMEOUT = 10000; // 10 seconds
const SUBSCRIPTION_TIMEOUT = 5000; // 5 seconds
const SESSION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
  const [lastSessionCheck, setLastSessionCheck] = useState(0);
  const [sessionCache, setSessionCache] = useState<any>(null);
  const navigate = useNavigate();

  const cleanupAuthResources = useCallback(() => {
    setIsAuthenticated(false);
    setSubscriptionTier("free");
    setSubscriptionError(null);
    setSessionCache(null);
    setLastSessionCheck(0);
  }, []);

  const checkSubscription = useCallback(async () => {
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
        return;
      }

      setSubscriptionTier(profileResponse.data.subscription_tier);
    } catch (error) {
      console.error("Error in checkSubscription:", error);
      setSubscriptionError(error instanceof Error ? error.message : "An unexpected error occurred");
      setSubscriptionTier("free");
    } finally {
      setIsSubscriptionLoading(false);
    }
  }, []);

  const retrySubscriptionCheck = useCallback(async () => {
    await checkSubscription();
  }, [checkSubscription]);

  // Efficient session check with caching
  const checkSession = useCallback(async () => {
    const now = Date.now();
    if (now - lastSessionCheck < SESSION_CACHE_TTL && sessionCache) {
      return sessionCache;
    }

    try {
      const sessionResponse = await withTimeout(
        supabase.auth.getSession(),
        AUTH_TIMEOUT,
        "Auth session check timed out"
      );
      
      setSessionCache(sessionResponse.data.session);
      setLastSessionCheck(now);
      return sessionResponse.data.session;
    } catch (error) {
      console.error("Session check error:", error);
      return null;
    }
  }, [lastSessionCheck, sessionCache]);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const session = await checkSession();
        
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

    authSubscription = subscription;
    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate, checkSubscription, cleanupAuthResources, checkSession]);

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