import { useState, useEffect, useCallback } from 'react';
import { SongService, Song } from '@/lib/services/song-service';
import { toast } from 'sonner';
import { AuthService } from '@/lib/services/auth-service';

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(AuthService.isAdmin());

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(AuthService.isAdmin());
    };
    
    checkAdminStatus();
    
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_token' || e.key === 'user') {
        checkAdminStatus();
      }
    });
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Song[] = [];
      
      if (isAdmin) {
        try {
          data = await SongService.adminGetAllSongs();
        } catch (adminError: any) {
          console.error('Admin endpoint failed:', adminError);
          
          if (adminError.response && adminError.response.status === 403) {
            console.log('Falling back to public endpoint');
            data = await SongService.getAllSongs();
            setIsAdmin(false);
          } else {
            throw adminError;
          }
        }
      } else {
        data = await SongService.getAllSongs();
      }
      
      setSongs(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch songs';
      setError(errorMessage);
      toast.error('Failed to load songs: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const createSong = async (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    const hasAdminRights = AuthService.isAdmin();
    if (!hasAdminRights) {
      setError('Unauthorized: Admin permissions required');
      toast.error('Unauthorized: Admin permissions required');
      setLoading(false);
      throw new Error('Unauthorized: Admin permissions required');
    }
    
    try {
      const newSong = await SongService.adminCreateSong(song);
      setSongs((prev) => [...prev, newSong]);
      toast.success('Song created successfully');
      return newSong;
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setIsAdmin(false);
        const errorMsg = 'Permission denied: Admin rights required to create songs';
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to create song';
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSong = async (id: number, song: Partial<Song>) => {
    setLoading(true);
    setError(null);
    
    const hasAdminRights = AuthService.isAdmin();
    if (!hasAdminRights) {
      setError('Unauthorized: Admin permissions required');
      toast.error('Unauthorized: Admin permissions required');
      setLoading(false);
      throw new Error('Unauthorized: Admin permissions required');
    }
    
    try {
      const updatedSong = await SongService.adminUpdateSong(id, song);
      setSongs((prev) =>
        prev.map((s) => (s.id === id ? updatedSong : s))
      );
      toast.success('Song updated successfully');
      return updatedSong;
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setIsAdmin(false);
        const errorMsg = 'Permission denied: Admin rights required to update songs';
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to update song';
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id: number) => {
    setLoading(true);
    setError(null);
    
    const hasAdminRights = AuthService.isAdmin();
    if (!hasAdminRights) {
      setError('Unauthorized: Admin permissions required');
      toast.error('Unauthorized: Admin permissions required');
      setLoading(false);
      throw new Error('Unauthorized: Admin permissions required');
    }
    
    try {
      await SongService.adminDeleteSong(id);
      setSongs((prev) => prev.filter((s) => s.id !== id));
      toast.success('Song deleted successfully');
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setIsAdmin(false);
        const errorMsg = 'Permission denied: Admin rights required to delete songs';
        setError(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to delete song';
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      }
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
        const hasAdminRights = AuthService.isAdmin();
        if (!hasAdminRights) {
          setError('Unauthorized: Admin permissions required for album search');
          toast.error('Unauthorized: Admin permissions required');
          throw new Error('Unauthorized: Admin permissions required');
        }
        results = await SongService.adminSearchSongsByAlbum(query);
      }
      return results;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to search songs';
      setError(errorMsg);
      toast.error('Failed to search songs: ' + errorMsg);
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
      const errorMsg = err.response?.data?.message || 'Failed to fetch songs by artist';
      setError(errorMsg);
      toast.error('Failed to fetch songs by artist: ' + errorMsg);
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
      const errorMsg = err.response?.data?.message || 'Failed to fetch songs by genre';
      setError(errorMsg);
      toast.error('Failed to fetch songs by genre: ' + errorMsg);
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
    isAdmin
  };
}