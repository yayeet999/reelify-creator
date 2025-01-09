import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StarterSavedHooks = () => {
  const [savedHooks, setSavedHooks] = useState<{ id: string; hook_text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedHooks();
  }, []);

  const fetchSavedHooks = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_hooks')
        .select('id, hook_text')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedHooks(data || []);
    } catch (error) {
      console.error('Error fetching saved hooks:', error);
      toast({
        title: "Error fetching saved hooks",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_hooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedHooks(prevHooks => prevHooks.filter(hook => hook.id !== id));
      toast({
        title: "Hook deleted",
        description: "The hook has been removed from your saved hooks.",
      });
    } catch (error) {
      console.error('Error deleting hook:', error);
      toast({
        title: "Error deleting hook",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Saved Hooks
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              View and manage your saved hooks
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <ScrollArea className="h-[500px] w-full rounded-md">
            <div className="p-4 space-y-4">
              {savedHooks.length > 0 ? (
                savedHooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="p-4 bg-accent/10 rounded-lg relative group"
                  >
                    <p className="text-sm pr-10">{hook.hook_text}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteHook(hook.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No saved hooks yet. Generate some hooks and save them to see them here!
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default StarterSavedHooks;