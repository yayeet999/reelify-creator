import { useNavigate, useLocation } from "react-router-dom";
import { FilePlus, Home, ChevronLeft, Code, Bookmark, Video, Film } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path: string;
  description: string;
  isHighlighted?: boolean;
}

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();
  const { subscriptionTier } = useAuth();
  const isMobile = useIsMobile();

  const getMenuItems = () => {
    const baseItems: MenuItem[] = [
      {
        title: "Create Content",
        icon: FilePlus,
        path: "/dashboard/create",
        description: "Create new content",
        isHighlighted: true,
      },
      {
        title: "Home",
        icon: Home,
        path: "/dashboard",
        description: "Overview and quick actions",
      },
    ];

    const starterItems: MenuItem[] = [
      {
        title: "Generate Hooks",
        icon: Code,
        path: "/dashboard/hooks",
        description: "Generate custom React hooks",
      },
      {
        title: "Saved Hooks",
        icon: Bookmark,
        path: "/dashboard/saved-hooks",
        description: "View your saved hooks",
      },
      {
        title: "Green Screenify",
        icon: Video,
        path: "/dashboard/green-screenify",
        description: "Create videos with custom backgrounds",
      },
      {
        title: "Video Editor",
        icon: Film,
        path: "/dashboard/video-editor",
        description: "Edit and customize videos",
      },
    ];

    if (subscriptionTier === "free") {
      return baseItems;
    }

    return [...baseItems, ...starterItems];
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-lg font-semibold text-primary">
            Dashboard
            {subscriptionTier !== "free" && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({subscriptionTier})
              </span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5 pt-10">
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    tooltip={item.description}
                    isActive={isActiveRoute(item.path)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-all duration-200",
                      item.isHighlighted
                        ? cn(
                            "bg-primary text-white hover:bg-primary/90",
                            state === "expanded" ? "justify-start" : "justify-center",
                            isMobile ? "w-full" : "w-auto"
                          )
                        : isActiveRoute(item.path)
                        ? "bg-primary/10 text-primary justify-start"
                        : "hover:bg-primary/10 hover:text-primary justify-start",
                      state === "collapsed" && !item.isHighlighted && "justify-center"
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        item.isHighlighted
                          ? "text-white"
                          : isActiveRoute(item.path)
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      )} 
                    />
                    <span 
                      className={cn(
                        "truncate",
                        state === "collapsed" && "hidden",
                        item.isHighlighted && "font-semibold"
                      )}
                    >
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-5 top-24 z-50 flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-md transition-all",
          "hover:bg-primary hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          state === "collapsed" && "rotate-180 bg-primary text-white hover:bg-primary/90"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <SidebarRail />
    </Sidebar>
  );
}