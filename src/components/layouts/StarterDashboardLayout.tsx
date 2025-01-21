import { SidebarProvider } from "@/components/ui/sidebar";
import { StarterDashboardSidebar } from "@/components/dashboard/StarterDashboardSidebar";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export function StarterDashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <StarterDashboardSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-8 mt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}