import React, { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const OptionMenu = ({ openOptions, setOpenOptions, bgColor, setBgColor, router, userID }) => (
  <Sheet open={openOptions} onOpenChange={setOpenOptions}>
    <SheetTrigger asChild>
      <Button variant="outline">|||</Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-3xl">
      <SheetHeader>
        <SheetTitle>Dashboard</SheetTitle>
        <SheetDescription>Hier können Sie Ihre Seite individuell gestalten</SheetDescription>
      </SheetHeader>
      <div className="p-4 space-y-4">
        <div>
          <Label>Hintergrund</Label>
          <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
        <div>{/* Additional options can be added here */}</div>
        <Button asChild>
          <Link href={{ pathname: "/Profil/QRBuilder/", query: { ...router.query, ...(userID ? { userID: userID } : {}) } }}>QR-Code erstellen</Link>
        </Button>
      </div>
    </SheetContent>
  </Sheet>
);
export  {OptionMenu};