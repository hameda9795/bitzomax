import MusicCollection from "@/components/bibliotheek/MusicCollection";
import PlaybackHistory from "@/components/bibliotheek/PlaybackHistory";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: 'Bibliotheek | BitZoMax',
  description: 'Jouw muziek collectie en luistergeschiedenis',
};

export default function BibliotheekPage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bibliotheek</h1>
        <p className="text-lg text-muted-foreground">
          Ontdek je opgeslagen muziek en luistergeschiedenis
        </p>
      </section>

      <section>
        <MusicCollection />
      </section>
      
      <Separator className="my-8" />
      
      <section>
        <PlaybackHistory />
      </section>
    </div>
  );
}