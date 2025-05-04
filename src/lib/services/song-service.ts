// Song service for admin panel
import apiClient from './api-client';

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  releaseDate: string | null;
  genre: string | null;
  durationSeconds: number | null;
  filePath: string | null;
  coverArtUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const SongService = {
  // Public endpoints - no authentication required
  getAllSongs: async (): Promise<Song[]> => {
    try {
      const response = await apiClient.get('/home/songs');
      return response.data;
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  },

  getSongById: async (id: number): Promise<Song> => {
    try {
      const response = await apiClient.get(`/home/songs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching song with id ${id}:`, error);
      throw error;
    }
  },

  getSongsByArtist: async (artist: string): Promise<Song[]> => {
    try {
      const response = await apiClient.get(`/home/songs/artist/${encodeURIComponent(artist)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching songs by artist ${artist}:`, error);
      throw error;
    }
  },

  getSongsByGenre: async (genre: string): Promise<Song[]> => {
    try {
      const response = await apiClient.get(`/home/genres/${encodeURIComponent(genre)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching songs by genre ${genre}:`, error);
      throw error;
    }
  },

  searchSongsByTitle: async (query: string): Promise<Song[]> => {
    try {
      const response = await apiClient.get(`/home/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching songs by title ${query}:`, error);
      throw error;
    }
  },

  // Admin endpoints - require authentication
  adminGetAllSongs: async (): Promise<Song[]> => {
    try {
      const response = await apiClient.get('/admin/songs');
      return response.data;
    } catch (error) {
      console.error('Error fetching songs from admin endpoint:', error);
      throw error;
    }
  },

  adminCreateSong: async (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>): Promise<Song> => {
    try {
      const response = await apiClient.post('/admin/songs', song);
      return response.data;
    } catch (error) {
      console.error('Error creating song:', error);
      throw error;
    }
  },

  adminUpdateSong: async (id: number, song: Partial<Song>): Promise<Song> => {
    try {
      const response = await apiClient.put(`/admin/songs/${id}`, song);
      return response.data;
    } catch (error) {
      console.error(`Error updating song with id ${id}:`, error);
      throw error;
    }
  },

  adminDeleteSong: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/admin/songs/${id}`);
    } catch (error) {
      console.error(`Error deleting song with id ${id}:`, error);
      throw error;
    }
  },

  adminSearchSongsByAlbum: async (query: string): Promise<Song[]> => {
    try {
      const response = await apiClient.get(`/admin/songs/search/album`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching songs by album ${query}:`, error);
      throw error;
    }
  }
};