'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquareHeart,
  Settings,
  HeartPulse,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BravaLogo } from './brava-logo';
import { SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
  { href: '/dashboard/consultation', icon: MessageSquareHeart, label: 'Consultation' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <BravaLogo />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="p-4">
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
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4">
        <Button>
          <HeartPulse className="mr-2 h-4 w-4" />
          Trigger a Reading
        </Button>
      </SidebarFooter>
    </>
  );
}
