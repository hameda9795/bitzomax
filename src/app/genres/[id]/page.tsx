import SongCategories from "@/components/genres/SongCategories";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock genre data to look up genre information
const genreInfo: Record<string, { name: string; description: string }> = {
  pop: {
    name: 'Pop',
    description: 'Populaire muziek met toegankelijke melodieën en ritmes die een breed publiek aanspreken.',
  },
  rock: {
    name: 'Rock',
    description: 'Muziek met krachtige gitaren, drums en vaak emotionele teksten over rebellie en maatschappelijke thema\'s.',
  },
  hiphop: {
    name: 'Hip-Hop',
    description: 'Ritmische muziek met gesproken teksten over persoonlijke ervaringen en maatschappelijke onderwerpen.',
  },
  electronic: {
    name: 'Electronic',
    description: 'Elektronisch geproduceerde muziek met synthesizers en beats, ideaal voor dansen en feesten.',
  },
  jazz: {
    name: 'Jazz',
    description: 'Muziek gekenmerkt door improvisatie, swing en complexe harmonieën en ritmes.',
  },
  classical: {
    name: 'Klassiek',
    description: 'Complexe instrumentale muziek uit de westerse muziektraditie, vaak gespeeld door orkesten.',
  },
  relaxing: {
    name: 'Ontspannend',
    description: 'Rustige, melodische muziek ideaal voor ontspanning en mindfulness.',
  },
  party: {
    name: 'Feest',
    description: 'Energieke muziek met dansbare beats en positieve vibes, perfect voor feesten.',
  },
  focus: {
    name: 'Concentratie',
    description: 'Muziek die helpt bij het concentreren tijdens studie of werk.',
  },
  workout: {
    name: 'Workout',
    description: 'Energieke muziek met motiverende beats om je workout te verbeteren.',
  },
  '80s': {
    name: '80s',
    description: 'Muziek uit de jaren 80, gekenmerkt door synthesizers en elektronische drums.',
  },
  '90s': {
    name: '90s',
    description: 'Muziek uit de jaren 90, met stijlen variërend van grunge en hip-hop tot dance en pop.',
  },
  '2000s': {
    name: '2000s',
    description: 'Muziek uit het eerste decennium van de 21e eeuw, met popmuziek, R&B en opkomende elektronische genres.',
  },
  '2010s': {
    name: '2010s',
    description: 'Recente muziek uit de jaren 2010-2019, met een mix van EDM, pop en hip-hop invloeden.',
  },
  dutch: {
    name: 'Nederlandse Muziek',
    description: 'De beste muziek van Nederlandse artiesten, van pop tot hiphop en dance.',
  },
  world: {
    name: 'Wereldmuziek',
    description: 'Traditionele en moderne muziek uit verschillende culturen over de hele wereld.',
  },
};

interface GenrePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: GenrePageProps) {
  const genreId = params.id;
  const genre = genreInfo[genreId] || { name: 'Onbekend Genre', description: 'Geen beschrijving beschikbaar' };
  
  return {
    title: `${genre.name} | BitZoMax Genres`,
    description: genre.description,
  };
}

export default function GenrePage({ params }: GenrePageProps) {
  const genreId = params.id;
  const genre = genreInfo[genreId] || { name: 'Onbekend Genre', description: 'Geen beschrijving beschikbaar' };
  
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Link href="/genres" className="flex items-center hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Terug naar Genres</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">{genre.name}</h1>
        <p className="text-lg text-muted-foreground">
          {genre.description}
        </p>
      </section>
      
      <Separator />
      
      <section>
        <SongCategories genreId={genreId} />
      </section>
    </div>
  );
}