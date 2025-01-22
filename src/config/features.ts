import type { SubscriptionTier } from "@/types/subscription";

interface Feature {
  name: string;
  requiredTier: SubscriptionTier;
  description: string;
}

export const FEATURES: Record<string, Feature> = {
  GREEN_SCREENIFY: {
    name: "Green Screenify",
    requiredTier: "starter",
    description: "Create videos with custom backgrounds",
  },
  VIDEO_EDITOR: {
    name: "Video Editor",
    requiredTier: "starter",
    description: "Advanced video editing capabilities",
  },
  HOOKS_GENERATOR: {
    name: "Hooks Generator",
    requiredTier: "starter",
    description: "Generate custom React hooks",
  },
  CONTENT_CREATION: {
    name: "Content Creation",
    requiredTier: "free",
    description: "Basic content creation tools",
  },
} as const;