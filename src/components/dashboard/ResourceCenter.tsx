import { Book, Video, MessageSquare, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  links: Array<{
    title: string;
    href: string;
  }>;
}

const ResourceCard = ({ title, description, icon: Icon, links }: ResourceCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="space-y-2">
        {links.map((link) => (
          <Button
            key={link.title}
            variant="ghost"
            className="w-full justify-start text-primary hover:text-primary/90"
            onClick={() => window.open(link.href, '_blank')}
          >
            {link.title}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export function ResourceCenter() {
  const resources = [
    {
      title: "Documentation",
      description: "Comprehensive guides and API references",
      icon: Book,
      links: [
        { title: "Getting Started Guide", href: "#" },
        { title: "API Documentation", href: "#" },
        { title: "Best Practices", href: "#" }
      ]
    },
    {
      title: "Video Tutorials",
      description: "Learn through step-by-step video guides",
      icon: Video,
      links: [
        { title: "Quick Start Tutorial", href: "#" },
        { title: "Advanced Features", href: "#" },
        { title: "Tips & Tricks", href: "#" }
      ]
    },
    {
      title: "Support",
      description: "Get help when you need it",
      icon: MessageSquare,
      links: [
        { title: "FAQs", href: "#" },
        { title: "Contact Support", href: "#" },
        { title: "Community Forum", href: "#" }
      ]
    },
    {
      title: "Tips & Tricks",
      description: "Optimize your workflow",
      icon: Lightbulb,
      links: [
        { title: "Performance Tips", href: "#" },
        { title: "Content Creation Guide", href: "#" },
        { title: "Optimization Guide", href: "#" }
      ]
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.title} {...resource} />
      ))}
    </div>
  );
} 