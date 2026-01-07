import { Bell, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="none" variant="sidebar" className="border-r">
          <MainNav />
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
            <div className="flex-1">
               {/* Could add breadcrumbs or a page title here */}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <Wifi className="h-5 w-5" />
                <span>Connected</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-6 md:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
