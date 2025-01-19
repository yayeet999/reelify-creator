import { Instagram, Users, MousePointerClick, Video } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Yes", value: 60, color: "#9b87f5" },
  { name: "Neutral", value: 25, color: "#7E69AB" },
  { name: "No", value: 15, color: "#FFDEE2" },
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Donut Chart */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl border shadow-lg p-6 animate-fade-up">
          <h3 className="text-lg font-semibold mb-4">
            Audience Engagement with User-Generated Content
          </h3>
          <div className="h-[300px]">
            <ChartContainer
              className="w-full h-full"
              config={{
                yes: { color: "#9b87f5" },
                neutral: { color: "#7E69AB" },
                no: { color: "#FFDEE2" },
              }}
            >
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          className="bg-white/80 backdrop-blur-sm"
                          content={
                            <div className="flex flex-col">
                              <span className="font-semibold">{payload[0].name}</span>
                              <span>{payload[0].value}%</span>
                            </div>
                          }
                        />
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
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