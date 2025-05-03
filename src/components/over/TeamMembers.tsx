'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "David Jensen",
    role: "Oprichter & CEO",
    bio: "David heeft meer dan 15 jaar ervaring in de muziekindustrie en heeft voorheen gewerkt bij grote technologiebedrijven.",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&auto=format&fit=crop&q=80",
    initials: "DJ",
    email: "david@bitzomax.com",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
  },
  {
    name: "Sophie van der Meer",
    role: "Chief Product Officer",
    bio: "Sophie heeft een achtergrond in UX-design en is verantwoordelijk voor de gebruikerservaring van Bitzomax.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80",
    initials: "SM",
    email: "sophie@bitzomax.com",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
  },
  {
    name: "Mark Jansen",
    role: "CTO",
    bio: "Mark heeft meer dan 10 jaar ervaring in het bouwen van schaalbare technische infrastructuren.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&auto=format&fit=crop&q=80",
    initials: "MJ",
    email: "mark@bitzomax.com",
    linkedin: "https://linkedin.com/in/",
    github: "https://github.com/",
  },
  {
    name: "Lena Bakker",
    role: "Hoofd Content Partnerships",
    bio: "Lena werkt samen met artiesten en labels om de beste muziekcatalogus voor onze gebruikers te bouwen.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80",
    initials: "LB",
    email: "lena@bitzomax.com",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
  },
  {
    name: "Thomas de Vries",
    role: "Lead Developer",
    bio: "Thomas is verantwoordelijk voor de technische ontwikkeling van onze web- en mobiele applicaties.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80",
    initials: "TV",
    email: "thomas@bitzomax.com",
    github: "https://github.com/",
  },
  {
    name: "Anna Pietersen",
    role: "Marketing Director",
    bio: "Anna heeft een passie voor muziek en meer dan 8 jaar ervaring in digitale marketing.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&q=80",
    initials: "AP",
    email: "anna@bitzomax.com",
    linkedin: "https://linkedin.com/in/",
    twitter: "https://twitter.com/",
  },
];

export default function TeamMembers() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Ons team</h2>
        <p className="text-lg mb-6">
          Maak kennis met de mensen achter Bitzomax. Ons team bestaat uit gepassioneerde muziekliefhebbers
          en technologie-experts die samenwerken om de beste muziekervaring te creëren.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{member.bio}</p>
              
              <div className="flex flex-wrap gap-2">
                {member.email && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`}>
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`}>
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {member.github && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`}>
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/40 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Word lid van ons team</h2>
        <p className="mb-4">
          We zijn altijd op zoek naar getalenteerde mensen die onze passie voor muziek en technologie delen.
          Bekijk onze openstaande vacatures of neem contact met ons op.
        </p>
        <Button>Bekijk onze vacatures</Button>
      </div>
    </div>
  );
}