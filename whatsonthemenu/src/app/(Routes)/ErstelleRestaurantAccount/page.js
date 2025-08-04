"use client"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
                      <FormLabel>Firmenname *</FormLabel>
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
                      <FormLabel>Rechtsform *</FormLabel>
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
                      <FormLabel>Vorname *</FormLabel>
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
                      <FormLabel>Nachname *</FormLabel>
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
                      <FormLabel>E-Mail *</FormLabel>
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
                      <FormLabel>Telefon *</FormLabel>
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
                      <FormLabel>Straße *</FormLabel>
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
                      <FormLabel>Hausnummer *</FormLabel>
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
                      <FormLabel>Postleitzahl *</FormLabel>
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
                      <FormLabel>Stadt *</FormLabel>
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
                      <FormLabel>Umsatzsteuer-ID *</FormLabel>
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
                      <FormLabel>Handelsregisternummer</FormLabel>
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
                    <FormLabel>Beschreibung Ihrer Speisekarte</FormLabel>
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
                        <FormLabel>
                          Hygienekonzept nach § 4 IfSG *                        
                        </FormLabel>
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
                        <FormLabel>
                          Allergen-Kennzeichnung nach LMIV *
                        </FormLabel>
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
                        <FormLabel>
                          Ich akzeptiere die{' '}
                          <Link href="/privacy" className="text-primary underline">
                            Datenschutzerklärung
                          </Link>{' '}
                          *
                        </FormLabel>
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
                        <FormLabel>
                          Ich akzeptiere die{' '}
                          <Link href="/terms" className="text-primary underline">
                            Allgemeinen Geschäftsbedingungen
                          </Link>{' '}
                          *
                        </FormLabel>
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
                        <FormLabel>
                          Ich bestätige die Impressumspflicht nach § 5 TMG *
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Registrierung abschließen
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
