import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";

const LOADING_TIMEOUT = 10000; // 10 seconds timeout

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          setIsLoading(true);
          await handlePostAuthFlow(session);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setErrorMessage(getErrorMessage(error));
      }
    };
    
    checkSession();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        // Set timeout for loading state
        timeoutId = setTimeout(() => {
          setIsLoading(false);
          setErrorMessage("Login attempt timed out. Please try again.");
          toast.error("Login attempt timed out. Please try again.");
        }, LOADING_TIMEOUT);

        try {
          await handlePostAuthFlow(session);
        } catch (error) {
          console.error('Auth error:', error);
          setErrorMessage(getErrorMessage(error));
          toast.error(getErrorMessage(error));
        } finally {
          clearTimeout(timeoutId);
          setIsLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handlePostAuthFlow = async (session) => {
    try {
      const storedPaymentUrl = localStorage.getItem('selectedPaymentUrl');
      
      if (storedPaymentUrl) {
        localStorage.removeItem('selectedPaymentUrl');
        window.location.href = storedPaymentUrl;
        return;
      }

      // Get user's subscription tier with error handling
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to fetch user profile');
      }

      // Navigate based on subscription tier
      switch (profile?.subscription_tier) {
        case 'starter':
          navigate("/dashboard");
          break;
        case 'pro':
          navigate("/pro/dashboard");
          break;
        case 'enterprise':
          navigate("/enterprise/dashboard");
          break;
        default:
          navigate("/free/dashboard");
      }
    } catch (error) {
      console.error('Post-auth flow error:', error);
      throw error; // Re-throw to be handled by the caller
    }
  };

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please verify your email address before signing in.';
      case 'Failed to fetch user profile':
        return 'Unable to load your profile. Please try again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to notreel.ai
          </h2>
        </div>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <SupabaseAuth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;