"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "group flex flex-col data-[collapsed=true]:items-center",
  {
    variants: {
      variant: {
        default: "bg-sidebar text-sidebar-foreground",
        sidebar: "bg-sidebar text-sidebar-foreground",
        border: "border-r border-border",
        "border-b": "border-b border-border",
        ghost: "bg-transparent",
      },
      size: {
        default: "",
        sm: "h-10",
        lg: "h-12",
        icon: "size-10 items-center justify-center",
      },
      collapsible: {
        none: "",
        sm: "sm:data-[collapsed=true]:w-14",
        md: "md:data-[collapsed=true]:w-14",
        lg: "lg:data-[collapsed=true]:w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type SidebarContextProps = {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps>(
  {} as SidebarContextProps
)

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarVariants>
>(({ className, variant, size, collapsible, ...props }, ref) => {
  const { collapsed } = useSidebar()

  return (
    <div
      ref={ref}
      data-collapsed={collapsed}
      className={cn(sidebarVariants({ variant, size, collapsible }), className)}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border-b p-2 group-data-[collapsed=true]:justify-center",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarHeaderTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-base font-semibold tracking-tight group-data-[collapsed=true]:hidden",
      className
    )}
    {...props}
  />
))
SidebarHeaderTitle.displayName = "SidebarHeaderTitle"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex-1", className)} {...props} />
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mt-auto border-t p-2 group-data-[collapsed=true]:justify-center",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("space-y-1", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn("", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-3 rounded-md text-sm",
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground/70 hover:bg-muted/50 hover:text-sidebar-foreground",
        active: "bg-primary/20 text-primary hover:bg-primary/30",
        ghost: "hover:bg-muted/50",
      },
      size: {
        default: "h-10 px-2.5",
        sm: "h-9 px-2.5",
        lg: "h-12 px-2.5",
        icon: "size-10",
      },
      isActive: {
        true: "bg-primary/20 text-primary hover:bg-primary/30",
        false:
          "text-sidebar-foreground/70 hover:bg-muted/50 hover:text-sidebar-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
    asChild?: boolean
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ className, variant, size, isActive, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        sidebarMenuButtonVariants({ variant, size, isActive }),
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("p-2 group-data-[collapsed=true]:hidden", className)} {...props} />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebar()
  return (
    <button
      ref={ref}
      className={cn(
        "group-data-[collapsed=true]:justify-center",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    />
  )
})
SidebarToggle.displayName = "SidebarToggle"

export {
  sidebarVariants,
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarToggle,
}
