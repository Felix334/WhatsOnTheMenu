import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { menuSchema, itemSchema } from "./menuSchema";


const SelectItem = ({ open, onOpenChange, selectedItem, setChangedItem }) => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescrition] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newImg, setNewImage] = useState();
  const [edditName, setEdditName] = useState(true);
  const [edditDescription, setEdditDescritption] = useState(true)
  const [edditPrice, setEdditPrice] = useState(true)

  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const onSubmit = (data, selectedItem) => {
    if (!data) {
      window.alert("Keine Veränderung");
    }
    console.log("Data-Ausgabe:", data);
    console.log(data, selectedItem.id);
    setChangedItem.id = data.id;
    if (data.name) {
      setChangedItem.name = data.name;
    }
    if (data.price) {
      setChangedItem.price = data.price;
    }
    if (data.description) {
      setChangedItem.description = data.description;
    }
    if (data.Bild) {
      setChangedItem.img = data.Bild;
    } /////////////////////////////////////////////////////////////////////////?
    reset();
  };

  const handleNameChange = (e) => {
    if (selectedItem.name != e.target.value) {
    }
  };

  const toggleEddit = (type) => {
    switch(type){
        case "name":
            edditName ? setEdditName(true) : setEdditName(false);
            break;
        case "description" :
            edditDescription ? setEdditDescritption(true) : setEdditDescritption(false);
            break;
        case "price":
            edditPrice ? setEdditPrice(true): setEdditPrice(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gericht-Informationen:</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {selectedItem ? (
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Form {...form}>
                  <FormField
                    control={control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem className="mb-6" onClick={toggleEddit("name")}>
                        <FormLabel>Name:</FormLabel>
                        {edditName ? (
                          <FormControl>
                            <Input type="text" placeholder="Name" {...field} alt="Name"></Input>
                          </FormControl>
                        ) : (
                          <div>{selectedItem.name}</div>
                        )}

                        <FormControl>
                          <Input type="text" placeholder="Name" {...field} alt="test" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>Beschreibung:</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Beschreibung" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>Preis:</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Preis als Dezimalzahl(ohne € Zeichen)" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="Bild"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <FormLabel>Bild</FormLabel>
                        <FormControl>
                          <Input type="file" placeholder="Bild" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Aktualisieren
                  </Button>
                </Form>
              </form>
            </div>
          ) : (
            "No item selected."
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectItem };
