import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Settings, ListMusic, UserPlus } from "lucide-react";
import Link from "next/link";
import DemoSubscriptionSwitcher from "@/components/abonnement/DemoSubscriptionSwitcher";

export const metadata = {
  title: 'Admin Dashboard | BitZoMax',
  description: 'Beheer alle aspecten van het BitZoMax platform',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Beheer gebruikers, muziek en platforminstellingen
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal Gebruikers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">
              +12.5% van vorige maand
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Gebruikers
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">642</div>
            <p className="text-xs text-muted-foreground">
              +18.2% van vorige maand
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal Nummers
            </CardTitle>
            <ListMusic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,742</div>
            <p className="text-xs text-muted-foreground">
              +342 toegevoegd deze maand
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
            <CardDescription>
              De laatste activiteiten op het platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">8 nieuwe gebruikers geregistreerd</p>
                  <p className="text-xs text-muted-foreground">32 minuten geleden</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <Music className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">12 nieuwe nummers geüpload</p>
                  <p className="text-xs text-muted-foreground">1 uur geleden</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-muted">
                  <Settings className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Systeemupdate voltooid</p>
                  <p className="text-xs text-muted-foreground">3 uur geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <DemoSubscriptionSwitcher />
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Snelle acties</CardTitle>
            <CardDescription>
              Veelgebruikte beheertools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/songs">
                <Button className="w-full" variant="outline">
                  <Music className="mr-2 h-4 w-4" />
                  Beheer Nummers
                </Button>
              </Link>
              
              <Link href="/admin/users">
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Beheer Gebruikers
                </Button>
              </Link>
              
              <Link href="#">
                <Button className="w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Systeeminstellingen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}