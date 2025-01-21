import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  subscriptionTier: string;
  downloadCount: number;
  periodDownloadLimit: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  subscriptionTier: 'free',
  downloadCount: 0,
  periodDownloadLimit: 0,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [downloadCount, setDownloadCount] = useState(0);
  const [periodDownloadLimit, setPeriodDownloadLimit] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from('users')
            .select('subscription_tier, download_count, period_download_limit')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setSubscriptionTier(profile.subscription_tier);
            setDownloadCount(profile.download_count);
            setPeriodDownloadLimit(profile.period_download_limit);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('users')
          .select('subscription_tier, download_count, period_download_limit')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setSubscriptionTier(profile.subscription_tier);
          setDownloadCount(profile.download_count);
          setPeriodDownloadLimit(profile.period_download_limit);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSubscriptionTier('free');
        setDownloadCount(0);
        setPeriodDownloadLimit(0);
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        subscriptionTier,
        downloadCount,
        periodDownloadLimit
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};