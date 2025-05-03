import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutCompany from "@/components/over/AboutCompany";
import MissionValues from "@/components/over/MissionValues";
import TeamMembers from "@/components/over/TeamMembers";
import FrequentlyAskedQuestions from "@/components/over/FrequentlyAskedQuestions";

export const metadata: Metadata = {
  title: "Over Bitzomax | Bitzomax",
  description: "Leer meer over Bitzomax, onze missie, het team en vind antwoorden op veelgestelde vragen.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Over Ons</h1>
        <p className="text-muted-foreground">
          Ontdek meer over Bitzomax, onze missie en het team achter de muziek
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="company">Ons bedrijf</TabsTrigger>
          <TabsTrigger value="mission">Missie & waarden</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="faq">Veelgestelde vragen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <AboutCompany />
        </TabsContent>
        
        <TabsContent value="mission">
          <MissionValues />
        </TabsContent>
        
        <TabsContent value="team">
          <TeamMembers />
        </TabsContent>
        
        <TabsContent value="faq">
          <FrequentlyAskedQuestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}