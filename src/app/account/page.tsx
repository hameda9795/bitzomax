import AccountSettings from "@/components/account/AccountSettings";
import SubscriptionFeatures from "@/components/account/SubscriptionFeatures";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard } from "lucide-react";

export const metadata = {
  title: 'Account | BitZoMax',
  description: 'Beheer je BitZoMax account, abonnement en voorkeuren',
};

export default function AccountPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account</h1>
        <p className="text-lg text-muted-foreground">
          Beheer je account, abonnement en voorkeuren
        </p>
      </section>

      <Tabs defaultValue="settings" className="space-y-8">
        <TabsList>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account Instellingen</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Abonnement</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionFeatures />
        </TabsContent>
      </Tabs>
    </div>
  );
}