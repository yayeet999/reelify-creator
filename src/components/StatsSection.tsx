import { Instagram, Users, MousePointerClick, Video, DollarSign, Sparkles } from "lucide-react";

const stats = [
  {
    id: 1,
    stat: "70%",
    title: "Higher Engagement",
    description: "Instagram posts featuring UGC have higher engagement vs standard content",
    icon: Instagram,
  },
  {
    id: 2,
    stat: "92%",
    title: "Trust Factor",
    description: "Consumers trust recommendations from other people over branded content",
    icon: Users,
  },
  {
    id: 3,
    stat: "4x",
    title: "Click-Through Rate",
    description: "UGC-based ads receive higher click-through rates",
    icon: MousePointerClick,
  },
  {
    id: 4,
    stat: "63%",
    title: "TikTok Success",
    description: "TikTok videos with key messages in first 3 seconds get higher engagement",
    icon: Video,
  },
];

export const StatsSection = () => {
  return (
    <div className="w-full py-8">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Cost Comparison Section */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Traditional UGC Costs</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold">$150 - $212 per piece</p>
                  <p className="text-gray-600">Average rate for UGC content creation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold">$150 median cost</p>
                  <p className="text-gray-600">Typical cost for a single UGC video</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Source: <a href="https://inbeat.agency/blog/ugc-rates" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inbeat.agency</a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">The NotReel Advantage</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold">90% Cost Reduction</p>
                  <p className="text-gray-700">Create unlimited AI-powered UGC content at a fraction of traditional costs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold">Unlimited Potential</p>
                  <p className="text-gray-700">Generate diverse, high-quality content without the traditional per-video costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow animate-fade-up"
            >
              <stat.icon className="w-8 h-8 text-primary mb-4" />
              <div className="text-3xl font-bold text-primary mb-2">{stat.stat}</div>
              <div className="font-semibold mb-1">{stat.title}</div>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};