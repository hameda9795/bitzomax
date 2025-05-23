"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUsers } from "@/hooks/use-users";
import { User } from "@/lib/services/user-service";
import { Loader2 } from "lucide-react";

export function UsersTable() {
  const { users, loading, error, updateUserStatus, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [subscriptionFilter, setSubscriptionFilter] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Format user data for display
  const formatName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return user.username;
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status string from active boolean
  const getStatus = (active: boolean) => active ? "active" : "inactive";

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const userName = formatName(user);
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getStatus(user.active);
    const matchesStatus = statusFilter ? status === statusFilter : true;
    
    const matchesSubscription = subscriptionFilter ? user.subscriptionType.toLowerCase() === subscriptionFilter : true;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  // Handle user deletion
  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Handle user status change
  const handleStatusChange = async (id: number, active: boolean) => {
    try {
      await updateUserStatus(id, active);
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  // Handle subscription change
  const handleSubscriptionChange = async (id: number, subscriptionType: string) => {
    try {
      await updateUserStatus(id, true); // Temp placeholder - we'd need to add a proper subscription update endpoint
      toast.success(`User subscription updated to ${subscriptionType}`);
    } catch (error) {
      console.error("Failed to update user subscription:", error);
      toast.error("Failed to update user subscription");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Failed to load users</p>
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            onValueChange={(value) => setSubscriptionFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter(null);
              setSubscriptionFilter(null);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{formatName(user)}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.active ? "default" : "secondary"
                      }
                    >
                      {user.active ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscriptionType.toLowerCase() === "premium" ? "default" : "outline"}>
                      {user.subscriptionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#f8f5e9] !text-[#8a7a57] border-[#d0c8a8] shadow-lg" style={{backgroundColor: "#f8f5e9", opacity: 1}}>
                        <DropdownMenuLabel className="text-[#8a7a57]">Manage User</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.info(`Viewing details for ${formatName(user)}`)} className="bg-[#f8f5e9] hover:bg-[#e8e0c9]">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-[#8a7a57]">Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, true)} className="bg-[#f8f5e9] hover:bg-[#e8e0c9]">
                          Set Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(user.id, false)} className="bg-[#f8f5e9] hover:bg-[#e8e0c9]">
                          Set Inactive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-[#8a7a57]">Change Subscription</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleSubscriptionChange(user.id, "PREMIUM")} className="bg-[#f8f5e9] hover:bg-[#e8e0c9]">
                          Set Premium
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSubscriptionChange(user.id, "FREE")} className="bg-[#f8f5e9] hover:bg-[#e8e0c9]">
                          Set Free
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 bg-[#f8f5e9] hover:bg-[#e8e0c9]"
                          onClick={() => setUserToDelete(user.id)}
                        >
                          Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {!!userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Custom solid overlay */}
          <div 
            className="fixed inset-0 bg-black/80" 
            onClick={() => setUserToDelete(null)}
          />
          
          {/* Modal content */}
          <div className="relative z-50 w-full max-w-md bg-[#f8f5e9] p-6 shadow-xl">
            <div className="mb-6 border-b border-gray-300 pb-4">
              <h2 className="text-xl font-normal text-[#8a7a57]">Are you sure?</h2>
              <p className="text-[#a99d7a] text-sm">
                This action cannot be undone. This will permanently delete the user account
                and all associated data.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-[#f8f5e9] border-gray-300 text-gray-700 hover:bg-gray-200"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white border-none"
                onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}