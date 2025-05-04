"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SongService, Song } from "@/lib/services/song-service";
import { VideoPlayer } from "@/components/home/VideoPlayer";

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [latestSongs, setLatestSongs] = useState<Song[]>([]);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        // Get all songs
        const allSongs = await SongService.getAllSongs();
        setSongs(allSongs);
        
        // Get latest songs (most recently added)
        const sortedByDate = [...allSongs].sort((a, b) => {
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        });
        setLatestSongs(sortedByDate.slice(0, 8));
        
        // For demo purposes, we'll consider premium songs as "popular"
        const premiumSongs = allSongs.filter(song => song.genre?.toLowerCase().includes('premium'));
        setPopularSongs(premiumSongs.length > 0 ? premiumSongs.slice(0, 8) : allSongs.slice(0, 8));
        
      } catch (err) {
        console.error("Failed to fetch songs:", err);
        setError("Failed to load songs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSongs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading videos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Welcome to BitZoMax</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Explore our collection of premium videos and music. Subscribe for unlimited access to all content.
        </p>
      </section>

      <section className="mb-12">
        <VideoPlayer 
          songs={latestSongs} 
          title="Latest Videos"
          description="Check out our newest video content, fresh from our creators"
        />
      </section>

      <section className="mb-12">
        <VideoPlayer 
          songs={popularSongs}
          title="Trending Videos" 
          description="Our most popular premium content watched by subscribers"
        />
      </section>
    </div>
  );
}
