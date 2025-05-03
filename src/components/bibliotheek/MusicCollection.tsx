'use client';

import { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  MoreHorizontal, 
  Heart, 
  HeartOff, 
  Plus, 
  Download, 
  Share2,
  ListMusic
} from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data
const savedSongs = [
  {
    id: 1,
    title: 'Zomernachten',
    artist: 'Lisa de Jong',
    album: 'Zonnige Dagen',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    duration: '3:45',
    liked: true,
    genre: 'Pop',
    addedDate: '29 april 2025',
  },
  {
    id: 2,
    title: 'Nieuwe Dag',
    artist: 'Thomas Berge',
    album: 'Morgen',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
    duration: '4:12',
    liked: false,
    genre: 'Pop',
    addedDate: '27 april 2025',
  },
  {
    id: 3,
    title: 'Vurige Nacht',
    artist: 'De Staat',
    album: 'Vlammen',
    coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop',
    duration: '5:28',
    liked: true,
    genre: 'Rock',
    addedDate: '25 april 2025',
  },
  {
    id: 4,
    title: 'Straten van Amsterdam',
    artist: 'Lijpe',
    album: 'Hoofdstad',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    duration: '3:54',
    liked: false,
    genre: 'Hip-Hop',
    addedDate: '24 april 2025',
  },
  {
    id: 5,
    title: 'Nachtleven',
    artist: 'Martin Garrix',
    album: 'Elektronische Dromen',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
    duration: '6:02',
    liked: true,
    genre: 'Electronic',
    addedDate: '22 april 2025',
  },
  {
    id: 6,
    title: 'Avond in Rotterdam',
    artist: 'Hans Dulfer',
    album: 'Havenstad',
    coverUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=800&auto=format&fit=crop',
    duration: '7:15',
    liked: true,
    genre: 'Jazz',
    addedDate: '20 april 2025',
  },
];

const savedAlbums = [
  {
    id: 1,
    title: 'Zonnige Dagen',
    artist: 'Lisa de Jong',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    tracks: 12,
    releaseYear: 2025,
    genre: 'Pop',
    addedDate: '29 april 2025',
  },
  {
    id: 2,
    title: 'Morgen',
    artist: 'Thomas Berge',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
    tracks: 10,
    releaseYear: 2024,
    genre: 'Pop',
    addedDate: '27 april 2025',
  },
  {
    id: 3,
    title: 'Vlammen',
    artist: 'De Staat',
    coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop',
    tracks: 8,
    releaseYear: 2025,
    genre: 'Rock',
    addedDate: '25 april 2025',
  },
  {
    id: 4,
    title: 'Hoofdstad',
    artist: 'Lijpe',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    tracks: 14,
    releaseYear: 2024,
    genre: 'Hip-Hop',
    addedDate: '24 april 2025',
  },
];

export const MusicCollection = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  const toggleLike = (songId: number) => {
    // In a real app, this would update the state or call an API
    console.log('Toggle like for song:', songId);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="songs" className="w-full">
        <TabsList>
          <TabsTrigger value="songs">Nummers</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="space-y-6">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
              {savedSongs.map((song) => (
                <Card 
                  key={song.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-md"
                  onMouseEnter={() => setHoveredItem(song.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative aspect-square">
                    <Image 
                      src={song.coverUrl}
                      alt={`${song.title} by ${song.artist}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    {hoveredItem === song.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full h-12 w-12"
                        >
                          <Play className="h-6 w-6" fill="currentColor" />
                        </Button>
                        
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="rounded-full h-9 w-9"
                          onClick={() => toggleLike(song.id)}
                        >
                          {song.liked ? (
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                          ) : (
                            <Heart className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    )}
                    
                    <Badge 
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/70"
                      variant="secondary"
                    >
                      {song.duration}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{song.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{song.album}</p>
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 flex justify-between border-t">
                    <span className="text-xs text-muted-foreground">
                      {song.addedDate}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('Add to playlist:', song.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Toevoegen aan afspeellijst</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Download:', song.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          <span>Downloaden</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Share:', song.id)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          <span>Delen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="albums" className="space-y-6">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
              {savedAlbums.map((album) => (
                <Card 
                  key={album.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-md"
                  onMouseEnter={() => setHoveredItem(album.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative aspect-square">
                    <Image 
                      src={album.coverUrl}
                      alt={`${album.title} by ${album.artist}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    {hoveredItem === album.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full h-12 w-12"
                        >
                          <Play className="h-6 w-6" fill="currentColor" />
                        </Button>
                        
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="rounded-full h-9 w-9"
                        >
                          <ListMusic className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                    
                    <Badge 
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/70"
                      variant="secondary"
                    >
                      {album.tracks} nummers
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{album.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{album.artist}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{album.releaseYear} • {album.genre}</p>
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 flex justify-between border-t">
                    <span className="text-xs text-muted-foreground">
                      {album.addedDate}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('Download album:', album.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          <span>Album downloaden</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Share album:', album.id)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          <span>Album delen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicCollection;