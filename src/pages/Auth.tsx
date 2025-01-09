import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handlePostAuthFlow(session);
      }
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          await handlePostAuthFlow(session);
        } catch (error) {
          console.error('Auth error:', error);
          setErrorMessage(getErrorMessage(error));
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePostAuthFlow = async (session) => {
    const storedPriceId = localStorage.getItem('selectedPriceId');
    
    if (storedPriceId) {
      try {
        console.log('Creating checkout session with priceId:', storedPriceId);
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { priceId: storedPriceId }
        });

        if (error) {
          console.error('Checkout error:', error);
          throw error;
        }
        
        if (data?.url) {
          console.log('Redirecting to checkout URL:', data.url);
          localStorage.removeItem('selectedPriceId');
          window.location.href = data.url;
          return;
        } else {
          console.error('No checkout URL received');
          throw new Error('Failed to create checkout session');
        }
      } catch (error) {
        console.error('Error creating checkout:', error);
        toast.error(error.message || "Failed to process subscription");
        localStorage.removeItem('selectedPriceId');
        // On error, redirect to pricing page
        navigate("/pricing");
        return;
      }
    }

    // If no stored priceId or checkout failed, get user's subscription tier
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', session.user.id)
      .single();

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
  };

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'Email not confirmed':
        return 'Please verify your email address before signing in.';
      default:
        return error.message;
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