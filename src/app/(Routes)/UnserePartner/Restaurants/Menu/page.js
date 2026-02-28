"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const MenuContent = () => {
  const searchParams = useSearchParams();
  const [serverData, setServerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const restaurantID = searchParams.get("restaurantID");

    if (!restaurantID) {
      setError("Keine Restaurant-ID in der URL gefunden");
      setLoading(false);
      return;
    }

    const fetchMenu = async () => {
      try {
        const resp = await fetch(
          `/api/restaurant/${restaurantID}/menu`,
          { method: "POST" }
        );

        if (!resp.ok) {
          if (resp.status === 404)
            throw new Error("Restaurant nicht gefunden!");
          if (resp.status === 500)
            throw new Error("Internal Server Error");
          throw new Error(
            `Fehler beim Abrufen der Daten: ${resp.status}`
          );
        }

        const data = await resp.json();

        setServerData(data);
        setName(data.name || "Unbenanntes Restaurant");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [searchParams]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Es ist ein Fehler aufgetreten: {error}
      </div>
    );

  const MenuSection = ({ title, menuItems }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg w-full py-8 px-4 sm:px-6 md:px-10">
        <div className="mb-6">
          <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif font-semibold">
            {title}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full table-fixed min-w-[400px]">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-2/5" />
              <col className="w-1/5" />
            </colgroup>

            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Speisen</TableHead>
                <TableHead className="text-left">Beschreibung</TableHead>
                <TableHead className="text-right">Preis</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TableRow
                    className="cursor-pointer transition-colors duration-200 hover:bg-yellow-50"
                    onClick={() => toggleExpand(index)}
                  >
                    <TableCell className="align-top font-serif text-gray-900">
                      {item.name}
                    </TableCell>

                    <TableCell className="align-top text-gray-700">
                      {item.description}
                    </TableCell>

                    <TableCell className="align-top text-right font-mono whitespace-nowrap">
                      {parseFloat(item.price).toFixed(2)}€
                    </TableCell>
                  </TableRow>

                  {expandedIndex === index && item.imageUrl && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="mt-4 bg-gray-50 p-4 sm:p-5 rounded-2xl border shadow-sm">
                          <Image
                            src={item.imageUrl || "/placeholder.png"}
                            alt={item.name}
                            width={900}
                            height={600}
                            className="w-full h-auto object-cover rounded-xl"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center text-gray-900 font-sans p-4 sm:p-6 md:p-8
      ${
        serverData?.menu?.[0]?.bgColor
          ? ""
          : "bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200"
      }`}
      style={
        serverData?.menu?.[0]?.bgColor
          ? { backgroundColor: serverData?.menu?.[0]?.bgColor }
          : undefined
      }
    >
      <header className="mb-8 sm:mb-10 md:mb-12 text-center w-full px-4 sm:px-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold italic tracking-wide">
          {name}
        </h1>
      </header>

      <main className="w-full max-w-5xl sm:max-w-6xl md:max-w-7xl mx-auto backdrop-blur-md z-10 px-2 sm:px-4 md:px-0">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {serverData.menu?.[0]?.categories?.length > 0 ? (
            serverData.menu[0].categories.map((category) => (
              <MenuSection
                key={category.id}
                title={category.name}
                menuItems={category.dishes}
              />
            ))
          ) : (
            <div className="text-center">Keine Kategorien gefunden</div>
          )}
        </div>

        <p className="mt-6 sm:mt-8 md:mt-10 text-right font-semibold text-lg">
          Gesamtpreis: {totalPrice.toFixed(2)}€
        </p>

        <details className="mt-6 sm:mt-8 md:mt-10">
          <summary className="cursor-pointer font-medium">
            Debug Data
          </summary>
          <pre className="mt-2 sm:mt-4 p-3 sm:p-4 bg-gray-100 rounded-lg overflow-auto text-sm">
            {JSON.stringify(serverData, null, 2)}
          </pre>
        </details>
      </main>
    </div>
  );
};

function MenuSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

export default function Menu() {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuContent />
    </Suspense>
  );
}
