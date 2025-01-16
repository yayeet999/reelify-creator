import { useNavigate } from "react-router-dom";
import { Code, FileCode, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionGuard } from "@/hooks/use-subscription-guard";

const ProCreateHooks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hookText, setHookText] = useState("");
  const [productName, setProductName] = useState("");
  const { isLoading } = useSubscriptionGuard("pro");

  const handleSaveHook = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save hooks",
          variant: "destructive",
        });
        return;
      }

      if (!hookText.trim() || !productName.trim()) {
        toast({
          title: "Required fields missing",
          description: "Please enter both hook code and product name",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('saved_hooks')
        .insert([
          {
            user_id: session.user.id,
            hook_text: hookText,
            product_name: productName,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hook saved successfully",
      });

      navigate("/pro/saved-hooks");
    } catch (error) {
      console.error("Error saving hook:", error);
      toast({
        title: "Error",
        description: "Failed to save hook. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                Create Pro Custom Hook
              </h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              Generate and save professional-grade React hooks with advanced features
            </p>
          </div>
        </div>

        {/* Hook Creation Form */}
        <div className="grid gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label htmlFor="hookCode" className="block text-sm font-medium text-gray-700 mb-1">
                Hook Code
              </label>
              <Textarea
                id="hookCode"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Enter your custom hook code here..."
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleSaveHook}
                className="flex items-center gap-2"
              >
                <FileCode className="h-4 w-4" />
                Save Hook
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/pro/hooks")}
                className="flex items-center gap-2"
              >
                <GitBranch className="h-4 w-4" />
                Back to Hooks
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProCreateHooks;