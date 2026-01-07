'use client';

import { Bell, Wifi, BatteryFull, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import { BottomNav } from '@/components/bottom-nav';
import { BravaLogo } from '@/components/brava-logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col md:flex-row min-h-[100svh] w-full bg-background">
        <Sidebar collapsible="md" variant="sidebar" className="border-r hidden md:flex">
          <MainNav />
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4">
            <div className="md:hidden">
              <BravaLogo />
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BatteryFull className="h-5 w-5" />
                <span className="text-muted-foreground">92%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <Wifi className="h-5 w-5" />
                <span className="hidden md:inline">Connected</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 bg-background pb-24 md:pb-8">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
