/*"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


const edditWin = ({}) => {
    // Kategorien werden sortiert
    return (
      <div className="absolute min-h-screen w-screen bg-black/30 backdrop-blur-md text-black z-20 align-top">
        <Sheet open={toggleMenu}>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                Menü-Daschb
              </SheetTitle>
              <SheetDescription>Neues Menü erstellen</SheetDescription>
            </SheetHeader>
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-2 z-30 mt-15">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="menu_col"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategorie</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Mittag" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="menu_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Menüname:</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Pasta Menü" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Gerichte:</h3>
                    {fields.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-xl space-y-2 bg-gray-50 relative">
                        <FormField
                          control={form.control}
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gerichtname</FormLabel>
                              <FormControl>
                                <Input placeholder="z.B. Spaghetti Carbonara" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Beschreibung</FormLabel>
                              <FormControl>
                                <Input placeholder="z.B. Mit Sahnesauce" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preis</FormLabel>
                              <FormControl>
                                <Input placeholder="z.B. 9.50 €" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.image`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bild</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        form.setValue(`items.${index}.image`, reader.result); // base64 speichern
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </FormControl>
                              {form.watch(`items.${index}.image`) && <Image src={form.watch(`items.${index}.image`)} alt="Vorschau" className="mt-2 w-full h-auto rounded-lg border" />}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" className="absolute top-2 right-2 text-sm text-red-500" onClick={() => remove(index)}>
                          Entfernen
                        </Button>
                      </div>
                    ))}

                    <Button type="button" variant="outline" onClick={() => append({ name: "", price: "", description: "" })}>
                      + Gericht hinzufügen
                    </Button>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button type="submit">Speichern</Button>
                    <Button type="button" variant="outline" onClick={toggleOpenEditWin}>
                      Abbrechen
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  
}
export default edditWin;*/