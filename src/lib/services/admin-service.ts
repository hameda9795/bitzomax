import axios from 'axios';
import { API_BASE_URL } from './constants';
import { Song } from './home-service';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionType: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

class AdminService {
  // Authentication token for admin operations
  private token: string | null = null;

  /**
   * Set the authentication token for admin requests
   */
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  /**
   * Get the authentication token
   */
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  /**
   * Clear the authentication token (logout)
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  /**
   * Get authorization headers for API requests
   */
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.getToken()}`
    };
  }

  /**
   * Admin login
   */
  async login(username: string, password: string): Promise<{ token: string; username: string }> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    const { token, username: userName } = response.data;
    this.setToken(token);
    return { token, username: userName };
  }

  /**
   * Get all users for admin management
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  /**
   * Get all songs for admin management
   */
  async getAllSongs(): Promise<Song[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/songs`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      return [];
    }
  }

  /**
   * Add a new song (admin function)
   */
  async addSong(song: Partial<Song>): Promise<Song> {
    const response = await axios.post(`${API_BASE_URL}/admin/songs`, song, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  /**
   * Update an existing song (admin function)
   */
  async updateSong(id: number, song: Partial<Song>): Promise<Song> {
    const response = await axios.put(`${API_BASE_URL}/admin/songs/${id}`, song, {
      headers: this.getHeaders()
    });
    return response.data;
  }

  /**
   * Delete a song (admin function)
   */
  async deleteSong(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/admin/songs/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Upload a song file
   */
  async uploadSongFile(file: File): Promise<{ fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/admin/files/upload/song`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  /**
   * Upload a cover art image
   */
  async uploadCoverArt(file: File): Promise<{ fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/admin/files/upload/cover`, formData, {
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  /**
   * Check if user is authenticated as admin
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AdminService();