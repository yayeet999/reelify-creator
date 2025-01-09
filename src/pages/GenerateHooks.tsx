import { useNavigate } from "react-router-dom";
import { Code, FileCode, GitBranch, Package } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";

const hookOptions = [
  {
    title: "Create Custom Hook",
    description: "Generate a new custom React hook",
    icon: <Code className="w-5 h-5" />,
    path: "/hooks/create",
  },
  {
    title: "Hook Templates",
    description: "Choose from pre-built hook templates",
    icon: <FileCode className="w-5 h-5" />,
    path: "/hooks/templates",
  },
  {
    title: "Hook Library",
    description: "Browse and manage your hook collection",
    icon: <Package className="w-5 h-5" />,
    path: "/hooks/library",
  },
];

const GenerateHooks = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                Generate Hooks
              </h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              Create and manage custom React hooks for your project
            </p>
          </div>
        </div>

        {/* Hook Options Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hookOptions.map((option) => (
            <QuickStartCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => navigate(option.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateHooks;