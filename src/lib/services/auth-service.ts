// Authentication service for admin panel
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// For login, we use direct axios call since api-client already depends on AuthService
// This prevents circular dependency
const API_URL = 'http://localhost:8080/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  id: number;
  roles?: string[];
  role?: string;
  isAdmin?: boolean;
}

interface JwtPayload {
  sub: string;
  roles?: string[];
  role?: string;
  exp: number;
  iat: number;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  isTokenValid: (): boolean => {
    const token = AuthService.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Check if token is expired
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  },

  isAuthenticated: (): boolean => {
    return AuthService.isTokenValid();
  },
  
  isAdmin: (): boolean => {
    try {
      const token = AuthService.getToken();
      if (!token) return false;
      
      // Try to decode the JWT token to get role information
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.roles && Array.isArray(decoded.roles)) {
          return decoded.roles.some(role => 
            typeof role === 'string' && 
            (role.toLowerCase() === 'admin' || role.toLowerCase() === 'role_admin')
          );
        }
        
        if (decoded.role) {
          const role = decoded.role.toLowerCase();
          return role === 'admin' || role === 'role_admin';
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
      
      // Fall back to user object if token doesn't contain roles
      const user = AuthService.getCurrentUser();
      if (!user) return false;
      
      if (user.isAdmin === true) {
        return true;
      }
      
      if (user.role) {
        const role = user.role.toLowerCase();
        return role === 'admin' || role === 'role_admin' || role === 'administrator';
      }
      
      if (user.roles && Array.isArray(user.roles)) {
        return user.roles.some(role => 
          typeof role === 'string' && 
          (role.toLowerCase() === 'admin' || 
           role.toLowerCase() === 'role_admin' || 
           role.toLowerCase() === 'administrator')
        );
      }
      
      // For development purposes only - remove in production
      console.warn("Using development override for admin access");
      return true;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
};