'use client';

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, Clock, MessagesSquare, Users2 } from 'lucide-react';

// Company team members data
const teamMembers = [
  {
    name: 'Emma van der Berg',
    role: 'CEO & Oprichter',
    bio: 'Emma richtte Bitzomax op in 2020 met een visie om muziekstreaming toegankelijker en persoonlijker te maken. Met 15 jaar ervaring in de muziekindustrie leidt ze het bedrijf naar nieuwe hoogten.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Thomas de Vries',
    role: 'CTO',
    bio: 'Als technologisch expert zorgt Thomas dat het platform van Bitzomax altijd voorop loopt met de nieuwste innovaties. Hij heeft eerder leidende rollen gehad bij meerdere tech-startups.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Sophie Jansen',
    role: 'Hoofd Content',
    bio: 'Sophie werkt nauw samen met artiesten en platenlabels om de beste muziekcollectie samen te stellen. Haar achtergrond in de muziekjournalistiek geeft haar een uniek perspectief.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop',
  },
  {
    name: 'Noah Bakker',
    role: 'Hoofd Design',
    bio: 'Noah zorgt voor de visuele identiteit en gebruikerservaring van Bitzomax. Met zijn creatieve benadering maakt hij het platform intuïtief en aantrekkelijk voor alle gebruikers.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
  },
];

// Company milestones data
const milestones = [
  {
    year: '2020',
    title: 'Oprichting van Bitzomax',
    description: 'Bitzomax wordt opgericht met de visie om muziekstreaming persoonlijker te maken en een betere ervaring te bieden voor muziekliefhebbers.',
  },
  {
    year: '2021',
    title: 'Lancering van het platform',
    description: 'Het eerste Bitzomax platform wordt gelanceerd met innovatieve functies zoals AI-gestuurde aanbevelingen en een uniek audiokwaliteitssysteem.',
  },
  {
    year: '2022',
    title: 'Eerste miljoen gebruikers',
    description: 'Bitzomax bereikt de mijlpaal van één miljoen actieve gebruikers en breidt uit naar meerdere Europese landen.',
  },
  {
    year: '2023',
    title: 'Innovatie Award',
    description: 'Onze technologie voor gepersonaliseerde muziekaanbevelingen wint de prestigieuze Tech Music Innovation Award.',
  },
  {
    year: '2024',
    title: 'Lancering mobiele apps',
    description: 'Bitzomax lanceert volledig vernieuwde mobiele apps met offline luistermogelijkheden en verbeterde gebruikerservaring.',
  },
  {
    year: '2025',
    title: 'Internationale expansie',
    description: 'Uitbreiding naar Noord-Amerika en Azië, met lokaal aangepaste content en samenwerkingen met regionale artiesten.',
  },
];

