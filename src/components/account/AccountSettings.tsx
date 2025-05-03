'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Save, User, Bell, Shield, Music, Trash2 } from "lucide-react";

// Profile form schema
const profileFormSchema = z.object({
  username: z.string().min(3, { message: "Gebruikersnaam moet tenminste 3 tekens bevatten" }),
  email: z.string().email({ message: "Ongeldig e-mailadres" }),
  bio: z.string().max(250, { message: "Bio kan maximaal 250 tekens bevatten" }).optional(),
  name: z.string().min(1, { message: "Naam is verplicht" }),
});

// Preferences form schema
const preferencesFormSchema = z.object({
  streamingQuality: z.enum(["normal", "high", "ultra"], { 
    required_error: "Selecteer een streamingkwaliteit",
  }),
  downloadQuality: z.enum(["normal", "high", "ultra"], { 
    required_error: "Selecteer een downloadkwaliteit",
  }),
  language: z.enum(["nl", "en", "de"], { required_error: "Selecteer een taal" }),
  explicitContent: z.boolean().default(false),
  autoplay: z.boolean().default(true),
  showFriendActivity: z.boolean().default(true),
});

// Security form schema
const securityFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Huidig wachtwoord is verplicht" }),
  newPassword: z.string().min(8, { message: "Nieuw wachtwoord moet tenminste 8 tekens bevatten" }).optional(),
  confirmPassword: z.string().optional(),
}).refine(data => data.newPassword === data.confirmPassword || !data.newPassword, {
  message: "Wachtwoorden komen niet overeen",
  path: ["confirmPassword"],
});

// Notifications form schema
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  newReleases: z.boolean().default(true),
  playlistUpdates: z.boolean().default(true),
  artistUpdates: z.boolean().default(true),
  promotions: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export const AccountSettings = () => {
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPreferencesSaving, setIsPreferencesSaving] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);
  const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "muziekfan123",
      email: "gebruiker@voorbeeld.nl",
      bio: "Muziekliefhebber die van alles een beetje houdt!",
      name: "Jan Jansen",
    },
  });
  
  // Preferences form
  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      streamingQuality: "high",
      downloadQuality: "high",
      language: "nl",
      explicitContent: false,
      autoplay: true,
      showFriendActivity: true,
    },
  });
  
  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Notifications form
  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      newReleases: true,
      playlistUpdates: true,
      artistUpdates: true,
      promotions: false,
    },
  });
  
  // Form submit handlers
  const onProfileSubmit = (data: ProfileFormValues) => {
    setIsProfileSaving(true);
    console.log("Profile data:", data);
    setTimeout(() => {
      setIsProfileSaving(false);
    }, 1000);
  };
  
  const onPreferencesSubmit = (data: PreferencesFormValues) => {
    setIsPreferencesSaving(true);
    console.log("Preferences data:", data);
    setTimeout(() => {
      setIsPreferencesSaving(false);
    }, 1000);
  };
  
  const onSecuritySubmit = (data: SecurityFormValues) => {
    setIsSecuritySaving(true);
    console.log("Security data:", data);
    setTimeout(() => {
      setIsSecuritySaving(false);
    }, 1000);
  };
  
  const onNotificationsSubmit = (data: NotificationsFormValues) => {
    setIsNotificationsSaving(true);
    console.log("Notifications data:", data);
    setTimeout(() => {
      setIsNotificationsSaving(false);
    }, 1000);
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profiel</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Beveiliging</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Meldingen</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profielinformatie</CardTitle>
            <CardDescription>
              Werk je profielinformatie bij. Deze informatie kan zichtbaar zijn voor andere gebruikers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" alt="Profielfoto" />
                  <AvatarFallback>JJ</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Uploaden
                </Button>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naam</FormLabel>
                          <FormControl>
                            <Input placeholder="Jouw naam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gebruikersnaam</FormLabel>
                          <FormControl>
                            <Input placeholder="gebruikersnaam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="jouw@email.nl" {...field} />
                        </FormControl>
                        <FormDescription>
                          Dit e-mailadres wordt gebruikt voor inloggen en meldingen.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Over mij</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Vertel iets over jezelf..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Je kunt maximaal 250 tekens gebruiken.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isProfileSaving} className="gap-2">
                    {isProfileSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isProfileSaving ? 'Opslaan...' : 'Profiel opslaan'}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gevaarlijke zone</CardTitle>
            <CardDescription>
              Als je je account verwijdert, worden al je gegevens permanent gewist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Account verwijderen
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Wachtwoord wijzigen</CardTitle>
            <CardDescription>
              Om je wachtwoord te wijzigen, vul je huidige wachtwoord in en kies een nieuw wachtwoord.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                <FormField
                  control={securityForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Huidig wachtwoord</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={securityForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nieuw wachtwoord</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Kies een sterk wachtwoord van tenminste 8 tekens met letters, cijfers en speciale tekens.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={securityForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bevestig nieuw wachtwoord</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isSecuritySaving} className="gap-2">
                  {isSecuritySaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSecuritySaving ? 'Wachtwoord wijzigen...' : 'Wachtwoord wijzigen'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Twee-factor authenticatie</CardTitle>
            <CardDescription>
              Voeg een extra beveiligingslaag toe aan je account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Twee-factor authenticatie</h4>
                  <p className="text-sm text-muted-foreground">
                    Bescherm je account met een extra verificatiestap bij het inloggen.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Inloggeschiedenis</h4>
                  <p className="text-sm text-muted-foreground">
                    Bekijk recente inlogactiviteiten op je account.
                  </p>
                </div>
                <Button variant="outline" size="sm">Bekijken</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Meldingsvoorkeuren</CardTitle>
            <CardDescription>
              Beheer welke meldingen je wilt ontvangen en hoe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">                
                <FormField
                  control={notificationsForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          E-mailmeldingen
                        </FormLabel>
                        <FormDescription>
                          Ontvang meldingen via e-mail
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Soorten meldingen</h4>
                  
                  <FormField
                    control={notificationsForm.control}
                    name="newReleases"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Nieuwe releases
                          </FormLabel>
                          <FormDescription>
                            Meldingen over nieuwe muziek van artiesten die je volgt
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="playlistUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Afspeellijst updates
                          </FormLabel>
                          <FormDescription>
                            Meldingen over wijzigingen aan afspeellijsten die je volgt
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="artistUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Artiestupdates
                          </FormLabel>
                          <FormDescription>
                            Nieuws en updates van artiesten die je volgt
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationsForm.control}
                    name="promotions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Promoties en aanbiedingen
                          </FormLabel>
                          <FormDescription>
                            Speciale aanbiedingen en promoties van BitZoMax
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" disabled={isNotificationsSaving} className="gap-2">
                  {isNotificationsSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isNotificationsSaving ? 'Voorkeuren opslaan...' : 'Meldingsvoorkeuren opslaan'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AccountSettings;