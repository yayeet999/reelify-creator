import { Video, Code, HardDrive, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, description, icon: Icon, trend }: MetricCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-baseline">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <span
            className={cn(
              "ml-2 text-xs",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export function MetricsOverview() {
  // Placeholder metrics - to be replaced with real data
  const metrics = [
    {
      title: "Total Videos",
      value: 12,
      description: "Videos created this month",
      icon: Video,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Hooks Generated",
      value: 24,
      description: "Custom hooks created",
      icon: Code,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Storage Used",
      value: "2.4 GB",
      description: "Of 10 GB total storage",
      icon: HardDrive
    },
    {
      title: "Last Active",
      value: "2 hours ago",
      description: "Last content creation",
      icon: Clock
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
} 