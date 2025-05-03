'use client';

import { 
  Home, 
  Library, 
  Tag, 
  User, 
  CreditCard, 
  Info, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMobile();
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Bibliotheek', href: '/bibliotheek', icon: Library },
    { name: 'Genres', href: '/genres', icon: Tag },
    { name: 'Account', href: '/account', icon: User },
    { name: 'Abonnement', href: '/abonnement', icon: CreditCard },
    { name: 'Over', href: '/over', icon: Info },
    { name: 'Admin Panel', href: '/admin', icon: ShieldCheck },
  ];

  // If on mobile, don't render sidebar
  if (isMobile) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'fixed top-16 left-0 bottom-0 z-40 bg-background border-r flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                    isActive 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center p-2"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span className="ml-2">Inklappen</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;