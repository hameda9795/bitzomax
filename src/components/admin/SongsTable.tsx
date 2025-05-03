"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { InfoIcon, LockIcon, Loader2 } from "lucide-react";
import { useSongs } from "@/hooks/use-songs";
import { Song } from "@/lib/services/song-service";

export function SongsTable() {
  const { songs, loading, error, updateSong, deleteSong } = useSongs();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filterPremium, setFilterPremium] = useState<boolean | null>(null);
  const [songToDelete, setSongToDelete] = useState<number | null>(null);
  
  // Format song duration
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Check if a song is premium (this would depend on your backend implementation)
  // For this example, we'll assume songs with "premium" in their genre field are premium
  const isPremium = (song: Song) => {
    return song.genre?.toLowerCase().includes('premium') || false;
  };

  // Filter songs based on search term and filters
  const filteredSongs = songs.filter((song) => {
    const songIsPremium = isPremium(song);
    
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre ? song.genre === selectedGenre : true;
    
    const matchesPremium =
      filterPremium !== null ? songIsPremium === filterPremium : true;
    
    return matchesSearch && matchesGenre && matchesPremium;
  });

  // Handle song deletion
  const handleDeleteSong = async (id: number) => {
    try {
      await deleteSong(id);
      setSongToDelete(null);
    } catch (error) {
      console.error('Failed to delete song:', error);
    }
  };

  // Handle song edit (in a real app, this would open an edit form)
  const handleEditSong = (id: number) => {
    toast.info(`Editing song ${id}`);
    // In a real application, you would open an edit form or navigate to an edit page
  };

  // Handle premium status toggle
  const handleTogglePremium = async (id: number, song: Song) => {
    try {
      // Update the genre to include or remove "premium" based on current state
      const currentIsPremium = isPremium(song);
      let newGenre = song.genre || '';
      
      if (currentIsPremium) {
        // Remove premium from genre
        newGenre = newGenre.replace(/premium/i, '').trim();
        if (!newGenre) newGenre = 'Standard'; // Default if empty
      } else {
        // Add premium to genre
        newGenre = newGenre ? `${newGenre} Premium` : 'Premium';
      }
      
      await updateSong(id, { ...song, genre: newGenre });
      
      if (!currentIsPremium) {
        toast.success(`"${song.title}" is now premium content. Free users can only listen to the first 30 seconds.`);
      } else {
        toast.success(`"${song.title}" is now free content. All users can listen to the full song.`);
      }
    } catch (error) {
      console.error('Failed to update song premium status:', error);
      toast.error('Failed to update song premium status');
    }
  };

  // Get stats
  const premiumCount = songs.filter(song => isPremium(song)).length;
  const freeCount = songs.length - premiumCount;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading songs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Failed to load songs</p>
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Get unique genres for filter
  const genres = Array.from(new Set(songs.map(song => song.genre || 'Unknown')));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div>
          <h2 className="text-lg font-semibold">Song Statistics</h2>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">Free</Badge>
              <span className="text-sm">{freeCount} songs</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500">Premium</Badge>
              <span className="text-sm">{premiumCount} songs</span>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-muted-foreground cursor-help bg-background/80 p-2 rounded-md">
                <InfoIcon size={16} />
                <span className="text-sm">About Premium Content</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <div className="p-2">
                <p className="font-medium mb-1">Premium vs. Free Content:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Free users can only listen to the first 30 seconds of premium songs</li>
                  <li>Premium subscribers (€6,05/month) can listen to all songs in full</li>
                  <li>Toggle a song's premium status using the actions menu</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search songs or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            onValueChange={(value) => setSelectedGenre(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            onValueChange={(value) => {
              if (value === "all") setFilterPremium(null);
              else if (value === "premium") setFilterPremium(true);
              else setFilterPremium(false);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Songs</SelectItem>
              <SelectItem value="premium">Premium Only</SelectItem>
              <SelectItem value="free">Free</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedGenre(null);
              setFilterPremium(null);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Access Type</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => {
                const songIsPremium = isPremium(song);
                return (
                  <TableRow key={song.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {song.title}
                        {songIsPremium && <LockIcon size={14} className="text-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell>{song.artist}</TableCell>
                    <TableCell>{song.genre || 'N/A'}</TableCell>
                    <TableCell>{formatDuration(song.durationSeconds)}</TableCell>
                    <TableCell>{formatDate(song.releaseDate)}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant={songIsPremium ? "default" : "secondary"} className={songIsPremium ? "bg-yellow-500 hover:bg-yellow-600" : ""}>
                              {songIsPremium ? "Premium" : "Free"}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {songIsPremium 
                              ? "Free users can only listen to the first 30 seconds" 
                              : "All users can listen to the full song"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{formatDate(song.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Manage Song</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditSong(song.id)}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePremium(song.id, song)}>
                            {songIsPremium 
                              ? "Make Free (Full Access)" 
                              : "Make Premium (30s Preview)"
                            }
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setSongToDelete(song.id)}
                          >
                            Delete Song
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No songs found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!songToDelete} onOpenChange={() => setSongToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the song from
              the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => songToDelete && handleDeleteSong(songToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}