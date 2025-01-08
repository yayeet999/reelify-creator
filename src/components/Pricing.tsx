import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "$19",
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
                  "mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                  tier.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border border-primary/30 bg-white text-primary hover:bg-primary/5"
                )}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};