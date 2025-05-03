import { useState, useEffect, useCallback } from 'react';
import { UserService, User } from '@/lib/services/user-service';
import { toast } from 'sonner';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await UserService.createUser(user);
      setUsers((prev) => [...prev, newUser]);
      toast.success('User created successfully');
      return newUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
      toast.error('Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, user: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await UserService.updateUser(id, user);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? updatedUser : u))
      );
      toast.success('User updated successfully');
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
      toast.error('Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success('User deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
      toast.error('Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (id: number, active: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await UserService.updateUserStatus(id, active);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? updatedUser : u))
      );
      toast.success(`User status updated to ${active ? 'active' : 'inactive'}`);
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user status');
      toast.error('Failed to update user status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
  };
}