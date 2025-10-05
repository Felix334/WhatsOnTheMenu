"use client"
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Form Schema according to German legal requirements
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Firmenname muss mindestens 2 Zeichen enthalten.",
  }),
  legalForm: z.string({
    required_error: "Bitte wählen Sie eine Rechtsform aus.",
  }),
  firstName: z.string().min(2, {
    message: "Vorname muss mindestens 2 Zeichen enthalten.",
  }),
  lastName: z.string().min(2, {
    message: "Nachname muss mindestens 2 Zeichen enthalten.",
  }),
  email: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }),
  phone: z.string().min(6, {
    message: "Telefonnummer muss mindestens 6 Zeichen enthalten.",
  }),
  street: z.string().min(3, {
    message: "Straße muss mindestens 3 Zeichen enthalten.",
  }),
  houseNumber: z.string().min(1, {
    message: "Hausnummer ist erforderlich.",
  }),
  postalCode: z.string().min(4, {
    message: "Postleitzahl muss mindestens 4 Zeichen enthalten.",
  }),
  city: z.string().min(2, {
    message: "Stadt muss mindestens 2 Zeichen enthalten.",
  }),
  taxId: z.string().min(11, {
    message: "Umsatzsteuer-Identifikationsnummer muss mindestens 11 Zeichen enthalten.",
  }),
  registrationCourt: z.string().optional(),
  commercialRegisterNumber: z.string().optional(),
  sanitaryConcept: z.boolean().refine(val => val, {
    message: "Sie müssen ein Hygienekonzept bestätigen.",
  }),
  allergenDeclaration: z.boolean().refine(val => val, {
    message: "Sie müssen die Allergen-Deklaration bestätigen.",
  }),
  privacyPolicy: z.boolean().refine(val => val, {
    message: "Sie müssen die Datenschutzerklärung akzeptieren.",
  }),
  termsAccepted: z.boolean().refine(val => val, {
    message: "Sie müssen die AGB akzeptieren.",
  }),
  imprintRequired: z.boolean().refine(val => val, {
    message: "Sie müssen bestätigen, dass Sie ein Impressum bereitstellen.",
  }),
  menuDescription: z.string().optional(),
})

export default function RestaurantRegistration() {
   const router = useRouter();
   const [userID, setUserID] = useState("")
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      taxId: "",
      sanitaryConcept: false,
      allergenDeclaration: false,
      privacyPolicy: false,
      termsAccepted: false,
      imprintRequired: false,
      menuDescription: "",
    }
  })

    useEffect(() => {
      if (userID) {
        console.log("User-ID:", userID);
        window.localStorage.setItem("userID", userID);
      } else {
        var userID_ = window.localStorage.getItem("userID");
        if (userID_) {
          setUserID(userID_);
        }
      }
    }, [userID]);

  const onSubmit = (data) => {
    console.log(data)
    // Handle form submission
  }

 return (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Restaurant Registrierung
        </CardTitle>
        <CardDescription className="text-center">
          Bitte füllen Sie alle mit * markierten Pflichtfelder aus.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Firmenname *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bitte den Namen ihres Restaurants angeben</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="Gaststätte Beispiel GmbH" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />  
              <FormField
                control={form.control}
                name="legalForm"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Rechtsform *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Wählen Sie die Rechtsform Ihres Unternehmens aus (z. B. GmbH, Einzelunternehmen).</p>
                      </TooltipContent>
                    </Tooltip>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie eine Rechtsform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Einzelunternehmen">Einzelunternehmen</SelectItem>
                        <SelectItem value="GbR">GbR</SelectItem>
                        <SelectItem value="GmbH">GmbH</SelectItem>
                        <SelectItem value="UG">UG (haftungsbeschränkt)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Vorname *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Vorname des Ansprechpartners oder Geschäftsführers.</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="Max" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Nachname *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nachname des Ansprechpartners oder Geschäftsführers.</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="Mustermann" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>E-Mail *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>E-Mail-Adresse für den Kontakt und die Registrierungsbestätigung.</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="info@restaurant.de" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />            
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Telefon *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Telefonnummer für den Kontakt (inkl. Vorwahl, z. B. +49).</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="+49 30 1234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Straße *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Straßenname der Geschäftsadresse (ohne Hausnummer).</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="Hauptstraße" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />               
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Hausnummer *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Hausnummer der Geschäftsadresse (z. B. 12a).</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />               
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Postleitzahl *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Postleitzahl der Geschäftsadresse (5-stellig).</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="10179" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />               
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Stadt *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stadt der Geschäftsadresse.</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="Berlin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Legal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Umsatzsteuer-ID *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ihre Umsatzsteuer-Identifikationsnummer (USt-IdNr., beginnt mit DE).</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="DE123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />              
              <FormField
                control={form.control}
                name="commercialRegisterNumber"
                render={({ field }) => (
                  <FormItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel>Handelsregisternummer</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Handelsregisternummer (HRB-Nummer), falls Ihr Unternehmen im Handelsregister eingetragen ist.</p>
                      </TooltipContent>
                    </Tooltip>
                    <FormControl>
                      <Input placeholder="HRB 12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Menu Description */}
            <FormField
              control={form.control}
              name="menuDescription"
              render={({ field }) => (
                <FormItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Beschreibung Ihrer Speisekarte</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Kurze Beschreibung Ihrer Küche, Spezialitäten und Menüvielfalt (optional).</p>
                    </TooltipContent>
                  </Tooltip>
                  <FormControl>
                    <Textarea
                      placeholder="Kurze Beschreibung Ihrer Küche und Spezialitäten..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Legal Confirmations */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="sanitaryConcept"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel>
                            Hygienekonzept nach § 4 IfSG *                        
                          </FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bestätigung, dass ein Hygienekonzept gemäß Infektionsschutzgesetz vorliegt (Pflicht).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormItem>
                )}
              />                
              <FormField
                control={form.control}
                name="allergenDeclaration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel>
                            Allergen-Kennzeichnung nach LMIV *
                          </FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bestätigung der Einhaltung der Allergen-Kennzeichnungspflicht nach Lebensmittel-Informationsverordnung (Pflicht).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormItem>
                )}
              />               
              <FormField
                control={form.control}
                name="privacyPolicy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel>
                            Ich akzeptiere die{' '}
                            <Link href={{ pathname: "/Datenschutzerklaerung", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }} className="text-primary underline">
                              Datenschutzerklärung
                            </Link>{' '}
                            *
                          </FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zustimmung zur Verarbeitung Ihrer personenbezogenen Daten gemäß Datenschutzerklärung (Pflicht für Registrierung).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormItem>
                )}
              />             
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel>
                            Ich akzeptiere die{' '}
                            <Link href={{ pathname: "/ErstelleRestaurantAccount/AGBs", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }} className="text-primary underline">
                              Allgemeinen Geschäftsbedingungen
                            </Link>{' '}
                            *
                          </FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zustimmung zu den Allgemeinen Geschäftsbedingungen (AGB) (Pflicht für Registrierung).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imprintRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel>
                            Ich bestätige die Impressumspflicht nach § 5 TMG *
                          </FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bestätigung der Impressumspflicht gemäß Telemediengesetz für Ihre Website (Pflicht).</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" className="w-full">
                  Registrierung abschließen
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Formular absenden und die Restaurant-Registrierung abschließen.</p>
              </TooltipContent>
            </Tooltip>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
)
}