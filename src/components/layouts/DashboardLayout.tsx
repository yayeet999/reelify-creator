import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Navbar } from "@/components/Navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 mt-16">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}