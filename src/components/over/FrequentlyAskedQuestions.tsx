'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const faqCategories = [
  {
    category: "Algemeen",
    questions: [
      {
        question: "Wat is Bitzomax?",
        answer: "Bitzomax is een muziekstreamingplatform waar je naar miljoenen nummers kunt luisteren, afspeellijsten kunt maken en muziek kunt ontdekken. We bieden verschillende abonnementen aan, van gratis tot premium, zodat iedereen kan genieten van muziek op zijn of haar eigen manier."
      },
      {
        question: "Hoe kan ik een account aanmaken?",
        answer: "Je kunt eenvoudig een account aanmaken door naar de aanmeldpagina te gaan en je e-mailadres in te vullen, of door je aan te melden met je Google, Facebook of Apple account. Volg de instructies op het scherm om je registratie te voltooien."
      },
      {
        question: "Is Bitzomax beschikbaar in mijn land?",
        answer: "Bitzomax is momenteel beschikbaar in de meeste Europese landen, Noord-Amerika, en delen van Azië en Oceanië. We werken er hard aan om onze service wereldwijd beschikbaar te maken. Bekijk onze beschikbaarheidslijst voor de meest recente informatie."
      }
    ]
  },
  {
    category: "Abonnementen",
    questions: [
      {
        question: "Welke abonnementen biedt Bitzomax aan?",
        answer: "We bieden drie soorten abonnementen: Gratis (met advertenties), Premium (individueel abonnement zonder advertenties) en Familie (tot 6 accounts onder één dak). Elk abonnement heeft verschillende functies en prijzen. Bekijk onze abonnementenpagina voor meer details."
      },
      {
        question: "Kan ik mijn abonnement op elk moment opzeggen?",
        answer: "Ja, je kunt je betaalde abonnement op elk moment opzeggen. Je kunt blijven genieten van je premium functies tot het einde van je huidige factureringsperiode. Daarna wordt je account automatisch omgezet naar een gratis account."
      },
      {
        question: "Hoe werkt het Familie-abonnement?",
        answer: "Met het Familie-abonnement kunnen tot 6 personen die op hetzelfde adres wonen genieten van premium functies voor één maandelijkse prijs. Elke gebruiker krijgt zijn eigen account met persoonlijke aanbevelingen, afspeellijsten en opgeslagen muziek."
      }
    ]
  },
  {
    category: "Gebruik",
    questions: [
      {
        question: "Kan ik muziek downloaden om offline te luisteren?",
        answer: "Ja, met een Premium of Familie-abonnement kun je nummers, albums en afspeellijsten downloaden om offline te luisteren. Je kunt tot 10.000 nummers op maximaal 5 apparaten downloaden."
      },
      {
        question: "Hoe maak ik een afspeellijst?",
        answer: "Om een afspeellijst te maken, klik je op 'Bibliotheek' in de zijbalk en selecteer je 'Afspeellijst maken'. Geef je afspeellijst een naam en begin met het toevoegen van nummers. Je kunt ook nummers direct naar een afspeellijst slepen, of op de drie puntjes naast een nummer klikken en 'Toevoegen aan afspeellijst' selecteren."
      },
      {
        question: "Hoe kan ik de geluidskwaliteit aanpassen?",
        answer: "Je kunt de geluidskwaliteit aanpassen in de instellingen van je account. Premium-gebruikers hebben toegang tot hogere geluidskwaliteit (tot 256kbps), terwijl gebruikers met een gratis account beperkt zijn tot standaardkwaliteit (128kbps)."
      }
    ]
  },
  {
    category: "Technisch",
    questions: [
      {
        question: "Op welke apparaten kan ik Bitzomax gebruiken?",
        answer: "Bitzomax is beschikbaar op diverse apparaten zoals smartphones (iOS en Android), tablets, desktops (Windows, macOS, Linux), Smart TV's, gaming consoles, en sommige slimme luidsprekers en auto-entertainmentsystemen."
      },
      {
        question: "Hoeveel data gebruikt Bitzomax?",
        answer: "Het dataverbruik hangt af van de geselecteerde geluidskwaliteit. Bij standaardkwaliteit (128kbps) verbruik je ongeveer 60MB per uur, bij hoge kwaliteit (256kbps) ongeveer 120MB per uur. Je kunt in de instellingen kiezen om alleen via wifi te streamen om mobiele data te besparen."
      },
      {
        question: "Wat moet ik doen als de app crasht of niet werkt?",
        answer: "Als je problemen ondervindt met de Bitzomax-app, probeer dan eerst de app opnieuw te starten. Als dat niet helpt, controleer of je de nieuwste versie gebruikt, of probeer de app opnieuw te installeren. Als het probleem aanhoudt, neem dan contact op met onze klantenservice via de helppagina."
      }
    ]
  },
];

export default function FrequentlyAskedQuestions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqCategories);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredFAQs(faqCategories);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = faqCategories.map(category => {
      return {
        category: category.category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(query) || 
          q.answer.toLowerCase().includes(query)
        )
      };
    }).filter(category => category.questions.length > 0);
    
    setFilteredFAQs(filtered);
  };
  
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Veelgestelde vragen</h2>
        <p className="text-lg mb-6">
          Vind antwoorden op de meest voorkomende vragen over Bitzomax, onze diensten en features.
          Kan je het antwoord op je vraag niet vinden? Neem dan contact op met onze klantenservice.
        </p>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Zoek in veelgestelde vragen..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Zoeken</Button>
        </form>
      </div>

      {filteredFAQs.length > 0 ? (
        filteredFAQs.map((category, categoryIndex) => (
          category.questions.length > 0 && (
            <div key={categoryIndex} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )
        ))
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">Geen resultaten gevonden</h3>
          <p className="text-muted-foreground mt-2">
            Probeer andere zoektermen of bekijk alle veelgestelde vragen.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery('');
              setFilteredFAQs(faqCategories);
            }}
          >
            Alle vragen tonen
          </Button>
        </div>
      )}

      <div className="bg-muted/40 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Nog steeds vragen?</h3>
        <p className="mb-4">
          Kan je het antwoord op je vraag niet vinden? Ons klantenserviceteam staat klaar om je te helpen.
        </p>
        <Button>Contact opnemen</Button>
      </div>
    </div>
  );
}