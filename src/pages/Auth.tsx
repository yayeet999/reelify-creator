import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { AuthError } from "@supabase/supabase-js";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const AuthContent = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
      if (event === "USER_UPDATED") {
        const checkSession = async () => {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        };
        checkSession();
      }
      if (event === "SIGNED_OUT") {
        setErrorMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again.";
      case "Email not confirmed":
        return "Please verify your email address before signing in.";
      case "User not found":
        return "No user found with these credentials.";
      default:
        return error.message;
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const siteUrl = "https://www.notreel.ai";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-8 px-4">
        <Button 
          variant="ghost" 
          onClick={handleBackToHome}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div className="text-center">
            <img
              src="/logonotreel.png"
              alt="NotReel Logo"
              className="mx-auto h-12 w-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to notreel.ai
            </h2>
            <p className="text-gray-600">
              Sign in to your account or create a new one
            </p>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              style: {
                button: {
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                input: {
                  padding: '10px 16px',
                  fontSize: '14px',
                },
                label: {
                  fontSize: '14px',
                  marginBottom: '4px',
                },
                message: {
                  padding: '8px',
                  marginBottom: '12px',
                  fontSize: '14px',
                },
              },
            }}
            providers={[]}
            redirectTo={`${siteUrl}/dashboard`}
          />
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  return (
    <ErrorBoundary>
      <AuthContent />
    </ErrorBoundary>
  );
};

export default Auth;