"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth-service";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Add this script to immediately hide the sidebar as soon as navigation starts
  useEffect(() => {
    // Function that applies admin styles immediately
    const applyAdminStyles = () => {
      document.body.classList.add('admin-page');
      
      // Get the main layout elements that need to be hidden
      const sidebarElement = document.querySelector('div.fixed.top-16');
      const headerElement = document.querySelector('header.fixed.top-0');
      const mainElement = document.querySelector('main.pt-16.pl-0, main.pt-16.pl-64');
      
      // Hide them immediately
      if (sidebarElement) sidebarElement.setAttribute('style', 'display: none !important');
      if (headerElement) headerElement.setAttribute('style', 'display: none !important');
      if (mainElement) mainElement.setAttribute('style', 'padding-left: 0 !important; padding-top: 0 !important; margin-left: 0 !important');
    };
    
    // Apply styles immediately on initial load
    applyAdminStyles();
    
    // Apply admin styles on every router state change using MutationObserver
    // This is necessary because Next.js App Router doesn't expose router events directly
    const observer = new MutationObserver(() => {
      if (window.location.pathname.startsWith('/admin')) {
        applyAdminStyles();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Check if user is authenticated
    const checkAuth = () => {
      const isLoggedIn = AuthService.isAuthenticated();
      const isLoginPage = pathname === "/admin/login";

      if (!isLoggedIn && !isLoginPage) {
        // Redirect to login if not authenticated and not already on login page
        router.push("/admin/login");
      } else if (isLoggedIn && isLoginPage) {
        // Redirect to admin dashboard if already authenticated and on login page
        router.push("/admin");
      } else {
        // User is either authenticated and not on login page OR
        // not authenticated and on login page - both valid states
        setIsLoading(false);
      }
    };

    checkAuth();
    
    return () => {
      // Clean up by removing the class when component unmounts
      document.body.classList.remove('admin-page');
      observer.disconnect();
    };
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login page should render without admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <style jsx global>{`
        /* Remove padding added by the main layout */
        body.admin-page {
          padding-top: 0 !important;
        }
        
        /* Completely hide the global TopBar component */
        body.admin-page > div > header,
        body.admin-page header[class*="fixed"],
        body.admin-page header.fixed.top-0 {
          display: none !important;
        }
        
        /* Completely hide the global Sidebar component */
        body.admin-page > div > div[class*="fixed"],
        body.admin-page div.fixed.top-16 {
          display: none !important;
        }
        
        /* Reset the main content area padding/margin */
        body.admin-page main[class*="pt-16"],
        body.admin-page main[class*="pl-64"] {
          padding-left: 0 !important;
          padding-top: 0 !important;
          margin-left: 0 !important;
        }
        
        /* Ensure admin layout takes full width and height */
        body.admin-page .admin-root {
          width: 100% !important;
          height: 100vh !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 100 !important;
        }
      `}</style>
      
      <div className="admin-root w-full h-full">
        <header className="border-b bg-background px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-medium">BitZoMax Admin</h1>
            </div>
            <button
              onClick={() => {
                AuthService.logout();
                router.push("/admin/login");
              }}
              className="text-sm hover:underline"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 border-r p-6 bg-background">
            <nav className="space-y-2">
              <a
                href="/admin"
                className={`block px-2 py-1 rounded-md ${
                  pathname === "/admin" ? "bg-muted font-medium" : "hover:bg-muted/50"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/admin');
                }}
              >
                Dashboard
              </a>
              <a
                href="/admin/users"
                className={`block px-2 py-1 rounded-md ${
                  pathname === "/admin/users" ? "bg-muted font-medium" : "hover:bg-muted/50"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/admin/users');
                }}
              >
                Users
              </a>
              <a
                href="/admin/songs"
                className={`block px-2 py-1 rounded-md ${
                  pathname === "/admin/songs" ? "bg-muted font-medium" : "hover:bg-muted/50"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/admin/songs');
                }}
              >
                Songs
              </a>
            </nav>
          </aside>
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}