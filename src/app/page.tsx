import GenreOverview from "@/components/home/GenreOverview";
import MusicPlayer from "@/components/home/MusicPlayer";

export default function Home() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Welkom bij BitZoMax</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Je premium muziek streaming platform met de beste kwaliteit en selectie
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Nu Afspelen</h2>
        <MusicPlayer />
      </section>
      
      <GenreOverview />
    </div>
  );
}
