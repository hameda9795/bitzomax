'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Play, 
  Clock, 
  Calendar, 
  Music, 
  Heart, 
  HeartOff, 
  Plus, 
  MoreHorizontal, 
  RefreshCw, 
  Share2,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import Image from 'next/image';

// Mock data for playback history
const playbackHistory = [
  {
    id: 1,
    title: 'Zomernachten',
    artist: 'Lisa de Jong',
    album: 'Zonnige Dagen',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    duration: '3:45',
    playedAt: new Date('2025-05-03T10:23:00'),
    genre: 'Pop',
    liked: true
  },
  {
    id: 2,
    title: 'Vurige Nacht',
    artist: 'De Staat',
    album: 'Vlammen',
    coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop',
    duration: '5:28',
    playedAt: new Date('2025-05-03T09:15:00'),
    genre: 'Rock',
    liked: false
  },
  {
    id: 3,
    title: 'Nachtleven',
    artist: 'Martin Garrix',
    album: 'Elektronische Dromen',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
    duration: '6:02',
    playedAt: new Date('2025-05-02T22:30:00'),
    genre: 'Electronic',
    liked: true
  },
  {
    id: 4,
    title: 'Stad Aan Zee',
    artist: 'Emma Heesters',
    album: 'Kustlijn',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    duration: '4:18',
    playedAt: new Date('2025-05-02T20:45:00'),
    genre: 'Pop',
    liked: false
  },
  {
    id: 5,
    title: 'Straten van Amsterdam',
    artist: 'Lijpe',
    album: 'Hoofdstad',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    duration: '3:54',
    playedAt: new Date('2025-05-02T18:20:00'),
    genre: 'Hip-Hop',
    liked: true
  },
  {
    id: 6,
    title: 'Avond in Rotterdam',
    artist: 'Hans Dulfer',
    album: 'Havenstad',
    coverUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=800&auto=format&fit=crop',
    duration: '7:15',
    playedAt: new Date('2025-05-02T16:10:00'),
    genre: 'Jazz',
    liked: false
  },
  {
    id: 7,
    title: 'Nieuwe Dag',
    artist: 'Thomas Berge',
    album: 'Morgen',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
    duration: '4:12',
    playedAt: new Date('2025-05-02T14:05:00'),
    genre: 'Pop',
    liked: true
  },
  {
    id: 8,
    title: 'Laatste Kans',
    artist: 'Kensington',
    album: 'Keuzes',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
    duration: '4:45',
    playedAt: new Date('2025-05-02T11:30:00'),
    genre: 'Rock',
    liked: false
  },
];

type FilterType = 'all' | 'today' | 'yesterday' | 'thisWeek' | 'liked';

const PlaybackHistory = () => {
  const [filter, setFilter] = useState<FilterType>('all');

  const formatPlayedAt = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) {
      return `Vandaag ${format(date, 'HH:mm', { locale: nl })}`;
    } else if (isYesterday) {
      return `Gisteren ${format(date, 'HH:mm', { locale: nl })}`;
    } else {
      return format(date, 'd MMMM HH:mm', { locale: nl });
    }
  };

  const filteredHistory = playbackHistory.filter(track => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    switch (filter) {
      case 'today':
        return track.playedAt >= today;
      case 'yesterday':
        return track.playedAt >= yesterday && track.playedAt < today;
      case 'thisWeek':
        return track.playedAt >= weekAgo;
      case 'liked':
        return track.liked;
      default:
        return true;
    }
  });

  const toggleLike = (trackId: number) => {
    // In a real app, this would update the state or call an API
    console.log('Toggle like for track:', trackId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">
          Luistergeschiedenis
        </h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
              <Filter className="h-4 w-4 mr-2" />
              <span>
                {filter === 'all' && 'Alles'}
                {filter === 'today' && 'Vandaag'}
                {filter === 'yesterday' && 'Gisteren'}
                {filter === 'thisWeek' && 'Deze Week'}
                {filter === 'liked' && 'Favorieten'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter('all')}>
              Alles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('today')}>
              Vandaag
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('yesterday')}>
              Gisteren
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('thisWeek')}>
              Deze Week
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter('liked')}>
              Favorieten
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <ScrollArea className="h-[calc(100vh-350px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Track</TableHead>
                <TableHead className="hidden md:table-cell">Album</TableHead>
                <TableHead className="hidden sm:table-cell">Afgespeeld</TableHead>
                <TableHead className="hidden sm:table-cell w-[80px] text-right">Tijd</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    Geen afspeel geschiedenis gevonden
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((track) => (
                  <TableRow key={track.id} className="group hover:bg-muted/50">
                    <TableCell className="p-2">
                      <div className="relative h-10 w-10">
                        <Image 
                          src={track.coverUrl} 
                          alt={`${track.title} - ${track.artist}`}
                          fill
                          className="object-cover rounded-sm"
                          sizes="40px"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 text-white"
                          >
                            <Play className="h-3 w-3 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{track.artist}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      <span className="truncate max-w-[150px] inline-block">{track.album}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>{formatPlayedAt(track.playedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                      {track.duration}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={() => toggleLike(track.id)}
                        >
                          {track.liked ? (
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          ) : (
                            <Heart className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log('Replay track:', track.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              <span>Opnieuw afspelen</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Add to playlist:', track.id)}>
                              <Plus className="h-4 w-4 mr-2" />
                              <span>Toevoegen aan afspeellijst</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => console.log('Share track:', track.id)}>
                              <Share2 className="h-4 w-4 mr-2" />
                              <span>Delen</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default PlaybackHistory;