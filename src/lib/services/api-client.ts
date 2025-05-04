import axios from 'axios';
import { AuthService } from './auth-service';

// Base URL for API requests
const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  config => {
    // Get the token from auth service
    const token = AuthService.getToken();
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Add a timestamp to prevent caching issues with admin endpoints
      if (config.url?.startsWith('/admin')) {
        const timestamp = new Date().getTime();
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}_t=${timestamp}`;
      }
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors (token expired, etc)
    if (error.response && error.response.status === 401) {
      console.log('Authentication failed - redirecting to login');
      // Clear auth state and redirect to login
      AuthService.logout();
      window.location.href = '/admin/login';
      return Promise.reject(new Error('Authentication failed. Please log in again.'));
    }
    
    // Handle 403 Forbidden errors (insufficient permissions)
    if (error.response && error.response.status === 403) {
      console.log('Authorization failed - insufficient permissions');
      
      // Show a more helpful message in the console
      console.error('Access denied: You do not have the required permissions for this action.', {
        url: error.config.url,
        method: error.config.method,
      });
      
      // If this is an admin endpoint but not the login endpoint
      if (error.config.url?.startsWith('/admin') && !error.config.url.includes('/auth/login')) {
        // This might be an issue with token validity or role permissions
        AuthService.logout();
        window.location.href = '/admin/login?error=insufficient_permissions';
        return Promise.reject(new Error('You do not have sufficient permissions for this action. Please log in again with an admin account.'));
      }
    }
    
    // Pass the error along to be handled by the calling function
    return Promise.reject(error);
  }
);

export default apiClient;