import { useState, useEffect, useCallback } from 'react';
import { SongService, Song } from '@/lib/services/song-service';
import { toast } from 'sonner';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SongService.getAllSongs();
      setSongs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch songs');
      toast.error('Failed to load songs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const createSong = async (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newSong = await SongService.createSong(song);
      setSongs((prev) => [...prev, newSong]);
      toast.success('Song created successfully');
      return newSong;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create song');
      toast.error('Failed to create song');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSong = async (id: number, song: Partial<Song>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSong = await SongService.updateSong(id, song);
      setSongs((prev) =>
        prev.map((s) => (s.id === id ? updatedSong : s))
      );
      toast.success('Song updated successfully');
      return updatedSong;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update song');
      toast.error('Failed to update song');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await SongService.deleteSong(id);
      setSongs((prev) => prev.filter((s) => s.id !== id));
      toast.success('Song deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete song');
      toast.error('Failed to delete song');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchSongs = async (query: string, type: 'title' | 'album' = 'title') => {
    setLoading(true);
    setError(null);
    try {
      let results: Song[];
      if (type === 'title') {
        results = await SongService.searchSongsByTitle(query);
      } else {
        results = await SongService.searchSongsByAlbum(query);
      }
      return results;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search songs');
      toast.error('Failed to search songs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSongsByArtist = async (artist: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await SongService.getSongsByArtist(artist);
      return results;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch songs by artist');
      toast.error('Failed to fetch songs by artist');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSongsByGenre = async (genre: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await SongService.getSongsByGenre(genre);
      return results;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch songs by genre');
      toast.error('Failed to fetch songs by genre');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    songs,
    loading,
    error,
    fetchSongs,
    createSong,
    updateSong,
    deleteSong,
    searchSongs,
    getSongsByArtist,
    getSongsByGenre,
  };
}