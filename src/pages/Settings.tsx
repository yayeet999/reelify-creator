import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User, Bell, Shield } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";

const settingsOptions = [
  {
    title: "Profile Settings",
    description: "Update your personal information and preferences",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
  {
    title: "Notification Settings",
    description: "Configure your notification preferences",
    icon: <Bell className="w-5 h-5" />,
    path: "/notifications",
  },
  {
    title: "Security Settings",
    description: "Manage your security and privacy settings",
    icon: <Shield className="w-5 h-5" />,
    path: "/security",
  },
];

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                Settings
              </h1>
            </div>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingsOptions.map((option) => (
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

export default Settings;