export const AboutCompany = () => {
  return (
    <div className="space-y-12">
      {/* Company Overview Section */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ons Verhaal</h2>
            <p className="text-muted-foreground">
              Bitzomax ontstond uit een passie voor muziek en technologie. We geloven dat muziek een persoonlijke ervaring moet zijn, 
              perfect afgestemd op jouw smaak en stemming. Onze oprichters, zelf fervent muziekliefhebbers, 
              wilden een platform creëren dat verder gaat dan alleen het afspelen van nummers.
            </p>
            <p className="text-muted-foreground">
              Vandaag zijn we een team van meer dan 50 gepassioneerde mensen die werken aan het verbeteren van jouw muziekervaring. 
              Met geavanceerde AI-technologie, hoge geluidskwaliteit en een gebruiksvriendelijke interface 
              willen we de manier waarop je naar muziek luistert veranderen.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">1.5M+</p>
                  <p className="text-sm text-muted-foreground">Gebruikers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Kantoren</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessagesSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">10M+</p>
                  <p className="text-sm text-muted-foreground">Gesprekken</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">5+ jaar</p>
                  <p className="text-sm text-muted-foreground">Ervaring</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1559650656-5d1d361ad10e?q=80&w=1200&auto=format&fit=crop" 
              alt="Bitzomax team at work" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Our Team Section */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Ons Team</h2>
          <p className="text-muted-foreground mt-2">
            Maak kennis met de mensen achter Bitzomax die elke dag werken aan een beter muziekplatform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-60">
                <Image 
                  src={member.image} 
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <Separator />
      
      {/* Company History Section */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Onze Geschiedenis</h2>
          <p className="text-muted-foreground mt-2">
            De reis van Bitzomax van begin tot nu
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-border -translate-x-1/2 z-0" />
          
          <div className="space-y-12 relative z-10">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Empty space for alignment on mobile */}
                <div className="hidden md:block md:w-1/2"></div>
                
                {/* Content */}
                <div className="relative md:w-1/2">
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-0 top-0 w-6 h-6 rounded-full bg-primary -translate-x-1/2 md:-translate-x-3" />
                  
                  <Card className={`ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <CardContent className="p-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Separator />
      
      {/* Office Locations Section */}
      <section className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Onze Kantoren</h2>
          <p className="text-muted-foreground mt-2">
            Bezoek ons op een van onze locaties wereldwijd
          </p>
        </div>
        
        <Tabs defaultValue="amsterdam" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="amsterdam">Amsterdam</TabsTrigger>
            <TabsTrigger value="berlin">Berlijn</TabsTrigger>
            <TabsTrigger value="london">Londen</TabsTrigger>
            <TabsTrigger value="paris">Parijs</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="amsterdam" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Hoofdkantoor Amsterdam</h3>
                <p className="text-muted-foreground">
                  Ons hoofdkantoor in het hart van Amsterdam, waar het allemaal begon. 
                  Hier zetelt onze directie en de meeste van onze product- en ontwikkelingsteams.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Adres:</p>
                  <p className="text-muted-foreground">Herengracht 582<br/>1017 CJ Amsterdam<br/>Nederland</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Contact:</p>
                  <p className="text-muted-foreground">+31 20 123 4567<br/>amsterdam@bitzomax.com</p>
                </div>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1576924542622-772281a5c725?q=80&w=800&auto=format&fit=crop"
                  alt="Amsterdam Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="berlin" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Berlijn</h3>
                <p className="text-muted-foreground">
                  Ons kantoor in Berlijn huisvest het marketing- en contentteam dat zich richt op de Duitstalige markt en Centraal-Europa.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Adres:</p>
                  <p className="text-muted-foreground">Friedrichstraße 68<br/>10117 Berlijn<br/>Duitsland</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Contact:</p>
                  <p className="text-muted-foreground">+49 30 987 6543<br/>berlin@bitzomax.com</p>
                </div>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=800&auto=format&fit=crop"
                  alt="Berlin Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="london" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Londen</h3>
                <p className="text-muted-foreground">
                  In Londen bevindt zich ons financiële team en de afdeling die samenwerkt met Britse en internationale artiesten en labels.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Adres:</p>
                  <p className="text-muted-foreground">10 Finsbury Square<br/>London EC2A 1AF<br/>Verenigd Koninkrijk</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Contact:</p>
                  <p className="text-muted-foreground">+44 20 8765 4321<br/>london@bitzomax.com</p>
                </div>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                  alt="London Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="paris" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Parijs</h3>
                <p className="text-muted-foreground">
                  Ons nieuwste kantoor in Parijs werkt aan lokale partnerships en expansie naar Zuid-Europese markten.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Adres:</p>
                  <p className="text-muted-foreground">12 Rue de Rivoli<br/>75004 Parijs<br/>Frankrijk</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Contact:</p>
                  <p className="text-muted-foreground">+33 1 2345 6789<br/>paris@bitzomax.com</p>
                </div>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1550850839-8dc894057385?q=80&w=800&auto=format&fit=crop"
                  alt="Paris Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
};

export default AboutCompany;