import axios from 'axios';
import { API_BASE_URL } from './constants';

// Types for the API responses
export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  releaseDate?: string;
  filePath?: string;
  coverArtUrl?: string;
  durationSeconds?: number;
}

export interface FeaturedContent {
  featuredSongs: Song[];
  genreHighlights: Record<string, Song[]>;
}

class HomeService {
  /**
   * Get featured content for the homepage
   */
  async getFeaturedContent(): Promise<FeaturedContent> {
    try {
      const response = await axios.get(`${API_BASE_URL}/home/featured`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured content:', error);
      // Return empty data if API fails
      return {
        featuredSongs: [],
        genreHighlights: {}
      };
    }
  }

  /**
   * Get all available genres
   */
  async getAllGenres(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/home/genres`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      return [];
    }
  }

  /**
   * Get songs by a specific genre
   */
  async getSongsByGenre(genre: string): Promise<Song[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/home/genres/${encodeURIComponent(genre)}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch songs for genre ${genre}:`, error);
      return [];
    }
  }

  /**
   * Search for songs by query
   */
  async searchSongs(query: string): Promise<Song[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/home/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search songs:', error);
      return [];
    }
  }
}

export default new HomeService();