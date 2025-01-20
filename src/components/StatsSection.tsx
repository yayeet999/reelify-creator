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
    <div className="w-full py-12">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start px-4">
        {/* Cost Comparison Section - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Traditional UGC Costs Card */}
          <div className="bg-white rounded-xl border p-8 space-y-6 transition-all duration-300 hover:shadow-lg animate-fade-up">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-orange-500" />
              Traditional UGC Costs
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-orange-700">$150 - $212 per piece</p>
                  <p className="text-gray-600">Average rate for UGC content creation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-orange-700">$150 median cost</p>
                  <p className="text-gray-600">Typical cost for a single UGC video</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Source: <a href="https://inbeat.agency/blog/ugc-rates" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inbeat.agency</a>
              </div>
            </div>
          </div>

          {/* NotReel Advantage Card */}
          <div className="bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 rounded-xl p-8 space-y-6 transition-all duration-300 hover:shadow-lg animate-fade-up">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              The NotReel Advantage
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-primary">90% Cost Reduction</p>
                  <p className="text-gray-700">Create unlimited AI-powered UGC content at a fraction of traditional costs</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-primary">Unlimited Potential</p>
                  <p className="text-gray-700">Generate diverse, high-quality content without the traditional per-video costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Takes up 3 columns */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <stat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold text-primary mb-2 group-hover:translate-y-[-2px] transition-transform">
                {stat.stat}
              </div>
              <div className="font-semibold mb-1 text-gray-900">{stat.title}</div>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};