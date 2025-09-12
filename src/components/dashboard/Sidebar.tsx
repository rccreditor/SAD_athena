import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  Settings,
  LayoutDashboard,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Overview & Metrics"
  },
  { 
    title: "Organizations", 
    url: "/organizations", 
    icon: Building2,
    description: "Manage Client Orgs"
  },
  { 
    title: "Users", 
    url: "/users", 
    icon: Users,
    description: "Global User Management"
  },
  { 
    title: "Billing", 
    url: "/billing", 
    icon: CreditCard,
    description: "Subscriptions & Invoices"
  },
  { 
    title: "Support", 
    url: "/support", 
    icon: HeadphonesIcon,
    description: "Tickets & Announcements"
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border flex flex-col w-64",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Athena LMS</h1>
              <p className="text-xs text-sidebar-foreground/60">Super Admin</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0",
                active ? "text-sidebar-primary" : "text-sidebar-foreground/70"
              )} />
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {item.title}
                </div>
                <div className="text-xs text-sidebar-foreground/60 truncate">
                  {item.description}
                </div>
              </div>
              
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full" />
              )}
            </NavLink>
          );
        })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">
              Admin User
            </div>
            <div className="text-xs text-sidebar-foreground/60 truncate">
              System Administrator
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}