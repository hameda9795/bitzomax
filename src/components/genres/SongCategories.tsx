'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Play, 
  Heart, 
  Plus, 
  ArrowUpDown, 
  MoreHorizontal, 
  Search, 
  RefreshCw, 
  Share2,
  Clock,
  Download,
  Calendar,
  List
} from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

// Types
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  plays: number;
  releaseDate: string;
  liked: boolean;
}

interface GenreSongsProps {
  genreId: string;
}

// Mock data for songs in a genre
const mockSongsByGenre: Record<string, Song[]> = {
  pop: [
    {
      id: 1,
      title: 'Zomernachten',
      artist: 'Lisa de Jong',
      album: 'Zonnige Dagen',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
      duration: '3:45',
      plays: 1250000,
      releaseDate: '2025-04-15',
      liked: true,
    },
    {
      id: 2,
      title: 'Nieuwe Dag',
      artist: 'Thomas Berge',
      album: 'Morgen',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
      duration: '4:12',
      plays: 980000,
      releaseDate: '2025-03-22',
      liked: false,
    },
    {
      id: 3,
      title: 'Stad Aan Zee',
      artist: 'Emma Heesters',
      album: 'Kustlijn',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      duration: '4:18',
      plays: 1150000,
      releaseDate: '2025-02-18',
      liked: false,
    },
    {
      id: 4,
      title: 'Gouden Jaren',
      artist: 'Nick & Simon',
      album: 'Herinneringen',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      duration: '3:56',
      plays: 890000,
      releaseDate: '2025-01-30',
      liked: true,
    },
    {
      id: 5,
      title: 'Dromen Van Jou',
      artist: 'Lisa de Jong',
      album: 'Zonnige Dagen',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
      duration: '3:22',
      plays: 750000,
      releaseDate: '2025-04-15',
      liked: false,
    },
    {
      id: 6,
      title: 'Zomer in de Stad',
      artist: 'Thomas Berge',
      album: 'Morgen',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
      duration: '3:48',
      plays: 680000,
      releaseDate: '2025-03-22',
      liked: true,
    },
    {
      id: 7,
      title: 'Lente Liefde',
      artist: 'Emma Heesters',
      album: 'Kustlijn',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      duration: '4:05',
      plays: 920000,
      releaseDate: '2025-02-18',
      liked: false,
    },
    {
      id: 8,
      title: 'Oude Vrienden',
      artist: 'Nick & Simon',
      album: 'Herinneringen',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      duration: '4:22',
      plays: 580000,
      releaseDate: '2025-01-30',
      liked: true,
    },
    {
      id: 9,
      title: 'Laatste Dans',
      artist: 'Lisa de Jong',
      album: 'Zonnige Dagen',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
      duration: '5:10',
      plays: 430000,
      releaseDate: '2025-04-15',
      liked: false,
    },
    {
      id: 10,
      title: 'Morgenrood',
      artist: 'Thomas Berge',
      album: 'Morgen',
      coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop',
      duration: '3:36',
      plays: 350000,
      releaseDate: '2025-03-22',
      liked: true,
    },
  ],
  rock: [
    {
      id: 11,
      title: 'Vurige Nacht',
      artist: 'De Staat',
      album: 'Vlammen',
      coverUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=800&auto=format&fit=crop',
      duration: '5:28',
      plays: 780000,
      releaseDate: '2025-03-10',
      liked: true,
    },
    // Additional rock songs would go here
  ],
  hiphop: [
    {
      id: 21,
      title: 'Straten van Amsterdam',
      artist: 'Lijpe',
      album: 'Hoofdstad',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      duration: '3:54',
      plays: 1350000,
      releaseDate: '2025-02-25',
      liked: true,
    },
    // Additional hip-hop songs would go here
  ],
};

// Default songs for when a genre isn't found
const defaultSongs = mockSongsByGenre.pop;

type SortKey = 'title' | 'artist' | 'plays' | 'releaseDate';
type SortOrder = 'asc' | 'desc';

export const SongCategories = ({ genreId = 'pop' }: GenreSongsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('plays');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [songs, setSongs] = useState<Song[]>([]);
  
  const songsPerPage = 5;
  
  // Initialize songs based on genreId
  useEffect(() => {
    const genreSongs = mockSongsByGenre[genreId] || defaultSongs;
    setSongs(genreSongs);
    setCurrentPage(1);
  }, [genreId]);
  
  // Filtered songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort songs based on selected sort key and order
  const sortedSongs = [...filteredSongs].sort((a, b) => {
    let comparison = 0;
    
    switch (sortKey) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'artist':
        comparison = a.artist.localeCompare(b.artist);
        break;
      case 'plays':
        comparison = a.plays - b.plays;
        break;
      case 'releaseDate':
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedSongs.length / songsPerPage);
  const paginatedSongs = sortedSongs.slice((currentPage - 1) * songsPerPage, currentPage * songsPerPage);
  
  // Handle sort toggle
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  
  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const toggleLike = (songId: number) => {
    // In a real app, this would update the state or call an API
    console.log('Toggle like for song:', songId);
  };
  
  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek op titel, artiest of album..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sorteer op: {sortKey === 'plays' ? 'Populariteit' : 
                          sortKey === 'releaseDate' ? 'Releasedatum' : 
                          sortKey === 'title' ? 'Titel' : 'Artiest'}
              {sortOrder === 'asc' ? ' (Oplopend)' : ' (Aflopend)'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleSort('title')}>
              <List className="h-4 w-4 mr-2" />
              Titel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('artist')}>
              <List className="h-4 w-4 mr-2" />
              Artiest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('plays')}>
              <List className="h-4 w-4 mr-2" />
              Populariteit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleSort('releaseDate')}>
              <Calendar className="h-4 w-4 mr-2" />
              Releasedatum
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Songs Table */}
      <Card className="overflow-hidden">
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Titel</TableHead>
                <TableHead className="hidden sm:table-cell">Artiest</TableHead>
                <TableHead className="hidden md:table-cell">Album</TableHead>
                <TableHead className="hidden sm:table-cell">Releasedatum</TableHead>
                <TableHead className="text-right">Speeltijd</TableHead>
                <TableHead className="w-[80px] text-right">Plays</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSongs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                    Geen nummers gevonden voor deze zoekopdracht
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSongs.map((song) => (
                  <TableRow key={song.id} className="group hover:bg-muted/50">
                    <TableCell className="p-2">
                      <div className="relative h-10 w-10">
                        <Image 
                          src={song.coverUrl} 
                          alt={`${song.title} - ${song.artist}`}
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
                      <p className="font-medium">{song.title}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {song.artist}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {song.album}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {formatDate(song.releaseDate)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {song.duration}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatNumber(song.plays)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                          onClick={() => toggleLike(song.id)}
                        >
                          {song.liked ? (
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
                            <DropdownMenuItem onClick={() => console.log('Add to playlist:', song.id)}>
                              <Plus className="h-4 w-4 mr-2" />
                              <span>Toevoegen aan afspeellijst</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Download:', song.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              <span>Downloaden</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => console.log('Share:', song.id)}>
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(p => Math.max(p - 1, 1));
                }}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum;
              
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(p => Math.min(p + 1, totalPages));
                }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SongCategories;