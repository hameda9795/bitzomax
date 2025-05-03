'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  HeartHandshake, 
  Music2, 
  Users2, 
  Shield, 
  Lightbulb, 
  RefreshCw 
} from 'lucide-react';

const OurMission = () => {
  return (
    <div className="space-y-8">
      {/* Mission & Vision */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg">
          <div className="aspect-video relative">
            <Image 
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1920&auto=format&fit=crop" 
              alt="Muziek studio" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-2xl font-semibold">Onze missie</h3>
            </div>
            <p className="text-muted-foreground">
              Bij Bitzomax streven we ernaar om muziek toegankelijk te maken voor iedereen in Nederland, 
              met speciale aandacht voor lokale artiesten en genres die de Nederlandse cultuur 
              weerspiegelen. We willen een platform zijn dat niet alleen internationale hits aanbiedt, 
              maar ook een podium biedt voor opkomende Nederlandse muzikanten.
            </p>
            <p className="text-muted-foreground">
              Onze missie is om een naadloze en persoonlijke luisterervaring te creëren die aansluit bij 
              de unieke voorkeuren van de Nederlandse luisteraar, en tegelijkertijd een eerlijk verdienmodel 
              te bieden voor artiesten.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-primary mr-2" />
              <h3 className="text-2xl font-semibold">Onze visie</h3>
            </div>
            <p className="text-muted-foreground">
              We zien een toekomst waarin Bitzomax de eerste keus is voor Nederlanders om muziek te 
              ontdekken, te delen en ervan te genieten. Een platform dat niet alleen volgt, maar ook 
              toonaangevend is in technologische innovatie binnen de muziekindustrie.
            </p>
            <p className="text-muted-foreground">
              We streven ernaar om de kloof tussen artiesten en luisteraars te verkleinen, door een 
              directere band te creëren en nieuwe vormen van interactie mogelijk te maken. Onze visie 
              omvat een ecosysteem waarin zowel gevestigde als opkomende artiesten kunnen floreren.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <div className="flex items-center">
          <HeartHandshake className="h-6 w-6 text-primary mr-2" />
          <h3 className="text-2xl font-semibold">Onze kernwaarden</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6 space-y-2">
              <Music2 className="h-8 w-8 text-primary" />
              <h4 className="text-lg font-medium">Muzikale diversiteit</h4>
              <p className="text-sm text-muted-foreground">
                We omarmen alle genres en stimuleren muzikale ontdekking over de volle breedte van het spectrum.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 space-y-2">
              <Users2 className="h-8 w-8 text-primary" />
              <h4 className="text-lg font-medium">Gebruikersgemak</h4>
              <p className="text-sm text-muted-foreground">
                We streven naar een intuïtieve, toegankelijke ervaring die aansluit bij de behoeften van onze gebruikers.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 space-y-2">
              <Shield className="h-8 w-8 text-primary" />
              <h4 className="text-lg font-medium">Betrouwbaarheid</h4>
              <p className="text-sm text-muted-foreground">
                We bieden een stabiel platform met sterke privacy-bescherming en respect voor gebruikersgegevens.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 space-y-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h4 className="text-lg font-medium">Innovatie</h4>
              <p className="text-sm text-muted-foreground">
                We blijven voortdurend vernieuwen om voorop te lopen in technologie en gebruikerservaring.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sustainability */}
      <div className="bg-muted p-8 rounded-lg space-y-6">
        <div className="flex items-center">
          <RefreshCw className="h-6 w-6 text-primary mr-2" />
          <h3 className="text-2xl font-semibold">Duurzaamheid & Maatschappelijke Verantwoordelijkheid</h3>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">
              Bij Bitzomax nemen we onze maatschappelijke verantwoordelijkheid serieus. We streven ernaar om onze 
              ecologische voetafdruk te minimaliseren door energie-efficiënte datacenters te gebruiken en 
              te investeren in hernieuwbare energiebronnen.
            </p>
            <p className="mt-3 text-muted-foreground">
              Daarnaast ondersteunen we diverse muzikale opleidingsprogramma's in Nederland en bieden we 
              mentorschap aan voor jonge, getalenteerde artiesten uit achtergestelde gemeenschappen.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Onze duurzaamheidsinitiatieven:</h4>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>100% CO2-neutrale streaming door compensatie via gecertificeerde projecten</li>
              <li>Jaarlijkse bijdrage aan Nederlandse muziekonderwijsprogramma's</li>
              <li>Partnerschap met MuziekStart voor het ondersteunen van jonge muzikanten</li>
              <li>Aandacht voor mentale gezondheid binnen de muziekindustrie via ons platform MindBeat</li>
              <li>Eerlijke vergoedingsmodellen voor artiesten die boven het industrie-gemiddelde liggen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;