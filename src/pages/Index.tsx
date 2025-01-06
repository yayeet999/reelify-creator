import { useNavigate } from "react-router-dom";
import { User, Settings, FilePlus, Code } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";

const quickStartOptions = [
  {
    title: "Complete Your Profile",
    description: "Set up your personal information and preferences",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
  {
    title: "Configure Settings",
    description: "Customize your application settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings",
  },
  {
    title: "Create New Content",
    description: "Start creating your first piece of content",
    icon: <FilePlus className="w-5 h-5" />,
    path: "/create",
  },
  {
    title: "Generate Custom Hooks",
    description: "Create reusable React hooks for your projects",
    icon: <Code className="w-5 h-5" />,
    path: "/hooks",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what you can do
              </p>
            </div>
            <SidebarTrigger />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickStartOptions.map((option) => (
              <QuickStartCard
                key={option.title}
                title={option.title}
                description={option.description}
                icon={option.icon}
                onClick={() => navigate(option.path)}
              />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;