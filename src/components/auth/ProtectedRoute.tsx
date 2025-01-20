import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/hooks/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    let authSubscription: { data: { subscription: { unsubscribe: () => void } } };

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (mounted) {
          const isAuthed = !!session;
          setIsAuthenticated(isAuthed);

          if (isAuthed && session) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;
            if (mounted) {
              setUserProfile(profile);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          toast({
            title: "Authentication Error",
            description: "Please try signing in again",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      const isAuthed = !!session;
      setIsAuthenticated(isAuthed);

      if (isAuthed && session) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;
          if (mounted) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          if (mounted) {
            toast({
              title: "Profile Error",
              description: "Unable to load user profile",
              variant: "destructive",
            });
          }
        }
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      if (authSubscription?.data?.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, [toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to appropriate dashboard based on subscription tier
  if (userProfile) {
    const currentPath = window.location.pathname;
    const tierPaths = {
      free: '/free/dashboard',
      starter: '/dashboard',
      pro: '/pro/dashboard',
      enterprise: '/enterprise/dashboard'
    };

    const userTier = userProfile.subscription_tier;
    const correctPath = tierPaths[userTier];
    
    if (Object.values(tierPaths).includes(currentPath) && currentPath !== correctPath) {
      return <Navigate to={correctPath} replace />;
    }

    return <>{children}</>;
  }

  return <>{children}</>;
};