'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/lib/subscription-context';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import homeService, { Song } from '@/lib/services/home-service';

// Type for lyrics
interface Lyric {
  time: number;
  text: string;
}

// Type for song with lyrics
interface SongWithLyrics extends Song {
  lyrics?: Lyric[];
  isPremium?: boolean;
}

export const MusicPlayer = () => {
  // State for the player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLyric, setCurrentLyric] = useState('');
  const [nextLyric, setNextLyric] = useState('');
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [featuredSong, setFeaturedSong] = useState<SongWithLyrics | null>(null);
  
  // Use subscription context
  const { isSubscribed } = useSubscription();
  const router = useRouter();
  
  // Flag to track if the song has been restricted
  const [isRestricted, setIsRestricted] = useState(false);
  
  // References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Try real audio playback first, fallback to animation if needed
  const [usingAnimationFallback, setUsingAnimationFallback] = useState(false);

  // Fetch featured song from API
  useEffect(() => {
    const loadFeaturedSong = async () => {
      setIsLoading(true);
      try {
        const featuredContent = await homeService.getFeaturedContent();
        if (featuredContent.featuredSongs && featuredContent.featuredSongs.length > 0) {
          // Get first song from featured content
          const song = featuredContent.featuredSongs[0];
          
          // Check if the song is premium by checking if genre contains "Premium"
          const isPremium = song.genre?.toLowerCase().includes('premium') || false;
          
          // For demo purposes, we'll add lyrics
          const songWithLyrics: SongWithLyrics = {
            ...song,
            isPremium: isPremium,
            lyrics: [
              { time: 0, text: 'Wacht op het juiste moment...' },
              { time: 5, text: 'De muziek begint te spelen' },
              { time: 10, text: `${song.title} - ${song.artist}` },
              { time: 15, text: 'Muziek vult de kamer' },
              { time: 20, text: 'Luister naar de melodie' },
              { time: 25, text: 'Geniet van de muziek' },
              { time: 30, text: 'Het ritme neemt je mee' },
              { time: 35, text: 'Laat de muziek je meenemen' },
              { time: 40, text: 'Dit is het einde van het nummer' },
            ]
          };
          
          setFeaturedSong(songWithLyrics);
          setDuration(song.durationSeconds || 90); // Use actual duration if available, otherwise default to 90
          
          // Pre-check if we can access the audio file
          // If we can't, set up animation fallback immediately
          if (isPremium && !isSubscribed) {
            console.log("Premium song detected for non-subscriber, preparing animation fallback");
            setUsingAnimationFallback(true);
          }
        }
      } catch (error) {
        console.error('Failed to load featured song:', error);
        setAudioError('Er is een probleem opgetreden bij het laden van de muziek.');
        setUsingAnimationFallback(true); // Use animation fallback when we can't load songs
        
        // Create a mock song since we couldn't load from the API
        const mockSong: SongWithLyrics = {
          id: 'local-1',
          title: 'Demo Track',
          artist: 'Bitzomax Demo',
          album: 'Test Album',
          genre: 'Pop',
          coverArtUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
          durationSeconds: 90,
          isPremium: false,
          lyrics: [
            { time: 0, text: 'Test lyrics for local playback...' },
            { time: 5, text: 'This is a demo track' },
            { time: 10, text: 'Used when API is not available' },
            { time: 15, text: 'Muziek vult de kamer' },
            { time: 20, text: 'Luister naar de melodie' },
            { time: 30, text: 'Het ritme neemt je mee' },
          ]
        };
        setFeaturedSong(mockSong);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedSong();
  }, [isSubscribed]);
  
  // Set volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [volume]);
  
  // Use the actual audio element's timeupdate event to update the current time
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        // Update the currentTime state with the actual audio current time
        setCurrentTime(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        // Update the duration state with the actual audio duration
        setDuration(audioRef.current.duration);
        setAudioError(null);
        setUsingAnimationFallback(false);
      }
    };
    
    const handleAudioError = (e: Event) => {
      console.error('Audio element error:', e);
      setAudioError('Er is een probleem met het afspelen. Animatiemodus wordt gebruikt.');
      setUsingAnimationFallback(true);
    };
    
    // Add event listeners to audio element
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('error', handleAudioError);
    
    // Clean up event listeners
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('error', handleAudioError);
      }
    };
  }, [audioRef.current]);
  
  // Handle animation for time updates when using fallback mode
  useEffect(() => {
    if (isPlaying && usingAnimationFallback) {
      const animate = () => {
        setCurrentTime((prevTime) => {
          // Slow down the animation to match real-time playback
          // Increment by only 0.03 seconds each frame (approximately 1 second real-time per second)
          const newTime = prevTime + 0.03;
          
          // For premium content, restrict playback to 30 seconds for free users
          if (featuredSong?.isPremium && !isSubscribed && newTime >= 30) {
            return 30;
          }
          
          // Loop back to beginning when reaching the end
          return newTime >= duration ? 0 : newTime;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
      
      // Clean up animation on unmount or when stopped
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    } else if (animationRef.current) {
      // Cancel animation if not playing or not using fallback
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isPlaying, usingAnimationFallback, duration, isSubscribed, featuredSong]);
  
  // Update lyrics based on current time
  useEffect(() => {
    const findCurrentLyric = () => {
      if (!featuredSong || !featuredSong.lyrics) return;
      
      const lyrics = featuredSong.lyrics;
      
      const currentIndex = lyrics.findIndex(
        (lyric, index) => 
          currentTime >= lyric.time && 
          (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time)
      );
      
      if (currentIndex !== -1) {
        setCurrentLyric(lyrics[currentIndex].text);
        
        if (currentIndex < lyrics.length - 1) {
          setNextLyric(lyrics[currentIndex + 1].text);
        } else {
          setNextLyric('');
        }
      } else {
        setCurrentLyric('');
        if (lyrics.length > 0) {
          setNextLyric(lyrics[0].text);
        }
      }
    };
    
    findCurrentLyric();
  }, [currentTime, featuredSong]);
  
  // Check for premium content restriction
  useEffect(() => {
    if (featuredSong?.isPremium && !isSubscribed && currentTime >= 30 && !isRestricted) {
      setIsPlaying(false);
      setIsRestricted(true);
      setShowPremiumDialog(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentTime, isSubscribed, isRestricted, featuredSong]);
  
  // Helper function to get the audio source URL
  const getAudioSourceUrl = () => {
    if (!featuredSong?.id) return '';
    
    // Use the direct stream endpoint for the song
    return `/api/songs/stream/${featuredSong.id}`;
  };
  
  // Player controls
  const togglePlayPause = () => {
    // Don't allow play to resume if the song is restricted
    if (featuredSong?.isPremium && !isSubscribed && currentTime >= 30) {
      setShowPremiumDialog(true);
      return;
    }
    
    // Actually play or pause the audio element
    if (!isPlaying) {
      setIsPlaying(true);
      
      if (audioRef.current && !usingAnimationFallback) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing audio:", error);
            setUsingAnimationFallback(true);
          });
        }
      }
    } else {
      setIsPlaying(false);
      
      if (audioRef.current && !usingAnimationFallback) {
        audioRef.current.pause();
      }
    }
  };
  
  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    
    // Don't allow seeking past 30 seconds for premium content if not subscribed
    if (featuredSong?.isPremium && !isSubscribed && newTime > 30) {
      setCurrentTime(30);
      if (audioRef.current) {
        audioRef.current.currentTime = 30;
      }
      setIsRestricted(true);
      setShowPremiumDialog(true);
      return;
    }
    
    // Update the audio element's current time
    setCurrentTime(newTime);
    if (audioRef.current && !usingAnimationFallback) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
      }
    } else {
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };

  // Try again with audio playback
  const handleRetryAudio = () => {
    if (usingAnimationFallback && featuredSong?.id) {
      setAudioError(null);
      setUsingAnimationFallback(false);
      
      // Force reload the audio element
      if (audioRef.current) {
        const wasPlaying = isPlaying;
        audioRef.current.src = getAudioSourceUrl();
        audioRef.current.load();
        
        if (wasPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise) {
            playPromise.catch(() => {
              setUsingAnimationFallback(true);
              setAudioError('Kan audio niet afspelen. Animatiemodus wordt gebruikt.');
            });
          }
        }
      }
    }
  };
  
  const handleUpgradeClick = () => {
    setShowPremiumDialog(false);
    router.push('/abonnement');
  };
  
  // Format time for display (e.g., 01:23)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-md">
        <CardContent className="p-6 flex justify-center items-center" style={{ height: '300px' }}>
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Muziek laden...</span>
        </CardContent>
      </Card>
    );
  }

  if (!featuredSong) {
    return (
      <Card className="w-full shadow-md">
        <CardContent className="p-6 flex justify-center items-center" style={{ height: '300px' }}>
          <p>Geen muziek beschikbaar. Probeer het later nog eens.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Art */}
            <div className="w-full md:w-48 h-48 rounded-md overflow-hidden relative flex-shrink-0">
              <img 
                src={featuredSong.coverArtUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'} 
                alt={`${featuredSong.title} - ${featuredSong.artist}`}
                className="w-full h-full object-cover"
              />
              {featuredSong.isPremium && (
                <Badge className="absolute top-2 right-2 bg-yellow-500/80 hover:bg-yellow-500">
                  Premium
                </Badge>
              )}
            </div>
            
            {/* Player Controls */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{featuredSong.title}</h2>
                  {featuredSong.isPremium && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{featuredSong.artist}</p>
                {featuredSong.album && (
                  <p className="text-sm text-muted-foreground">Album: {featuredSong.album}</p>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 space-y-2">
                <Slider 
                  value={[currentTime]} 
                  max={duration} 
                  step={0.1} 
                  onValueChange={handleTimeChange}
                  className="w-full"
                  disabled={isRestricted}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                {featuredSong.isPremium && !isSubscribed && (
                  <div className="text-xs text-amber-600 flex items-center gap-1">
                    <Lock size={12} />
                    {isRestricted ? 
                      "Je gratis proefperiode van 30 seconden is voorbij. Upgrade voor volledige toegang." :
                      "Gratis gebruikers kunnen slechts 30 seconden luisteren."
                    }
                  </div>
                )}
              </div>
              
              {/* Error Message */}
              {audioError && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{audioError}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto" 
                    onClick={handleRetryAudio}
                  >
                    Opnieuw proberen
                  </Button>
                </div>
              )}
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mt-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Shuffle size={20} />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <SkipBack size={20} />
                </Button>
                
                <Button 
                  onClick={togglePlayPause} 
                  className={cn(
                    "h-12 w-12 rounded-full",
                    isRestricted ? "bg-muted" : "bg-primary"
                  )}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  disabled={isRestricted}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                </Button>
                
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <SkipForward size={20} />
                </Button>
                
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Repeat size={20} />
                </Button>
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center gap-2 mt-4">
                <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground hover:text-foreground">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Slider 
                  value={[volume]} 
                  max={1} 
                  step={0.01} 
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>
          </div>
          
          {/* Lyrics Display */}
          <div className="mt-8 p-4 rounded-md bg-accent/50">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Songtekst</h3>
            <div className="space-y-4 text-center">
              {nextLyric && (
                <p className="text-muted-foreground text-sm transition-all">
                  {nextLyric}
                </p>
              )}
              
              <p className={cn(
                "text-lg font-semibold transition-all", 
                isPlaying && "animate-pulse"
              )}>
                {currentLyric || "♪ ♫ ♪ ♫"}
              </p>
            </div>
          </div>
          
          {/* Audio Mode Display */}
          <div className="mt-4 text-xs text-muted-foreground flex justify-between items-center">
            <span>Speelduur: {formatTime(duration)}</span>
            <div className="flex items-center gap-1">
              <span>Audio modus:</span>
              {usingAnimationFallback ? (
                <Badge variant="outline" className="text-blue-500 border-blue-500">Animatie (Zonder geluid)</Badge>
              ) : (
                <Badge variant="outline" className="text-green-500 border-green-500">Audio Stream</Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Audio element */}
        <audio 
          ref={audioRef} 
          preload="metadata"
          src={getAudioSourceUrl()}
        />
      </Card>
      
      {/* Premium upgrade dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade naar Premium</DialogTitle>
            <DialogDescription>
              Je hebt de 30 seconden gratis luistertijd voor dit nummer bereikt.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-md">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 rounded-full p-2 text-yellow-600">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Premium Content</h4>
                <p className="text-sm text-muted-foreground">
                  Dit nummer vereist een premium abonnement om het volledig te beluisteren.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Gratis plan:</p>
                <ul className="list-disc list-inside text-muted-foreground text-xs">
                  <li>30 seconden preview van premium nummers</li>
                  <li>Toegang tot gratis nummers</li>
                  <li>320kbps geluidskwaliteit</li>
                </ul>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-medium">Premium plan:</p>
                <ul className="list-disc list-inside text-muted-foreground text-xs">
                  <li>Onbeperkte toegang tot alle nummers</li>
                  <li>320kbps geluidskwaliteit</li>
                  <li>Offline luisteren</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Annuleren
            </Button>
            <Button onClick={handleUpgradeClick}>
              Upgrade naar Premium (€6,05/maand)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MusicPlayer;