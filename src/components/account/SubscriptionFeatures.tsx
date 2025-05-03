'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Check, X, CreditCard, Calendar, Download, ChevronRight, AlertTriangle, Crown, Music } from "lucide-react";
import Link from "next/link";
import { useSubscription } from '@/lib/subscription-context';

// Mock data for subscription plans
const plans = [
  {
    id: 'free',
    name: 'Gratis',
    price: '€0',
    period: 'voor altijd',
    features: [
      { name: 'Toegang tot alle gratis nummers (volledige lengte)', included: true },
      { name: '30 seconden preview van premium nummers', included: true },
      { name: 'Standaard geluidskwaliteit (320kbps)', included: true },
      { name: 'Toegang via alle apparaten', included: true },
      { name: 'Volledige toegang tot premium nummers', included: false },
      { name: 'Offline luisteren', included: false },
    ],
    cta: 'Huidige plan',
    popular: false,
    color: 'bg-gray-100 dark:bg-gray-800',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€6,05',
    period: 'per maand',
    features: [
      { name: 'Toegang tot alle nummers (volledige lengte)', included: true },
      { name: 'Standaard geluidskwaliteit (320kbps)', included: true },
      { name: 'Onbeperkt luisteren', included: true },
      { name: 'Offline luisteren', included: true },
      { name: 'Toegang via alle apparaten', included: true },
      { name: 'Inclusief 21% BTW (€5 + €1,05)', included: true },
    ],
    cta: 'Upgraden',
    popular: true,
    color: 'bg-primary/10',
  }
];

// Mock data for billing history
const billingHistory = [
  {
    id: '123456',
    date: '2025-04-03',
    amount: '€6,05',
    plan: 'Premium',
    status: 'Betaald',
    paymentMethod: 'VISA ****1234',
  },
  {
    id: '123455',
    date: '2025-03-03',
    amount: '€6,05',
    plan: 'Premium',
    status: 'Betaald',
    paymentMethod: 'VISA ****1234',
  },
  {
    id: '123454',
    date: '2025-02-03',
    amount: '€6,05',
    plan: 'Premium',
    status: 'Betaald',
    paymentMethod: 'VISA ****1234',
  }
];

export const SubscriptionFeatures = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { plan: userPlan, setPlan, isSubscribed } = useSubscription();
  const router = useRouter();
  
  const currentPlan = userPlan === 'premium' ? {
    id: 'premium',
    name: 'Premium',
    startDate: '3 januari 2025',
    renewalDate: '3 juni 2025',
    paymentMethod: 'VISA ****1234',
    price: '€6,05 per maand',
  } : {
    id: 'free',
    name: 'Gratis',
    startDate: 'N/A',
    renewalDate: 'N/A',
    paymentMethod: 'N/A',
    price: '€0 voor altijd',
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const handleUpgrade = () => {
    router.push('/abonnement');
  };

  const handleCancelSubscription = () => {
    setPlan('free');
    setActiveTab('overview');
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="plans">Abonnementen</TabsTrigger>
          <TabsTrigger value="billing">Facturering</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <Card className={`${isSubscribed ? "border-yellow-400/50" : "border-primary/50"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Je huidige abonnement: {currentPlan.name}</span>
                  <Badge className={`ml-2 ${isSubscribed ? "bg-yellow-500" : ""}`}>
                    {isSubscribed && <Crown className="h-3 w-3 mr-1" />}
                    {currentPlan.name}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {isSubscribed ? (
                    <>Gestart op {currentPlan.startDate} • Volgende facturering op {currentPlan.renewalDate}</>
                  ) : (
                    <>Gratis plan - Upgrade naar Premium voor volledige toegang tot alle nummers</>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubscribed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Betaalmethode: {currentPlan.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Prijs: {currentPlan.price}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Music className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Gratis plan beperkingen</h4>
                        <p className="text-sm text-muted-foreground">
                          Met het gratis plan kun je maar 30 seconden van premium nummers luisteren. 
                          Upgrade naar Premium voor volledige toegang.
                        </p>
                      </div>
                    </div>
                    <Button onClick={handleUpgrade} className="w-full sm:w-auto">
                      Upgrade naar Premium
                    </Button>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Inbegrepen in je plan:</h4>
                  <ul className="space-y-2">
                    {plans.find(plan => plan.id === currentPlan.id)?.features.filter(f => f.included).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isSubscribed ? (
                  <>
                    <Button variant="outline" onClick={() => setActiveTab('plans')}>
                      Abonnement wijzigen
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('billing')}>
                      Factuurgeschiedenis
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setActiveTab('plans')}>
                      Vergelijk plannen
                    </Button>
                    <Button onClick={handleUpgrade}>
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade naar Premium
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
            
            {isSubscribed && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Beheer je abonnement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link href="/abonnement" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <h4 className="font-medium">Betaalmethode wijzigen</h4>
                            <p className="text-sm text-muted-foreground">Update je kaartgegevens of betaalmethode</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                      
                      <Link href="#" className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-4">
                          <Download className="h-5 w-5" />
                          <div>
                            <h4 className="font-medium">Download facturen</h4>
                            <p className="text-sm text-muted-foreground">PDF facturen voor je administratie</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Abonnement opzeggen
                    </CardTitle>
                    <CardDescription>
                      Let op: bij opzegging verlies je volledige toegang tot premium nummers. Je kunt dan alleen nog 30 seconden van premium nummers luisteren.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" onClick={handleCancelSubscription}>Abonnement opzeggen</Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden ${plan.popular ? 'border-yellow-400 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-bl-md rounded-tr-md rounded-tl-none rounded-br-none bg-yellow-500">
                      Populair
                    </Badge>
                  </div>
                )}
                <CardHeader className={`${plan.color}`}>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {plan.name}
                    {plan.id === 'premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                  </CardTitle>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm ml-1 text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.id === currentPlan.id ? "secondary" : "default"}
                    disabled={plan.id === currentPlan.id}
                    onClick={() => plan.id === 'premium' ? handleUpgrade() : handleCancelSubscription()}
                  >
                    {plan.id === currentPlan.id ? "Huidige plan" : plan.id === 'premium' ? "Upgraden" : "Downgraden"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          {isSubscribed ? (
            <Card>
              <CardHeader>
                <CardTitle>Factuurgeschiedenis</CardTitle>
                <CardDescription>
                  Overzicht van je recente facturen en betalingen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factuurnr.</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Abonnement</TableHead>
                      <TableHead>Bedrag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Betaalmethode</TableHead>
                      <TableHead className="text-right">Actie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell>{invoice.plan}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Factuurgeschiedenis</CardTitle>
                <CardDescription>Je hebt momenteel geen facturen als gebruiker van het gratis plan.</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Geen factuurgeschiedenis</h3>
                <p className="text-muted-foreground mb-6">
                  Je gebruikt momenteel het gratis plan. Upgrade naar Premium om je facturen hier te bekijken.
                </p>
                <Button onClick={handleUpgrade}>
                  Upgrade naar Premium
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionFeatures;