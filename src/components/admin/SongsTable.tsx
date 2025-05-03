"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { InfoIcon, LockIcon } from "lucide-react";

// Mock song data for demonstration
const mockSongs = [
  {
    id: "1",
    title: "Summer Vibes",
    artist: "DJ Sunshine",
    genre: "Electronic",
    duration: "3:45",
    releaseDate: "2025-04-15",
    isPremium: false,
    uploadDate: "2025-05-01",
  },
  {
    id: "2",
    title: "Midnight Memories",
    artist: "Luna Band",
    genre: "Rock",
    duration: "4:20",
    releaseDate: "2025-03-22",
    isPremium: true,
    uploadDate: "2025-04-10",
  },
  {
    id: "3",
    title: "Rainy Days",
    artist: "Cloudwalker",
    genre: "Jazz",
    duration: "5:15",
    releaseDate: "2025-01-05",
    isPremium: false,
    uploadDate: "2025-02-20",
  },
  {
    id: "4",
    title: "Urban Jungle",
    artist: "City Beats",
    genre: "Hip-Hop",
    duration: "3:22",
    releaseDate: "2025-04-30",
    isPremium: true,
    uploadDate: "2025-05-02",
  },
  {
    id: "5",
    title: "Country Roads",
    artist: "Mountain Echo",
    genre: "Country",
    duration: "4:10",
    releaseDate: "2024-12-12",
    isPremium: false,
    uploadDate: "2025-01-15",
  },
];

export function SongsTable() {
  const [songs, setSongs] = useState(mockSongs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filterPremium, setFilterPremium] = useState<boolean | null>(null);
  const [songToDelete, setSongToDelete] = useState<string | null>(null);
  
  // Filter songs based on search term and filters
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre ? song.genre === selectedGenre : true;
    
    const matchesPremium =
      filterPremium !== null ? song.isPremium === filterPremium : true;
    
    return matchesSearch && matchesGenre && matchesPremium;
  });

  // Handle song deletion
  const handleDeleteSong = (id: string) => {
    setSongs((prev) => prev.filter((song) => song.id !== id));
    toast.success("Song deleted successfully");
    setSongToDelete(null);
  };

  // Handle song edit (in a real app, this would open an edit form)
  const handleEditSong = (id: string) => {
    toast.info(`Editing song ${id}`);
    // In a real application, you would open an edit form or navigate to an edit page
  };

  // Handle premium status toggle
  const handleTogglePremium = (id: string) => {
    setSongs((prev) =>
      prev.map((song) =>
        song.id === id ? { ...song, isPremium: !song.isPremium } : song
      )
    );
    const song = songs.find(song => song.id === id);
    const newStatus = !song?.isPremium;
    
    if (newStatus) {
      toast.success(`"${song?.title}" is now premium content. Free users can only listen to the first 30 seconds.`);
    } else {
      toast.success(`"${song?.title}" is now free content. All users can listen to the full song.`);
    }
  };

  // Get stats
  const premiumCount = songs.filter(song => song.isPremium).length;
  const freeCount = songs.filter(song => !song.isPremium).length;

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
              <SelectItem value="Electronic">Electronic</SelectItem>
              <SelectItem value="Rock">Rock</SelectItem>
              <SelectItem value="Jazz">Jazz</SelectItem>
              <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
              <SelectItem value="Country">Country</SelectItem>
              <SelectItem value="Pop">Pop</SelectItem>
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
              filteredSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {song.title}
                      {song.isPremium && <LockIcon size={14} className="text-yellow-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{song.genre}</TableCell>
                  <TableCell>{song.duration}</TableCell>
                  <TableCell>{song.releaseDate}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant={song.isPremium ? "default" : "secondary"} className={song.isPremium ? "bg-yellow-500 hover:bg-yellow-600" : ""}>
                            {song.isPremium ? "Premium" : "Free"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {song.isPremium 
                            ? "Free users can only listen to the first 30 seconds" 
                            : "All users can listen to the full song"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{song.uploadDate}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleTogglePremium(song.id)}>
                          {song.isPremium 
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
              ))
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