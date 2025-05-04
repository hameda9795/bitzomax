"use client";

import { useState, useEffect, useRef } from "react";
import { Song } from "@/lib/services/song-service";
import { FileService } from "@/lib/services/file-service";
import { useAuth } from "@/hooks/use-auth";
import { Play, Pause, Volume2, VolumeX, Lock } from "lucide-react";

interface VideoPlayerProps {
  songs: Song[];
  title?: string;
  description?: string;
}

export function VideoPlayer({ songs, title = "Featured Videos", description }: VideoPlayerProps) {
  if (!songs || songs.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">No videos available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {songs.map((song) => (
          <VideoCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ song }: { song: Song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  const isPremium = song.genre?.toLowerCase().includes('premium') || false;
  const userHasPremium = user?.subscription?.type === 'premium';
  const canPlayFull = !isPremium || userHasPremium || isAuthenticated;
  
  const videoUrl = `/api/songs/stream/${song.id}`;
  const coverUrl = song.coverArtUrl 
    ? FileService.getCoverArtUrl(song.coverArtUrl) 
    : '/sample-audio/default-cover.png';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // For non-premium users watching premium content, limit to 30 seconds
      if (isPremium && !canPlayFull && video.currentTime > 30) {
        video.pause();
        video.currentTime = 0;
        setIsPlaying(false);
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isPremium, canPlayFull]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative">
        {/* Video player */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={coverUrl}
          className="w-full aspect-video object-cover"
          preload="metadata"
          muted={isMuted}
        />
        
        {/* Premium badge */}
        {isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            PREMIUM
          </div>
        )}
        
        {/* Lock overlay for premium content */}
        {isPremium && !canPlayFull && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <Lock className="h-12 w-12 mb-2" />
            <p className="text-center px-4">
              Premium content. <br />
              Non-premium users can only watch 30 seconds.
            </p>
          </div>
        )}
        
        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePlayPause} 
              className="text-white hover:text-primary"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            
            <div className="flex-1 mx-2">
              <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{
                    width: `${(currentTime / duration) * 100}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleMuteToggle}
              className="text-white hover:text-primary"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{song.title}</h3>
        <p className="text-gray-500">{song.artist}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {song.genre?.replace(/premium/i, '').trim()}
          </span>
          <span className="text-xs text-gray-400">
            {formatTime(song.durationSeconds || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
