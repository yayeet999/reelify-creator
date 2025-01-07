import { useNavigate, useLocation } from "react-router-dom";
import { Settings, FilePlus, Code, Home } from "lucide-react";
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
    title: "Generate Hooks",
    icon: Code,
    path: "/hooks",
    description: "Custom hook generator",
  },
];

const bottomMenuItems = [
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    description: "Configure your preferences",
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-lg font-semibold text-primary">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col h-full">
            <SidebarMenu className="space-y-1.5 pt-10 flex-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    tooltip={item.description}
                    isActive={location.pathname === item.path}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium",
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
            
            {/* Bottom menu items */}
            <SidebarMenu className="space-y-1.5 mt-auto pb-4">
              {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    tooltip={item.description}
                    isActive={location.pathname === item.path}
                    className="group flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium hover:bg-primary/10 hover:text-primary justify-start"
                  >
                    <item.icon className="h-5 w-5 shrink-0 transition-colors text-muted-foreground group-hover:text-primary" />
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