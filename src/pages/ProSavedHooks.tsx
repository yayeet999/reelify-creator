import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionGuard } from "@/hooks/use-subscription-guard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SavedHook {
  id: string;
  hook_text: string;
  product_name: string;
  created_at: string;
}

const ProSavedHooks = () => {
  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isLoading: isGuardLoading } = useSubscriptionGuard("pro");

  useEffect(() => {
    fetchSavedHooks();
  }, []);

  const fetchSavedHooks = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

      const { data, error } = await supabase
        .from("saved_hooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedHooks(data || []);
    } catch (error) {
      console.error("Error fetching saved hooks:", error);
      toast({
        title: "Error",
        description: "Failed to load saved hooks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHook = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_hooks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedHooks((prev) => prev.filter((hook) => hook.id !== id));
      toast({
        title: "Success",
        description: "Hook deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting hook:", error);
      toast({
        title: "Error",
        description: "Failed to delete hook",
        variant: "destructive",
      });
    }
  };

  if (isLoading || isGuardLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Pro Saved Hooks
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your premium saved hooks library
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Hook Text</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedHooks.map((hook) => (
                <TableRow key={hook.id}>
                  <TableCell className="font-medium">{hook.product_name}</TableCell>
                  <TableCell>{hook.hook_text}</TableCell>
                  <TableCell>
                    {new Date(hook.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHook(hook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {savedHooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No saved hooks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProSavedHooks;