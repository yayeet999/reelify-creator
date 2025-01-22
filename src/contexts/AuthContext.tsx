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
          description: "Failed to check subscription status. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      setSubscriptionTier(profile.subscription_tier);
    } catch (error) {
      console.error("Error in checkSubscription:", error);
      setSubscriptionError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        checkSubscription();
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (event === "SIGNED_IN") {
        await checkSubscription();
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        setSubscriptionTier("free");
        navigate("/auth");
      }
    });

    // Listen for real-time subscription updates
    const channel = supabase
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

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
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