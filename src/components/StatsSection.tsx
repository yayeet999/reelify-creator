import { Instagram, Users, MousePointerClick, Video } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const contentTypeData = [
  { name: "UGC", value: 54, color: "#0D9488" },
  { name: "Influencer", value: 31, color: "#14B8A6" },
  { name: "Brand", value: 15, color: "#5EEAD4" },
];

const audienceEngagementData = [
  { name: "Yes", value: 60, color: "#4FD1C5" },
  { name: "Neutral", value: 25, color: "#4A5568" },
  { name: "No", value: 15, color: "#FC8181" },
];

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Charts Section */}
        <div className="space-y-12">
          {/* Content Type Distribution Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-[300px]">
              <ChartContainer
                className="w-full h-full"
                config={{
                  ugc: { color: "#0D9488" },
                  influencer: { color: "#14B8A6" },
                  brand: { color: "#5EEAD4" },
                  stock: { color: "#99F6E4" },
                }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={contentTypeData}
                      innerRadius={0}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Type Distribution</h3>
              <div className="grid gap-3">
                {contentTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audience Engagement Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-[300px]">
              <ChartContainer
                className="w-full h-full"
                config={{
                  yes: { color: "#4FD1C5" },
                  neutral: { color: "#4A5568" },
                  no: { color: "#FC8181" },
                }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={audienceEngagementData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {audienceEngagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Do Users prefer UGC over brand content?</h3>
              <div className="grid gap-3">
                {audienceEngagementData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
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