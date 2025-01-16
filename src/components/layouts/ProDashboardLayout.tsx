import { SidebarProvider } from "@/components/ui/sidebar";
import { ProDashboardSidebar } from "@/components/dashboard/ProDashboardSidebar";
import { Navbar } from "@/components/Navbar";

export function ProDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <ProDashboardSidebar />
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