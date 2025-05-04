"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { useSongs } from "@/hooks/use-songs";
import { Song } from "@/lib/services/song-service";
import apiClient from "@/lib/services/api-client";
import { AuthService } from "@/lib/services/auth-service";

// Common music genres
const genres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Country",
  "Electronic",
  "Jazz",
  "Classical",
  "Blues",
  "Folk",
  "Reggae",
  "Metal",
  "Punk",
  "Alternative",
  "Indie",
  "Soul",
  "Funk",
];

interface SongUploadFormProps {
  onComplete: () => void;
}

interface SongFormData {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  releaseDate?: string;
  isPremium: boolean;
  durationSeconds?: number;
}

export function SongUploadForm({ onComplete }: SongUploadFormProps) {
  const { createSong, fetchSongs } = useSongs();
  const [isUploading, setIsUploading] = useState(false);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [duration, setDuration] = useState<string>("");
  const [extractingMetadata, setExtractingMetadata] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SongFormData>();

  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.type === "video/webm") {
        setSongFile(file);
        
        // Extract duration from the video file
        setExtractingMetadata(true);
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        
        video.onloadedmetadata = () => {
          const durationInSeconds = Math.round(video.duration);
          setDuration(durationInSeconds.toString());
          setExtractingMetadata(false);
        };
        
        video.onerror = () => {
          setExtractingMetadata(false);
          console.error("Could not extract metadata from video file");
        };
      } else {
        toast.error("Please upload a WebM video file");
        e.target.value = '';
      }
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setCoverFile(file);
      } else {
        toast.error("Please upload a valid image file");
        e.target.value = '';
      }
    }
  };

  const onSubmit = async (data: SongFormData) => {
    if (!songFile) {
      toast.error("Please upload a song file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload song file
      const formData = new FormData();
      formData.append('file', songFile);
      
      // Token is already added by apiClient interceptor
      const songUploadResponse = await apiClient.post(
        '/admin/files/upload/song', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total 
              ? Math.round((progressEvent.loaded * 75) / progressEvent.total)
              : 0;
            setUploadProgress(progress); // Max 75% for video upload
          }
        }
      );

      const songFilePath = songUploadResponse.data.fileName;
      let coverArtUrl = null;

      // 2. Upload cover art if present
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append('file', coverFile);

        const coverUploadResponse = await apiClient.post(
          '/admin/files/upload/cover',
          coverFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const baseProgress = 75;
              const progress = progressEvent.total
                ? baseProgress + Math.round((progressEvent.loaded * 25) / progressEvent.total)
                : baseProgress;
              setUploadProgress(progress); // Max 100% for cover upload
            }
          }
        );

        coverArtUrl = coverUploadResponse.data.fileName;
      }

      setUploadProgress(95);

      // 3. Create song metadata
      const genreValue = data.genre || 'Unknown';
      const finalGenre = isPremium ? `${genreValue} Premium` : genreValue;

      const songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        artist: data.artist,
        album: data.album || null,
        genre: finalGenre,
        releaseDate: data.releaseDate || null,
        durationSeconds: duration ? parseInt(duration, 10) : null,
        filePath: songFilePath,
        coverArtUrl: coverArtUrl
      };

      await createSong(songData);
      setUploadProgress(100);
      toast.success("Song uploaded successfully!");
      
      // Refresh the songs list
      fetchSongs();
      
      // Reset form
      reset();
      setSongFile(null);
      setCoverFile(null);
      setIsPremium(false);
      setDuration("");
      
      // Close the form
      onComplete();
    } catch (error: any) {
      console.error("Error uploading song:", error);
      toast.error(error.response?.data?.message || "Failed to upload song");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Song Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Song Title <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            {...register("title", { required: "Song title is required" })}
            placeholder="Enter song title"
            disabled={isUploading}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Artist */}
        <div className="space-y-2">
          <Label htmlFor="artist">Artist <span className="text-red-500">*</span></Label>
          <Input
            id="artist"
            {...register("artist", { required: "Artist name is required" })}
            placeholder="Enter artist name"
            disabled={isUploading}
          />
          {errors.artist && (
            <p className="text-sm text-red-500">{errors.artist.message}</p>
          )}
        </div>

        {/* Album */}
        <div className="space-y-2">
          <Label htmlFor="album">Album</Label>
          <Input
            id="album"
            {...register("album")}
            placeholder="Enter album name (optional)"
            disabled={isUploading}
          />
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select
            onValueChange={(value) => {
              const event = {
                target: {
                  name: "genre",
                  value
                }
              } as any;
              register("genre").onChange(event);
            }}
            disabled={isUploading}
          >
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select genre (optional)" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Release Date */}
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input
            id="releaseDate"
            type="date"
            {...register("releaseDate")}
            disabled={isUploading}
          />
        </div>

        {/* Premium Toggle */}
        <div className="space-y-2 flex flex-col">
          <Label className="mb-2">Access Type</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="free"
                checked={!isPremium}
                onChange={() => setIsPremium(false)}
                disabled={isUploading}
                className="h-4 w-4"
              />
              <Label htmlFor="free" className="font-normal cursor-pointer">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="premium"
                checked={isPremium}
                onChange={() => setIsPremium(true)}
                disabled={isUploading}
                className="h-4 w-4"
              />
              <Label htmlFor="premium" className="font-normal cursor-pointer">Premium</Label>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration in seconds (optional)"
            disabled={isUploading || extractingMetadata}
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-6">
        {/* Song File */}
        <div className="space-y-2">
          <Label htmlFor="songFile">Video File <span className="text-red-500">*</span></Label>
          <div className="flex items-center gap-4">
            <Input
              id="songFile"
              type="file"
              accept="video/webm"
              onChange={handleSongFileChange}
              disabled={isUploading}
              className="flex-1"
            />
            {songFile && (
              <div className="text-sm text-muted-foreground">
                {songFile.name} ({Math.round(songFile.size / 1024 / 1024 * 10) / 10} MB)
              </div>
            )}
          </div>
        </div>

        {/* Cover Art */}
        <div className="space-y-2">
          <Label htmlFor="coverFile">Cover Art (Optional)</Label>
          <div className="flex items-center gap-4">
            <Input
              id="coverFile"
              type="file"
              accept="image/*"
              onChange={handleCoverFileChange}
              disabled={isUploading}
              className="flex-1"
            />
            {coverFile && (
              <div className="flex items-center gap-2">
                <img 
                  src={URL.createObjectURL(coverFile)} 
                  alt="Cover preview" 
                  className="h-10 w-10 object-cover rounded"
                />
                <span className="text-sm text-muted-foreground">
                  {Math.round(coverFile.size / 1024)} KB
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="flex items-center gap-2"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Song
            </>
          )}
        </Button>
      </div>
    </form>
  );
}