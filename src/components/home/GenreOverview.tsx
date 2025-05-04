'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, MoreHorizontal, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import homeService, { Song } from '@/lib/services/home-service';

const GenreOverview = () => {
  const [activeGenre, setActiveGenre] = useState<string>('');
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [songsByGenre, setSongsByGenre] = useState<Record<string, Song[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenresAndSongs = async () => {
      setIsLoading(true);
      try {
        // Fetch featured content which includes songs by genre
        const featuredContent = await homeService.getFeaturedContent();
        
        // Get list of genres
        const allGenres = await homeService.getAllGenres();
        
        setGenres(allGenres);
        setSongsByGenre(featuredContent.genreHighlights);
        
        // Set initial active genre
        if (allGenres.length > 0 && !activeGenre) {
          setActiveGenre(allGenres[0]);
        }
      } catch (error) {
        console.error('Failed to load genre data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenresAndSongs();
  }, []);

  // Load songs when active genre changes
  useEffect(() => {
    const loadGenreSongs = async () => {
      if (!activeGenre) return;
      
      // Skip loading if we already have songs for this genre
      if (songsByGenre[activeGenre] && songsByGenre[activeGenre].length > 0) return;
      
      try {
        const songs = await homeService.getSongsByGenre(activeGenre);
        setSongsByGenre(prev => ({
          ...prev,
          [activeGenre]: songs
        }));
      } catch (error) {
        console.error(`Failed to load songs for ${activeGenre}:`, error);
      }
    };

    loadGenreSongs();
  }, [activeGenre]);

  // Loading state
  if (isLoading) {
    return (
      <section className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Genres laden...</span>
      </section>
    );
  }

  // Handle empty state
  if (genres.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Genres</h2>
        </div>
        <div className="p-8 text-center">
          <p>Geen genres beschikbaar. Probeer het later nog eens.</p>
        </div>
      </section>
    );
  }

  // Ensure we have a valid active genre
  const currentActiveGenre = activeGenre || genres[0];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Genres</h2>
      </div>

      <Tabs value={currentActiveGenre} onValueChange={setActiveGenre} className="space-y-6">
        <TabsList className="bg-background">
          {genres.map((genre) => (
            <TabsTrigger
              key={genre}
              value={genre}
              className="data-[state=active]:bg-secondary"
            >
              {genre}
            </TabsTrigger>
          ))}
        </TabsList>

        {genres.map((genre) => {
          const songs = songsByGenre[genre] || [];
          
          return (
            <TabsContent key={genre} value={genre} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {songs.length > 0 ? (
                  songs.map((song) => (
                    <Card 
                      key={song.id} 
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                      onMouseEnter={() => setHoveredSong(song.id)}
                      onMouseLeave={() => setHoveredSong(null)}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={song.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'}
                          alt={`${song.title} by ${song.artist}`}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        
                        {/* Overlay with controls when hovered */}
                        {hoveredSong === song.id && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity">
                            <Button size="icon" variant="secondary" className="rounded-full">
                              <Play className="h-5 w-5" fill="currentColor" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full">
                              <Plus className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full">
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </CardContent>
                      
                      <CardFooter className="px-4 py-2 flex justify-between border-t">
                        <span className="text-xs text-muted-foreground">
                          {song.album || genre}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full p-12 text-center">
                    <p>Geen nummers beschikbaar in dit genre.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};

export default GenreOverview;