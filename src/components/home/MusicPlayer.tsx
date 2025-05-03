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
  Lock
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/lib/subscription-context';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

// Mock data for a sample song with lyrics
const sampleSong = {
  id: 1,
  title: 'Zomernachten',
  artist: 'Lisa de Jong',
  audioUrl: '/music/sample.mp3', // This would be a real audio file in production
  coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
  isPremium: true, // Added premium flag
  lyrics: [
    { time: 0, text: 'Wacht op het juiste moment...' },
    { time: 5, text: 'De zon zakt in de zee' },
    { time: 10, text: 'Zomernachten zijn voor jou en mij' },
    { time: 15, text: 'Warme wind streelt onze huid' },
    { time: 20, text: 'Onder de sterrenhemel' },
    { time: 25, text: 'Dansen we tot de ochtend komt' },
    { time: 30, text: 'Deze nacht lijkt eindeloos' },
    { time: 35, text: 'Zomernachten, zomernachten' },
    { time: 40, text: 'Voor altijd in mijn hart' },
  ]
};

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
  
  // Use subscription context
  const { isSubscribed } = useSubscription();
  const router = useRouter();
  
  // Flag to track if the song has been restricted
  const [isRestricted, setIsRestricted] = useState(false);
  
  // References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // For demonstration, since we don't have real audio files
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Simulate a song duration
      setDuration(90);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [volume]);
  
  // Update lyrics based on current time
  useEffect(() => {
    const findCurrentLyric = () => {
      const currentIndex = sampleSong.lyrics.findIndex(
        (lyric, index) => 
          currentTime >= lyric.time && 
          (index === sampleSong.lyrics.length - 1 || currentTime < sampleSong.lyrics[index + 1].time)
      );
      
      if (currentIndex !== -1) {
        setCurrentLyric(sampleSong.lyrics[currentIndex].text);
        
        if (currentIndex < sampleSong.lyrics.length - 1) {
          setNextLyric(sampleSong.lyrics[currentIndex + 1].text);
        } else {
          setNextLyric('');
        }
      } else {
        setCurrentLyric('');
        if (sampleSong.lyrics.length > 0) {
          setNextLyric(sampleSong.lyrics[0].text);
        }
      }
    };
    
    findCurrentLyric();
  }, [currentTime]);
  
  // Check for premium content restriction
  useEffect(() => {
    if (sampleSong.isPremium && !isSubscribed && currentTime >= 30 && !isRestricted) {
      setIsPlaying(false);
      setIsRestricted(true);
      setShowPremiumDialog(true);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [currentTime, isSubscribed, isRestricted]);
  
  // Animation for time update in demo mode
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1;
          
          // For premium content, restrict playback to 30 seconds for free users
          if (sampleSong.isPremium && !isSubscribed && newTime >= 30) {
            return 30;
          }
          
          return newTime >= duration ? 0 : newTime;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration, isSubscribed]);
  
  // Player controls
  const togglePlayPause = () => {
    // Don't allow play to resume if the song is restricted
    if (sampleSong.isPremium && !isSubscribed && currentTime >= 30) {
      setShowPremiumDialog(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    
    // Don't allow seeking past 30 seconds for premium content if not subscribed
    if (sampleSong.isPremium && !isSubscribed && newTime > 30) {
      setCurrentTime(30);
      setIsRestricted(true);
      setShowPremiumDialog(true);
      return;
    }
    
    setCurrentTime(newTime);
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
  
  return (
    <>
      <Card className="w-full shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Art */}
            <div className="w-full md:w-48 h-48 rounded-md overflow-hidden relative flex-shrink-0">
              <img 
                src={sampleSong.coverUrl} 
                alt={`${sampleSong.title} - ${sampleSong.artist}`}
                className="w-full h-full object-cover"
              />
              {sampleSong.isPremium && (
                <Badge className="absolute top-2 right-2 bg-yellow-500/80 hover:bg-yellow-500">
                  Premium
                </Badge>
              )}
            </div>
            
            {/* Player Controls */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{sampleSong.title}</h2>
                  {sampleSong.isPremium && (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{sampleSong.artist}</p>
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
                {sampleSong.isPremium && !isSubscribed && (
                  <div className="text-xs text-amber-600 flex items-center gap-1">
                    <Lock size={12} />
                    {isRestricted ? 
                      "Je gratis proefperiode van 30 seconden is voorbij. Upgrade voor volledige toegang." :
                      "Gratis gebruikers kunnen slechts 30 seconden luisteren."
                    }
                  </div>
                )}
              </div>
              
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
        </CardContent>
        
        {/* Audio element - would use real audio in production */}
        <audio ref={audioRef} preload="metadata">
          <source src={sampleSong.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
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