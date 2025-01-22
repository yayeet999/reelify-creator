import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickStartCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  overlay?: React.ReactNode;
}

export function QuickStartCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  className,
  overlay 
}: QuickStartCardProps) {
  return (
    <div className="relative">
      <Card 
        className={cn(
          "group hover:shadow-md transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 bg-white/50 backdrop-blur-sm",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-3 group-hover:text-primary transition-colors">
            <span className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
              {icon}
            </span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
      {overlay && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          {overlay}
        </div>
      )}
    </div>
  );
}