import GenreCollections from "@/components/genres/GenreCollections";

export const metadata = {
  title: 'Genres | BitZoMax',
  description: 'Ontdek muziek op BitZoMax door genres te verkennen',
};

export default function GenresPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Genres</h1>
        <p className="text-lg text-muted-foreground">
          Ontdek nieuwe muziek door verschillende genres te verkennen
        </p>
      </section>

      <section>
        <GenreCollections />
      </section>
    </div>
  );
}