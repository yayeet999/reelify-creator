import { useNavigate, useLocation } from "react-router-dom";
import { User, Settings, FilePlus, Code, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Create Content",
    icon: FilePlus,
    path: "/create",
    description: "Create new content",
    isHighlighted: true,
  },
  {
    title: "Home",
    icon: Home,
    path: "/",
    description: "Overview and quick actions",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
    description: "Manage your profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    description: "Configure your preferences",
  },
  {
    title: "Generate Hooks",
    icon: Code,
    path: "/hooks",
    description: "Custom hook generator",
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="w-[90%]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-lg font-semibold text-primary">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="pt-8">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    tooltip={item.description}
                    isActive={location.pathname === item.path}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      item.isHighlighted
                        ? "bg-primary text-white hover:bg-primary/90 justify-center"
                        : "hover:bg-primary/10 hover:text-primary justify-start"
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        item.isHighlighted
                          ? "text-white"
                          : "text-muted-foreground group-hover:text-primary"
                      )} 
                    />
                    <span className="truncate">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}