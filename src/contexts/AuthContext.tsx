import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier } from "@/types/subscription";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  subscriptionTier: SubscriptionTier;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("free");
  const navigate = useNavigate();

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("users")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setSubscriptionTier(profile.subscription_tier);
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
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
        navigate("/starter-dashboard");
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, subscriptionTier, checkSubscription }}>
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