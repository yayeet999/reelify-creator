import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import type { Profile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/hooks/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setIsAuthenticated(!!session);
          
          if (session) {
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
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again",
          variant: "destructive",
        });
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (mounted) {
            setUserProfile(profile);
          }
        }
      }
    });

    checkAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
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

    const correctPath = tierPaths[userProfile.subscription_tier];
    
    if (currentPath === '/dashboard' && userProfile.subscription_tier !== 'starter') {
      return <Navigate to={correctPath} replace />;
    }

    if (currentPath.includes('/dashboard') && !currentPath.includes(userProfile.subscription_tier)) {
      return <Navigate to={correctPath} replace />;
    }
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};