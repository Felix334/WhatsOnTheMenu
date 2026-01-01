"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Menu = () => {
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
        const resp = await fetch(`/api/restaurant/${restaurantID}/menu`, {
          method: "POST",
        });

        if (!resp.ok) {
          if (resp.status === 404) throw new Error("Restaurant nicht gefunden!");
          if (resp.status === 500) throw new Error("Internal Server Error");
          throw new Error(`Fehler beim Abrufen der Daten: ${resp.status}`);
        }

        const data = await resp.json();
        console.log("Server-Data", data);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Es ist ein Fehler aufgetreten: {error}</div>;

  const MenuSection = ({ title, menuItems }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 px-8">
        <div className="mb-6">
          <h3 className="text-center text-4xl font-semibold">{title}</h3>
        </div>

        <div className="space-y-6">
          <Table className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm w-full table-fixed">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-2/5" />
              <col className="w-1/5" />
            </colgroup>

            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-left">Speisen</TableHead>
                <TableHead className="text-left">Beschreibung</TableHead>
                <TableHead className="text-right">Preis</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <TableRow className="cursor-pointer transition-colors duration-200 hover:bg-yellow-50" onClick={() => toggleExpand(index)}>
                    <TableCell className="font-serif text-gray-900">{item.name}</TableCell>

                    <TableCell className="text-gray-700">{item.description}</TableCell>

                    <TableCell className="text-right font-mono">{parseFloat(item.price).toFixed(2)}€</TableCell>
                  </TableRow>

                  {expandedIndex === index && item.imageUrl && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <div className="mt-3 bg-gray-50 p-5 rounded-2xl border shadow-sm">
                          <Image src={item.imageUrl || "/placeholder.png"} alt={item.name} width={900} height={600} className="w-full h-auto object-cover rounded-xl" />
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
    <div className="min-h-screen bg-linear-to-r from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center justify-center text-gray-900 font-sans p-8 relative">
      <header className="mb-12 text-center w-full">
        <h1 className="text-5xl font-serif font-semibold italic tracking-wide">{name}</h1>
      </header>

      <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto grid gap-4">{serverData.menu?.[0]?.categories?.length > 0 ? serverData.menu[0].categories.map((category) => <MenuSection key={category.id} title={category.name} menuItems={category.dishes} />) : <div>Keine Kategorien gefunden</div>}</div>

        <p className="mt-4 font-semibold">Gesamtpreis: {totalPrice.toFixed(2)}€</p>

        <details className="mt-8">
          <summary>Debug Data</summary>
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">{JSON.stringify(serverData, null, 2)}</pre>
        </details>
      </main>
    </div>
  );
};

export default Menu;
