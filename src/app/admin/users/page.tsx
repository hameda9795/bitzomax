"use client";

import { UsersTable } from "@/components/admin/UsersTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          View and manage all users on the BitZoMax platform.
        </p>
      </div>
      
      <UsersTable />
    </div>
  );
}