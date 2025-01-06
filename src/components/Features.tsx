import { Sparkles, Video, Zap, Target } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Effects",
    description: "Transform your videos with cutting-edge AI effects that make your content stand out.",
  },
  {
    icon: Video,
    title: "Smart Video Editor",
    description: "Edit videos effortlessly with our intuitive AI-assisted editing tools.",
  },
  {
    icon: Zap,
    title: "Quick Generation",
    description: "Generate engaging content in seconds, not hours, with our advanced AI technology.",
  },
  {
    icon: Target,
    title: "Engagement Hooks",
    description: "Create attention-grabbing hooks that keep viewers watching till the end.",
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