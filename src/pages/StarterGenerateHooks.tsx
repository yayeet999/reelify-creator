import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StarterGenerateHooks = () => {
  const [inputText, setInputText] = useState("");
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateHooks = async () => {
    if (inputText.length < 50) {
      toast({
        title: "Description too short",
        description: "Please enter at least 50 characters for the product description.",
        variant: "destructive",
      });
      return;
    }

    if (!productName) {
      toast({
        title: "Product name required",
        description: "Please enter a product name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-hooks', {
        body: {
          productName,
          productDescription: inputText,
        },
      });

      if (error) throw error;

      setGeneratedHooks(data.hooks);
      toast({
        title: "Hooks generated successfully!",
        description: "Your hooks are ready to use.",
      });
    } catch (error) {
      console.error('Error generating hooks:', error);
      toast({
        title: "Error generating hooks",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveHook = async (hookText: string) => {
    try {
      const { error } = await supabase
        .from('saved_hooks')
        .insert([
          { 
            hook_text: hookText,
            product_name: productName 
          }
        ]);

      if (error) throw error;

      toast({
        title: "Hook saved!",
        description: "You can find it in your Saved Hooks tab.",
      });
    } catch (error) {
      console.error('Error saving hook:', error);
      toast({
        title: "Error saving hook",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl mb-6">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Generate Hooks
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Create engaging hooks for your short-form videos
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Input Section */}
            <div className="space-y-6">
              {/* Product Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What's your product?
                </label>
                <Input
                  placeholder="Enter your product name..."
                  value={productName}
                  onChange={(e) => {
                    if (e.target.value.length <= 25) {
                      setProductName(e.target.value);
                    }
                  }}
                  maxLength={25}
                />
                <p className="text-xs text-muted-foreground">
                  {productName.length}/25 characters
                </p>
              </div>

              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Product Description:
                </label>
                <Textarea
                  placeholder="Describe your product, service, or topic..."
                  className="min-h-[150px] resize-none"
                  value={inputText}
                  onChange={(e) => {
                    if (e.target.value.length <= 150) {
                      setInputText(e.target.value);
                    }
                  }}
                  maxLength={150}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {inputText.length}/150 characters (minimum 50)
                </p>
              </div>

              {/* Generate Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerateHooks}
                disabled={isLoading || inputText.length < 50 || !productName}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Hooks"
                )}
              </Button>
            </div>

            {/* Right Column - Output Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <div className="p-4 space-y-4">
                  {generatedHooks.length > 0 ? (
                    generatedHooks.map((hook, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 relative group"
                      >
                        <p className="text-sm pr-10">{hook}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleSaveHook(hook)}
                        >
                          <Save className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Your generated hooks will appear here...
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarterGenerateHooks;