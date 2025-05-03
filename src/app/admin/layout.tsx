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

  useEffect(() => {
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
            >
              Dashboard
            </a>
            <a
              href="/admin/users"
              className={`block px-2 py-1 rounded-md ${
                pathname === "/admin/users" ? "bg-muted font-medium" : "hover:bg-muted/50"
              }`}
            >
              Users
            </a>
            <a
              href="/admin/songs"
              className={`block px-2 py-1 rounded-md ${
                pathname === "/admin/songs" ? "bg-muted font-medium" : "hover:bg-muted/50"
              }`}
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
  );
}