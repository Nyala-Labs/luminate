"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CurrentUser } from "@/lib/auth/server";
import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import logo from "@/public/nyalalabs.svg";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface DashboardSidebarProps {
  user: CurrentUser;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const initials =
    `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase() ||
    "??";
  const fullName =
    `${user.firstname || ""} ${user.lastname || ""}`.trim() || "User";

  const menuSections: SidebarSection[] = [
    {
      title: "MAIN MENU",
      items: [
        { name: "Dashboard", href: "/dashboard/home", icon: LayoutDashboard },
        { name: "Recognition", href: "/dashboard/recognition", icon: Award },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isCollapsed ? "justify-center w-full" : "",
          )}
        >
          <Image
            src={logo}
            alt="Nyala Labs"
            className="size-10 rounded-full shrink-0"
          />
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground truncate animate-in fade-in slide-in-from-left-4 duration-300">
              Nyala Labs
            </span>
          )}
        </div>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
          >
            <ChevronsLeft className="size-5" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-4 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronsRight className="size-5" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-7">
        <TooltipProvider>
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {!isCollapsed && (
                <h3 className="px-3 text-[11px] font-bold tracking-wider text-sidebar-foreground/50 uppercase">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/dashboard/home" &&
                      pathname === "/dashboard");
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full",
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                            )}
                          >
                            <Icon className="size-5 shrink-0" />
                            {!isCollapsed && (
                              <span className="truncate flex-1 text-left">
                                {item.name}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {item.name}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </TooltipProvider>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <div className="relative size-10 rounded-full bg-sidebar-primary p-0.5 shrink-0">
            <div className="w-full h-full rounded-full bg-sidebar flex items-center justify-center text-xs font-semibold text-sidebar-foreground">
              {initials}
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
              <span className="text-sm font-semibold text-sidebar-foreground truncate">
                {fullName}
              </span>
              <span className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
