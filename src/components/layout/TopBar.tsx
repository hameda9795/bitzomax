'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, Bell, Menu, Music, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import { useSubscription } from '@/lib/subscription-context';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  className?: string;
}

const TopBar = ({ className }: TopBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMobile();
  const { plan, isSubscribed } = useSubscription();
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Handle search functionality
  };

  const handleNavigateToAbonnement = () => {
    router.push('/abonnement');
  };
  
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 h-16 border-b bg-background z-50',
      className
    )}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="text-xl font-bold flex items-center gap-1">
            <Music className="h-5 w-5" />
            BitZoMax
          </Link>
        </div>
        
        {/* Search Bar */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex items-center max-w-md flex-1 mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoek naar muziek..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        {/* Subscription Status */}
        <div className="hidden md:flex items-center mr-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNavigateToAbonnement}
            className={cn(
              "gap-1.5 border-dashed",
              isSubscribed ? "text-yellow-600 border-yellow-300 hover:text-yellow-700" : ""
            )}
          >
            {isSubscribed ? (
              <>
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>Premium</span>
              </>
            ) : (
              <>
                <Crown className="h-4 w-4" />
                <span>Upgrade</span>
              </>
            )}
          </Button>
        </div>
        
        {/* User Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          {isMobile && (
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 ml-2 relative">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Gebruiker</span>
                {isSubscribed && (
                  <Badge className="absolute -top-2 -right-2 h-4 px-1 text-[10px] bg-yellow-500">
                    PRO
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span className="font-medium">Gebruiker</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">Profiel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/abonnement" className="flex justify-between items-center w-full">
                  <span>Abonnement</span>
                  <Badge 
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isSubscribed ? "bg-yellow-500" : "bg-muted"
                    )}
                  >
                    {isSubscribed ? "Premium" : "Gratis"}
                  </Badge>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account">Instellingen</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                Uitloggen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;