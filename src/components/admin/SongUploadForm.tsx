"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { AlertCircle, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define form schema with Zod
const songFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  genre: z.string().min(1, "Genre is required"),
  duration: z.string().min(1, "Duration is required"),
  releaseDate: z.string().min(1, "Release date is required"),
  description: z.string().optional(),
  isPremium: z.boolean().default(false),
  audioFile: z.instanceof(File).refine((file) => 
    file.size < 20 * 1024 * 1024, "Audio file must be less than 20MB"),
  srtFile: z.instanceof(File).optional(),
});

type SongFormValues = z.infer<typeof songFormSchema>;

// List of music genres
const genres = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Country", 
  "Electronic", "Jazz", "Classical", "Folk", "Metal",
  "Reggae", "Blues", "Indie", "Alternative", "K-pop"
];

interface SongUploadFormProps {
  onSongAdded?: () => void;
}

export function SongUploadForm({ onSongAdded }: SongUploadFormProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<SongFormValues>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      genre: "Pop",
      duration: "",
      releaseDate: new Date().toISOString().split('T')[0],
      description: "",
      isPremium: false,
    },
  });

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      form.setValue('audioFile', file);
    }
  };

  const handleSrtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSrtFile(file);
      form.setValue('srtFile', file);
    }
  };

  // Watch if premium is checked
  const watchIsPremium = form.watch("isPremium");

  async function onSubmit(values: SongFormValues) {
    setIsUploading(true);
    
    try {
      // In a real application, you would upload the files to a server here
      // For demonstration purposes, we'll just simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log("Song data:", values);
      console.log("Audio file:", audioFile);
      console.log("SRT file:", srtFile);
      
      const successMessage = values.isPremium 
        ? `Song uploaded successfully as Premium content! Free users will only hear 30 seconds.` 
        : `Song uploaded successfully as Free content! All users can listen to the full song.`;
      
      toast.success(successMessage);
      
      // Reset form after successful upload
      form.reset();
      setAudioFile(null);
      setSrtFile(null);
      
      // Notify parent component that a song was added
      if (onSongAdded) {
        onSongAdded();
      }
    } catch (error) {
      console.error("Error uploading song:", error);
      toast.error("Failed to upload song. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Song</CardTitle>
        <CardDescription>Fill out the form to upload a new song to the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter song title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter artist name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3:45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter song description (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem className="flex flex-col space-y-2">
                <FormLabel>Audio File</FormLabel>
                <Input
                  id="audioFile"
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="cursor-pointer"
                />
                <FormDescription>Supported formats: MP3, WAV, AAC (max 20MB)</FormDescription>
                {audioFile && (
                  <p className="text-sm text-green-600">Selected: {audioFile.name}</p>
                )}
              </FormItem>
              
              <FormItem className="flex flex-col space-y-2">
                <FormLabel>Lyrics/Subtitle File (Optional)</FormLabel>
                <Input
                  id="srtFile"
                  type="file"
                  accept=".srt,.lrc"
                  onChange={handleSrtChange}
                  className="cursor-pointer"
                />
                <FormDescription>Upload .SRT or .LRC file for lyrics</FormDescription>
                {srtFile && (
                  <p className="text-sm text-green-600">Selected: {srtFile.name}</p>
                )}
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-base">Premium Content</FormLabel>
                      {field.value && <Lock className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <FormDescription>
                      Make this song available only to premium subscribers
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {watchIsPremium && (
              <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Premium Content Access Restriction</AlertTitle>
                <AlertDescription className="mt-1">
                  <p>Free users will only be able to listen to the first 30 seconds of this song.</p>
                  <p className="text-sm mt-1">Only users with a Premium subscription (€6,05/month) will have access to the full song.</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Song"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}