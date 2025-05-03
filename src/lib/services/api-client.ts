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
      // Clear auth state and redirect to login
      AuthService.logout();
      window.location.href = '/admin/login';
    }
    
    // Pass the error along to be handled by the calling function
    return Promise.reject(error);
  }
);

export default apiClient;