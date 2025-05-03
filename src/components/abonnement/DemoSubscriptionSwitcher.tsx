'use client';

import { useSubscription } from "@/lib/subscription-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Music } from "lucide-react";
import { toast } from "sonner";

export const DemoSubscriptionSwitcher = () => {
  const { plan, setPlan, isSubscribed } = useSubscription();

  const handlePlanChange = (newPlan: "free" | "premium") => {
    setPlan(newPlan);
    toast.success(`Abonnement gewijzigd naar ${newPlan === 'premium' ? 'Premium' : 'Gratis'}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Demo Modus
        </CardTitle>
        <CardDescription>
          Wissel tussen abonnementstypen om de verschillende ervaringen te testen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={plan} 
          value={plan}
          onValueChange={(value) => handlePlanChange(value as "free" | "premium")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free">Gratis Plan</TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <Crown className="h-4 w-4" /> Premium Plan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="free" className="py-4">
            <p className="text-sm text-muted-foreground">
              Je gebruikt nu het <strong>Gratis</strong> plan. Je kunt alleen naar volledige gratis nummers luisteren.
              Voor premium nummers hoor je slechts de eerste 30 seconden.
            </p>
          </TabsContent>
          <TabsContent value="premium" className="py-4">
            <p className="text-sm text-muted-foreground">
              Je gebruikt nu het <strong>Premium</strong> plan (€6,05/maand). Je hebt volledige toegang tot alle nummers,
              inclusief premium content.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DemoSubscriptionSwitcher;