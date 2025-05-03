'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const values = [
  {
    title: "Innovatie",
    description: "We streven ernaar om continu te innoveren en de muziekervaring naar een hoger niveau te tillen.",
    icon: "💡",
  },
  {
    title: "Toegankelijkheid",
    description: "We geloven dat muziek voor iedereen toegankelijk moet zijn, ongeacht waar je bent of wie je bent.",
    icon: "🌍",
  },
  {
    title: "Kwaliteit",
    description: "We bieden alleen de hoogste geluidskwaliteit en een uitgebreide catalogus van muziek.",
    icon: "✨",
  },
  {
    title: "Gemeenschap",
    description: "We bouwen aan een gemeenschap van muziekliefhebbers die hun passie voor muziek kunnen delen.",
    icon: "👥",
  },
  {
    title: "Duurzaamheid",
    description: "We zetten ons in voor een duurzame toekomst en minimaliseren onze ecologische voetafdruk.",
    icon: "🌱",
  },
  {
    title: "Respect",
    description: "We respecteren artiesten en hun werk, en zorgen ervoor dat ze eerlijk worden beloond.",
    icon: "🎵",
  },
];

export default function MissionValues() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Onze missie</h2>
        <p className="text-lg mb-6">
          Bij Bitzomax is onze missie om muziek toegankelijker te maken voor iedereen en om de manier
          waarop mensen muziek ontdekken, beluisteren en delen te revolutioneren. We streven ernaar
          om artiesten en luisteraars met elkaar te verbinden via een platform dat eenvoudig te gebruiken,
          van hoge kwaliteit en betaalbaar is.
        </p>
        <blockquote className="pl-6 border-l-4 border-primary italic my-6">
          &ldquo;Muziek verbindt mensen over de hele wereld. Onze droom is om die verbinding nog
          sterker te maken door middel van technologie.&rdquo;
          <footer className="text-sm mt-2 font-medium">— David Jensen, Oprichter</footer>
        </blockquote>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Onze waarden</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <div className="text-3xl">{value.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted/40 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Onze doelstellingen</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>Korte termijn</span>
              <Badge>2025-2026</Badge>
            </h3>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Uitbreiden van onze muziekcollectie met 1 miljoen nieuwe nummers</li>
              <li>Introductie van gepersonaliseerde aanbevelingsalgoritmen</li>
              <li>Verbetering van de gebruikerservaring op alle platforms</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>Middellange termijn</span>
              <Badge>2027-2028</Badge>
            </h3>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Uitbreiding naar 10 nieuwe markten wereldwijd</li>
              <li>Integratie met andere multimedia-platforms</li>
              <li>Lancering van ons artiestenondersteuningsprogramma</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>Lange termijn</span>
              <Badge>2029+</Badge>
            </h3>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Innoveren in de manier waarop mensen muziek ervaren</li>
              <li>Wereldwijd marktleiderschap in muziekstreaming</li>
              <li>Ontwikkeling van nieuwe technologieën voor muziekproductie en -consumptie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}