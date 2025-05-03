'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Mock data structure for genres, organized by category
const genreCategories = [
  {
    id: 'popular',
    name: 'Populair',
    genres: [
      {
        id: 'pop',
        name: 'Pop',
        songCount: 120,
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'rock',
        name: 'Rock',
        songCount: 95,
        imageUrl: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'hiphop',
        name: 'Hip-Hop',
        songCount: 87,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'electronic',
        name: 'Electronic',
        songCount: 76,
        imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'mood',
    name: 'Stemming',
    genres: [
      {
        id: 'relaxing',
        name: 'Ontspannend',
        songCount: 68,
        imageUrl: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'party',
        name: 'Feest',
        songCount: 55,
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5463805?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'focus',
        name: 'Concentratie',
        songCount: 42,
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'workout',
        name: 'Workout',
        songCount: 38,
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'decades',
    name: 'Decennia',
    genres: [
      {
        id: '80s',
        name: '80s',
        songCount: 45,
        imageUrl: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: '90s',
        name: '90s',
        songCount: 58,
        imageUrl: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: '2000s',
        name: '2000s',
        songCount: 72,
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: '2010s',
        name: '2010s',
        songCount: 84,
        imageUrl: 'https://images.unsplash.com/photo-1604159332146-30027f7f99ae?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'special',
    name: 'Speciaal',
    genres: [
      {
        id: 'dutch',
        name: 'Nederlandse Muziek',
        songCount: 63,
        imageUrl: 'https://images.unsplash.com/photo-1536632901336-0a652c05a0d1?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'classical',
        name: 'Klassiek',
        songCount: 42,
        imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'jazz',
        name: 'Jazz',
        songCount: 37,
        imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 'world',
        name: 'Wereldmuziek',
        songCount: 29,
        imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
];

export const GenreCollections = () => {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="popular" onValueChange={setActiveCategory}>
        <TabsList className="bg-background mb-6">
          {genreCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-secondary"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {genreCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.genres.map((genre) => (
                <Link 
                  href={`/genres/${genre.id}`} 
                  key={genre.id}
                  className={cn(
                    "block",
                    hoveredGenre === genre.id ? "" : ""
                  )}
                >
                  <Card 
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all duration-300 h-full",
                      hoveredGenre === genre.id ? "shadow-lg ring-2 ring-primary/50" : "shadow-md"
                    )}
                    onMouseEnter={() => setHoveredGenre(genre.id)}
                    onMouseLeave={() => setHoveredGenre(null)}
                  >
                    <div className="relative h-36 w-full">
                      <Image 
                        src={genre.imageUrl}
                        alt={genre.name}
                        fill
                        className={cn(
                          "object-cover transition-transform duration-500",
                          hoveredGenre === genre.id ? "scale-110" : "scale-100"
                        )}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div 
                        className={cn(
                          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
                          hoveredGenre === genre.id ? "opacity-100" : "opacity-80"
                        )}
                      />
                    </div>
                    
                    <CardContent className="p-4 relative">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{genre.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {genre.songCount} nummers
                        </p>
                      </div>
                      
                      <Badge 
                        className={cn(
                          "absolute top-0 right-4 -translate-y-1/2 transition-opacity",
                          hoveredGenre === genre.id ? "opacity-100" : "opacity-70"
                        )}
                        variant="secondary"
                      >
                        Bekijk
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GenreCollections;