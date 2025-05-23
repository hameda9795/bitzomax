"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LoginCredentials, AuthService } from "@/lib/services/auth-service";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const searchParams = useSearchParams();

  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam === 'insufficient_permissions') {
      setLoginError('Your account does not have administrator privileges.');
      toast.error('Access denied: Admin permissions required');
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Attempt login
      const userData = await login(data);
      console.log("Login response:", userData);
      
      // Explicitly check if user has admin permissions
      if (!AuthService.isAdmin()) {
        // Log out the user if they don't have admin permissions
        AuthService.logout();
        setLoginError("Your account does not have administrator privileges.");
        toast.error("Access denied: Admin permissions required");
        setIsLoading(false);
        return;
      }

      toast.success("Login successful");
      router.push("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.response?.data?.message || "Invalid username or password");
      toast.error(error.response?.data?.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="admin"
                {...register("username", { required: "Username is required" })}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            You must have admin privileges to access this panel.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}