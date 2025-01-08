import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const tiers = [
  {
    name: "Starter",
    price: "$19",
    priceId: "price_1Qf3YWF2YoGQdvcW69wTFx7i",
    description: "Perfect for content creators just getting started",
    features: [
      "5 videos per month",
      "Basic AI effects",
      "720p video quality",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    priceId: "price_1Qf3aLF2YoGQdvcWiKMuplKL",
    description: "Ideal for growing creators and small businesses",
    features: [
      "25 videos per month",
      "Advanced AI effects",
      "1080p video quality",
      "Priority support",
      "Custom branding",
      "Analytics dashboard",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$95",
    priceId: "price_1Qf3bQF2YoGQdvcWx23MIde4",
    description: "For professional creators and large teams",
    features: [
      "Unlimited videos",
      "Premium AI effects",
      "4K video quality",
      "24/7 priority support",
      "Custom branding",
      "Advanced analytics",
      "API access",
      "Dedicated account manager",
    ],
  },
];

export const Pricing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tierName: string) => {
    setIsLoading(tierName);
    
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || "Failed to process subscription");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Perfect Plan</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the plan that best fits your needs. All plans include our core
            features with different usage limits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-lg animate-fade-up",
                tier.popular && "border-primary ring-2 ring-primary ring-opacity-50"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-primary py-1 text-center text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">{tier.description}</p>
              </div>

              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors relative",
                  tier.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border border-primary/30 bg-white text-primary hover:bg-primary/5",
                  isLoading === tier.name && "opacity-70 cursor-not-allowed"
                )}
                onClick={() => tier.priceId && handleSubscribe(tier.priceId, tier.name)}
                disabled={isLoading === tier.name || !tier.priceId}
              >
                {isLoading === tier.name ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};