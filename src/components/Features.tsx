import { Sparkles, Video, Zap, Target } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Effects",
    description: "Create stunning content with cutting-edge AI effects.",
  },
  {
    icon: Video,
    title: "Pro Video Suite",
    description: "Edit and enhance your videos with powerful AI tools.",
  },
  {
    icon: Zap,
    title: "Quick Generation",
    description: "Create viral-ready content in seconds.",
  },
  {
    icon: Target,
    title: "Engagement Hooks",
    description: "Grab attention and keep viewers watching.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Create
          <span className="text-primary"> Viral Content</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow animate-fade-up"
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};