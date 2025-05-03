'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Mock data for genres and songs
const genres = [
  { id: 'pop', name: 'Pop' },
  { id: 'rock', name: 'Rock' },
  { id: 'hiphop', name: 'Hip-Hop' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'jazz', name: 'Jazz' },
];

const songsByGenre = {
  pop: [
    { id: 1, title: 'Zomernachten', artist: 'Lisa de Jong', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
    { id: 2, title: 'Nieuwe Dag', artist: 'Thomas Berge', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop' },
    { id: 3, title: 'Stad Aan Zee', artist: 'Emma Heesters', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
    { id: 4, title: 'Gouden Jaren', artist: 'Nick & Simon', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
  ],
  rock: [
    { id: 5, title: 'Vurige Nacht', artist: 'De Staat', coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop' },
    { id: 6, title: 'Laatste Kans', artist: 'Kensington', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
    { id: 7, title: 'Donkere Dagen', artist: 'Racoon', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop' },
    { id: 8, title: 'Zwarte Wolken', artist: 'Triggerfinger', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
  ],
  hiphop: [
    { id: 9, title: 'Straten van Amsterdam', artist: 'Lijpe', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
    { id: 10, title: 'Nieuwe Flow', artist: 'Ronnie Flex', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop' },
    { id: 11, title: 'Groot Geld', artist: 'Boef', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
    { id: 12, title: 'Stad Leeft', artist: 'Frenna', coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop' },
  ],
  electronic: [
    { id: 13, title: 'Nachtleven', artist: 'Martin Garrix', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
    { id: 14, title: 'Vergeten Tijd', artist: 'Hardwell', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop' },
    { id: 15, title: 'Nieuwe Energie', artist: 'Armin van Buuren', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
    { id: 16, title: 'Zomerfestival', artist: 'Afrojack', coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop' },
  ],
  jazz: [
    { id: 17, title: 'Avond in Rotterdam', artist: 'Hans Dulfer', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop' },
    { id: 18, title: 'Café de Noord', artist: 'Candy Dulfer', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop' },
    { id: 19, title: 'Herfstbladeren', artist: 'Benjamin Herman', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop' },
    { id: 20, title: 'Late Sessie', artist: 'Teus Nobel', coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop' },
  ],
};

const GenreOverview = () => {
  const [activeGenre, setActiveGenre] = useState('pop');
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Genres</h2>
      </div>

      <Tabs defaultValue="pop" onValueChange={setActiveGenre} className="space-y-6">
        <TabsList className="bg-background">
          {genres.map((genre) => (
            <TabsTrigger
              key={genre.id}
              value={genre.id}
              className="data-[state=active]:bg-secondary"
            >
              {genre.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {genres.map((genre) => (
          <TabsContent key={genre.id} value={genre.id} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {songsByGenre[genre.id as keyof typeof songsByGenre].map((song) => (
                <Card 
                  key={song.id} 
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                  onMouseEnter={() => setHoveredSong(song.id)}
                  onMouseLeave={() => setHoveredSong(null)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={song.coverUrl}
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
                      {genre.name}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default GenreOverview;