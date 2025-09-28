import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { FaCreativeCommonsNcJp, FaPen } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

import { menuSchema, itemSchema } from "./menuSchema";


const SelectItem = ({ open, onOpenChange, selectedItem, setChangedItem }) => {
  // State to toggle edit mode for fields
  const [editName, setEditName] = useState();
  const [editDescription, setEditDescription] = useState();
  const [editPrice, setEditPrice] = useState();
  const [edditImg, setEdditImage] = useState();
  const [updatedItem, setUpdatedItem] = useState("");
  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: selectedItem?.name || "",
      description: selectedItem?.description || "",
      price: selectedItem?.price || 0,
      Bild: null,
    },
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    reset({
      name: selectedItem?.name || "",
      description: selectedItem?.description || "",
      price: selectedItem?.price || 0,
      Bild: null,
    });
    // Reset edit modes on item change
    setEditName(false);
    setEditDescription(false);
    setEditPrice(false);
  }, [selectedItem, reset]);

  const onSubmit = async(data) => {
    if (!data) {
      window.alert("Keine Veränderung");
      return;
    }
    console.log("Data-Ausgabe:", data);
    if (!selectedItem){return}else{setUpdatedItem((item) => ({
      ...item,
      id: selectedItem.id
    }))};
    if (data.name && data.name !== selectedItem.name) {
      setUpdatedItem((item) => ({
        ...item,
        name: data.name,
      }));
    }
    if (data.price !== undefined && data.price !== selectedItem.price) {
      setUpdatedItem((item) => ({
        ...item,
        price: data.price,
      }));
    }
    if (data.description && data.description !== selectedItem.description) {
      setUpdatedItem((item) => ({
        ...item,
        description: data.description,
      }));
    }
    if (data.Bild && data.Bild.length > 0) {
      setUpdatedItem((item) => ({
        ...item,
        img: data.Bild,
      }));
     
    }

    var resp = await fetch("/api/user/profil/setData", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        userID: userID,
        data: updatedItem,
      })
    })
    if(resp.status != 200){
      window.alert("Ups etwas ist schief gelaufen! \nBitte versuchen sie es nochmal!")
    }
    setChangedItem(updatedItem);
    reset();
    setEditName(false);
    setEditDescription(false);
    setEditPrice(false);
    console.log("Updatedt Data:", updatedItem);
  };
  const toggleEdit = (field) => {
    switch (field) {
      case "name":
        setEditName((prev) => !prev);
        break;
      case "description":
        setEditDescription((prev) => !prev);
        break;
      case "price":
        setEditPrice((prev) => !prev);
        break;
      case "img":
        setEdditImage((prev) => !prev);
        break;
      default:
        break;
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Speise bearbeiten:</DialogTitle>
          <Tooltip>
            <TooltipTrigger>
              <FaCircleInfo />
            </TooltipTrigger>
            <TooltipContent>
              <p className="truncate whitespace-nowrap">Auf das Stift Symbol oder die Bezeichnung klicken um das Element bearbeiten zu können</p>
            </TooltipContent>
          </Tooltip>
        </DialogHeader>
        <div className="mt-4">
          {selectedItem ? (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("name")}>
                        <FaPen />
                        Name:
                      </FormLabel>
                      {editName ? (
                        <FormControl>
                          <Input type="text" placeholder="Name" {...field} alt="Name" />
                        </FormControl>
                      ) : (
                        <div>{updatedItem.name ? updatedItem.name : selectedItem.name}</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("description")}>
                        <FaPen />
                        Beschreibung:
                      </FormLabel>
                      {editDescription ? (
                        <FormControl>
                          <Textarea type="text" placeholder="Beschreibung" {...field} />
                        </FormControl>
                      ) : (
                        <div>{selectedItem.description || "-"}</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel onClick={() => toggleEdit("price")}>
                        <FaPen />
                        Preis:
                      </FormLabel>
                      {editPrice ? (
                        <FormControl>
                          <Input type="number" placeholder="Preis als Dezimalzahl (ohne € Zeichen)" {...field} />
                        </FormControl>
                      ) : (
                        <div>{editPrice || selectedItem.price || ""}€</div>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="Bild"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>
                        <FaPen />
                        Bild
                      </FormLabel>
                      <FormControl>
                        <Input type="file" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Aktualisieren
                </Button>
              </form>
            </Form>
          ) : (
            "No item selected."
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export { SelectItem };
