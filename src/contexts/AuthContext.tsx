import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profiles";
import { useToast } from "@/hooks/use-toast";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface AuthContextType {
  isAuthenticated: boolean | null;
  userProfile: Profile | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to fetch profile with retry mechanism
  const fetchProfile = async (userId: string, retryCount = 3): Promise<Profile | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchProfile(userId, retryCount - 1);
      }
      throw error;
    }
  };

  // Set up real-time profile subscription
  const subscribeToProfile = (userId: string): RealtimeChannel => {
    return supabase
      .channel(`profile:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        async (payload) => {
          const newProfile = payload.new as Profile;
          setUserProfile(newProfile);
        }
      )
      .subscribe();
  };

  useEffect(() => {
    let mounted = true;
    let profileSubscription: RealtimeChannel | null = null;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (mounted) {
          const isAuthed = !!session;
          setIsAuthenticated(isAuthed);

          if (isAuthed && session) {
            try {
              const profile = await fetchProfile(session.user.id);
              if (mounted) {
                setUserProfile(profile);
                // Set up real-time subscription for profile changes
                profileSubscription = subscribeToProfile(session.user.id);
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
              if (mounted) {
                toast({
                  title: "Profile Error",
                  description: "Unable to load user profile. Please try signing in again.",
                  variant: "destructive",
                });
                // Force sign out on profile error
                await supabase.auth.signOut();
                setIsAuthenticated(false);
                setUserProfile(null);
                navigate("/auth");
              }
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
          navigate("/auth");
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
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);

        if (isAuthed && session) {
          try {
            const profile = await fetchProfile(session.user.id);
            if (mounted) {
              setUserProfile(profile);
              // Update real-time subscription
              if (profileSubscription) {
                profileSubscription.unsubscribe();
              }
              profileSubscription = subscribeToProfile(session.user.id);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
            if (mounted) {
              toast({
                title: "Profile Error",
                description: "Unable to load user profile",
                variant: "destructive",
              });
              // Force sign out on profile error
              await supabase.auth.signOut();
              setIsAuthenticated(false);
              setUserProfile(null);
              navigate("/auth");
            }
          }
        } else {
          setUserProfile(null);
          if (profileSubscription) {
            profileSubscription.unsubscribe();
            profileSubscription = null;
          }
        }
      }
    );

    // Cleanup function
    return () => {
      mounted = false;
      if (profileSubscription) {
        profileSubscription.unsubscribe();
      }
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}