import { Metadata } from "next";
import SubscriptionManagement from "@/components/abonnement/SubscriptionManagement";
import PaymentHistory from "@/components/abonnement/PaymentHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Abonnement | Bitzomax",
  description: "Beheer je abonnement en bekijk je betalingsgeschiedenis bij Bitzomax.",
};

export default function AbonnementPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Abonnement</h1>
        <p className="text-muted-foreground">
          Beheer je abonnement, bekijk beschikbare opties en facturen
        </p>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="manage">Abonnementsbeheer</TabsTrigger>
          <TabsTrigger value="history">Betalingsgeschiedenis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Huidige abonnementsstatus</CardTitle>
              <CardDescription>
                Je huidige abonnement en de bijbehorende voordelen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Gratis plan</p>
                    <p className="text-sm text-muted-foreground">Je gebruikt momenteel het gratis abonnement</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">€0 /maand</p>
                    <p className="text-sm text-muted-foreground">Upgrade naar Premium voor volledige toegang</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <SubscriptionManagement />
        </TabsContent>
        
        <TabsContent value="history">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}