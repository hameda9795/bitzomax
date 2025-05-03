// User service for admin panel
import apiClient from './api-client';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  subscriptionType: string;
  active: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await apiClient.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> => {
    try {
      const response = await apiClient.post('/admin/users', user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  },

  updateUserStatus: async (id: number, active: boolean): Promise<User> => {
    try {
      const response = await apiClient.patch(`/admin/users/${id}/status`, { active });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for user with id ${id}:`, error);
      throw error;
    }
  },

  getUsersBySubscription: async (type: string): Promise<User[]> => {
    try {
      const response = await apiClient.get(`/admin/users/subscription/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with subscription ${type}:`, error);
      throw error;
    }
  },

  getActiveUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get(`/admin/users/status/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  },

  getInactiveUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get(`/admin/users/status/inactive`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inactive users:', error);
      throw error;
    }
  }
};