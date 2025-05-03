'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, Info, CreditCard, Calendar, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Payment form schema
const paymentFormSchema = z.object({
  plan: z.enum(["free", "premium"], {
    required_error: "Selecteer een abonnement",
  }),
  cardNumber: z
    .string()
    .min(16, { message: "Kaartnummer moet 16-19 cijfers bevatten" })
    .max(19, { message: "Kaartnummer moet 16-19 cijfers bevatten" })
    .regex(/^[0-9\s]{16,19}$/, { message: "Voer een geldig kaartnummer in" }),
  cardName: z.string().min(1, { message: "Naam is verplicht" }),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, { message: "Gebruik formaat MM/JJ" }),
  cardCvc: z
    .string()
    .length(3, { message: "CVC moet 3 cijfers bevatten" })
    .regex(/^[0-9]{3}$/, { message: "Voer een geldige CVC in" }),
  billingAddress: z.string().min(1, { message: "Factuuradres is verplicht" }),
  postalCode: z
    .string()
    .regex(/^[0-9]{4}\s?[A-Za-z]{2}$/, { message: "Gebruik formaat 1234 AB" }),
  city: z.string().min(1, { message: "Stad is verplicht" }),
  country: z.string().min(1, { message: "Land is verplicht" }),
  savePaymentMethod: z.boolean().default(true),
  acceptTerms: z
    .boolean()
    .refine((value) => value === true, {
      message: "Je moet akkoord gaan met de servicevoorwaarden",
    }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Subscription plans data
const plans = [
  {
    id: 'free',
    name: 'Gratis',
    price: '€0',
    period: 'voor altijd',
    description: 'Beperkte toegang tot muziek',
    features: [
      'Toegang tot alle gratis nummers',
      'Luister de eerste 30 seconden van premium nummers',
      'Standaard geluidskwaliteit (320kbps)',
      'Toegang via alle apparaten',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '€6,05',
    period: 'per maand',
    description: 'Volledige toegang tot alle muziek',
    features: [
      'Toegang tot alle nummers (volledig)',
      'Standaard geluidskwaliteit (320kbps)',
      'Onbeperkt luisteren',
      'Offline luisteren',
      'Inclusief 21% BTW (€5 + €1,05)',
    ],
    popular: true,
  },
];

export const SubscriptionManagement = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'plan' | 'payment' | 'confirmation'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  // Initialize the form with explicit type
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      plan: "premium",
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvc: "",
      billingAddress: "",
      postalCode: "",
      city: "",
      country: "Nederland",
      savePaymentMethod: true,
      acceptTerms: false,
    },
  });

  // Handle form submission
  function onSubmit(data: PaymentFormValues) {
    setIsSubmitting(true);
    console.log("Form data:", data);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep('confirmation');
    }, 2000);
  }

  // Format card number for display
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "") // Remove spaces
      .match(/.{1,4}/g)?.join(" ") // Add a space after every 4 digits
      .substr(0, 19) || ""; // Limit to 19 characters (16 digits + 3 spaces)
  };

  // Format expiry date for display
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove non-digits
      .replace(/(\d{2})(\d)/, "$1/$2") // Add slash after 2 digits
      .substr(0, 5); // Limit to 5 characters (MM/YY)
  };

  // Watch the plan field to update the selected plan
  const watchPlan = form.watch("plan");

  // Handle selecting a plan
  const handleSelectPlan = (planId: "free" | "premium") => {
    form.setValue("plan", planId);
    setSelectedPlan(planId);
  };

  // Handle proceeding to payment
  const handleProceedToPayment = () => {
    if (selectedPlan === 'free') {
      // If free plan is selected, skip payment and go to confirmation
      setCurrentStep('confirmation');
    } else {
      setCurrentStep('payment');
    }
  };

  return (
    <div className="space-y-8">
      {currentStep === 'plan' && (
        <div className="space-y-6">
          <RadioGroup value={selectedPlan} onValueChange={(value) => handleSelectPlan(value as "free" | "premium")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'ring-2 ring-primary border-primary shadow-md'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelectPlan(plan.id as "free" | "premium")}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="rounded-bl-md rounded-tr-md rounded-tl-none rounded-br-none">
                        Populair
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <RadioGroupItem 
                        value={plan.id}
                        id={plan.id}
                        checked={selectedPlan === plan.id}
                        className="h-5 w-5"
                      />
                    </CardTitle>
                    <div>
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm ml-1 text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectPlan(plan.id as "free" | "premium");
                      }}
                    >
                      {selectedPlan === plan.id ? 'Geselecteerd' : 'Selecteer'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </RadioGroup>

          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleProceedToPayment}
            >
              {selectedPlan === 'free' ? 'Gebruik gratis plan' : 'Ga naar betaling'}
            </Button>
          </div>
        </div>
      )}

      {currentStep === 'payment' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Betaalgegevens</CardTitle>
            <CardDescription>
              Voer je betaalgegevens in om het {
                plans.find(p => p.id === selectedPlan)?.name
              } abonnement af te sluiten.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" {...form.register("plan")} />
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Geselecteerd abonnement</h3>
                  <div className="p-4 border rounded-md bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{plans.find(p => p.id === selectedPlan)?.name}</p>
                        <p className="text-sm text-muted-foreground">{plans.find(p => p.id === selectedPlan)?.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{plans.find(p => p.id === selectedPlan)?.price}</p>
                        <p className="text-sm text-muted-foreground">{plans.find(p => p.id === selectedPlan)?.period}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-base font-medium">Kaartgegevens</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Naam op kaart</FormLabel>
                        <FormControl>
                          <Input placeholder="J. Jansen" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kaartnummer</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(formatCardNumber(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vervaldatum</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/JJ" 
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatExpiryDate(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardCvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              maxLength={3}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value.replace(/\D/g, "").slice(0, 3));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-base font-medium">Factuuradres</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Input placeholder="Voorbeeldstraat 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 AB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stad</FormLabel>
                          <FormControl>
                            <Input placeholder="Amsterdam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Land</FormLabel>
                        <FormControl>
                          <Input placeholder="Nederland" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-base font-medium">Bevestiging</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="savePaymentMethod"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Betaalmethode opslaan</FormLabel>
                          <FormDescription>
                            Sla deze betaalmethode veilig op voor toekomstige betalingen
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Voorwaarden accepteren</FormLabel>
                          <FormDescription>
                            Ik ga akkoord met de <a href="#" className="text-primary hover:underline">servicevoorwaarden</a> en <a href="#" className="text-primary hover:underline">privacybeleid</a>
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <p>Je kunt je abonnement op elk moment opzeggen</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep('plan')}
                    >
                      Terug
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Bezig met verwerken..." : `Betaal ${plans.find(p => p.id === selectedPlan)?.price}`}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {currentStep === 'confirmation' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 text-green-800 p-3 rounded-full w-12 h-12 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">
              {selectedPlan === 'free' ? 'Gratis plan geactiveerd!' : 'Abonnement geactiveerd!'}
            </CardTitle>
            <CardDescription>
              {selectedPlan === 'free' 
                ? 'Je gratis plan is nu actief. Je kunt nu naar alle gratis nummers luisteren en de eerste 30 seconden van premium nummers.'
                : 'Je Premium abonnement is succesvol geactiveerd. Geniet van volledige toegang tot alle nummers!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Abonnementsdetails</h3>
                  <p className="text-sm text-muted-foreground">Actief vanaf {new Date().toLocaleDateString('nl-NL')}</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Actief
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-sm">{plans.find(p => p.id === selectedPlan)?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Prijs</p>
                  <p className="text-sm">{plans.find(p => p.id === selectedPlan)?.price} {plans.find(p => p.id === selectedPlan)?.period}</p>
                </div>
                {selectedPlan === 'premium' && (
                  <>
                    <div>
                      <p className="text-sm font-medium">Volgende facturatie</p>
                      <p className="text-sm">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Betaalmethode</p>
                      <p className="text-sm">VISA ****1234</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => window.location.href = '/account'}>
                Ga naar account
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Luister muziek
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManagement;