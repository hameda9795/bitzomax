import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="songs" asChild>
              <Link href="/admin/songs">Songs</Link>
            </TabsTrigger>
            <TabsTrigger value="users" asChild>
              <Link href="/admin/users">Users</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        {children}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/">Back to Site</Link>
        </Button>
      </div>
    </div>
  );
}