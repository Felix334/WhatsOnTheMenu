"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";

const Menu = () => {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState("");
  const [serverData, setServerData] = useState({});

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const restaurantID = params.get("restaurantID");
    console.log("Restaurant-ID:", restaurantID);

    if (restaurantID) {
      const apiCall = async () => {
        try {
          const resp = await fetch(`/api/restaurant/${restaurantID}/menu`);
          if (!resp.ok) {
            throw new Error("Fehler beim Abrufen der Restaurantdaten");
          }
          const data = await resp.json();
          setName(data.name);
          setServerData(data);
          console.log("Name: ", data.name);
          console.log("Daten empfangen:", data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      apiCall();
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Es tut uns sehr Leid, ein Fehler ist aufgetrten: {error}!</div>;

  const MenuSection = ({ title, menuItems }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const toggleExpand = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };

    const calcPrice = (price) => {
      setTotalPrice((oldPrice) => oldPrice + price);
    };


    const imageHandler = (new_img) => {
      //Bild wird umbenannt => (enthält user-id menü-id, und img-id)
      // Dann wir das Bild coprimiert
      // Als letztes wird es im ./img gespeichert
    }

    return (
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
        <div className="mb-3">
          <h3 className="text-center text-4xl font-semibold">{title}</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Speisen:</TableHead>
              <TableHead className="text-left">Beschreibung:</TableHead>
              <TableHead className="text-right">Preis:</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow
                  className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                  <TableCell className="text-gray-600">{item.description}</TableCell>
                  <TableCell className="text-right font-mono text-gray-800">{item.price}€</TableCell>
                </TableRow>
                {expandedIndex === index && (
                  <TableRow>
                    <TableCell colSpan="3" className="px-6 py-4">
                      <Image
                        src={require(`./img/${item.img}`)}
                        alt={item.name}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const Kategorie = ({ menuItems, name }) => {
    return (
      <MenuSection
        title={name}
        menuItems={menuItems}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center justify-center text-gray-900 font-sans p-8 absolute">
      <header className="mb-12 text-center w-full">
        <h1 className="text-5xl font-serif font-semibold italic tracking-wide">{name}</h1>
        <p className="mt-2 text-gray-600 italic max-w-md mx-auto text-2xl">{/*description*/}</p>
      </header>
      <main className="w-full max-w-9xl bg-opacity-20 rounded-xl shadow-lg p-8 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto grid gap-4">
          {serverData.menu?.categories?.map((category) => (
            <Kategorie
              key={category.id}
              menuItems={category.dishes}
              name={category.name}
            />
          ))}
        </div>
        <p className="mt-4">Gesamtpreis: {totalPrice.toFixed(2)}€</p>
        {/* Display raw JSON data for testing */}
        <pre className="mt-8 p-4 bg-gray-100 rounded-lg max-w-7xl overflow-auto text-sm">
          {JSON.stringify(serverData, null, 2)}
        </pre>
      </main>
      <div><h1>{}</h1></div>
    </div>
  );
}

export default Menu;
