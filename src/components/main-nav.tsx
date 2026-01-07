'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquareHeart,
  Settings,
  HeartPulse,
  Scan,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BravaLogo } from './brava-logo';
import { SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/scan', icon: Scan, label: 'Scan' },
  { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
  { href: '/dashboard/consultation', icon: MessageSquareHeart, label: 'Consult' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function MainNav() {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleNewReading = () => {
    // In a real app, this would trigger the hardware.
    // Here, we just show a toast.
    toast({
      title: "New Reading Initiated",
      description: "Please hold still while the Smart Bra takes a new reading.",
    });
  };


  return (
    <div className="flex flex-col h-full">
      <SidebarHeader className="p-4">
        <BravaLogo />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-4 flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="group-data-[collapsed=true]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4">
        <Button className="w-full" onClick={handleNewReading}>
          <HeartPulse className="mr-2 h-4 w-4" />
          <span className="group-data-[collapsed=true]:hidden">New Reading</span>
        </Button>
      </SidebarFooter>
    </div>
  );
}
