import { Instagram, Users, MousePointerClick, Video } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const contentTypeData = [
  { name: "User-generated content", value: 54, color: "#0D9488" },
  { name: "Influencer content", value: 31, color: "#14B8A6" },
  { name: "Brand content", value: 15, color: "#5EEAD4" },
  { name: "Stock content", value: 0, color: "#99F6E4" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Content Type Distribution Chart */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border shadow-lg p-6 animate-fade-up">
            <h3 className="text-lg font-semibold mb-4">
              Content Type Distribution
            </h3>
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
                      content={(props) => {
                        if (props.active && props.payload?.length) {
                          const data = props.payload[0].payload;
                          return (
                            <ChartTooltipContent
                              className="bg-white/80 backdrop-blur-sm"
                              formatter={(value) => [`${value}%`, data.name]}
                            />
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              {contentTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Engagement Chart */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border shadow-lg p-6 animate-fade-up">
            <h3 className="text-lg font-semibold mb-4">
              Audience Engagement with UGC
            </h3>
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
                      content={(props) => {
                        if (props.active && props.payload?.length) {
                          const data = props.payload[0].payload;
                          return (
                            <ChartTooltipContent
                              className="bg-white/80 backdrop-blur-sm"
                              formatter={(value) => [`${value}%`, data.name]}
                            />
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
              {audienceEngagementData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white/50 backdrop-blur-sm rounded-xl border shadow-lg p-6 hover:shadow-xl transition-shadow animate-fade-up"
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