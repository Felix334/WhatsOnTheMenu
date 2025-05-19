"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
// Das richtige Projekt
// Noch nicht auf github übertragen + Datenbank nicht verbunden

const menuItems = [
  {
    name: "Coq au Vin",
    price: "18.00€",
    description: "Chicken, red wine, mushrooms, onions, garlic, herbs",
    img: "Schnitzel-mit-Spaetzle-auf-einer-Pilz-Rahmsosse-4bb0ce7036881.webp",
    priceVal: 18,
  },
  {
    name: "Ratatouille",
    price: "15.00€",
    description: "Eggplant, zucchini, tomatoes, peppers, garlic, herbs",
    img: "Schnitzel-mit-Spaetzle-auf-einer-Pilz-Rahmsosse-4bb0ce7036881.jpg",
    priceVal: 15,
  },
  {
    name: "Bouillabaisse",
    price: "22.00€",
    description: "Fish, shellfish, saffron, garlic, fennel, tomato",
    img: "Schnitzel-mit-Spaetzle-auf-einer-Pilz-Rahmsosse-4bb0ce7036881.jpg",
    priceVal: 22,
  },
  {
    name: "Crème Brûlée",
    price: "9.00€",
    description: "Cream, vanilla, sugar, egg yolks",
    img: "Schnitzel-mit-Spaetzle-auf-einer-Pilz-Rahmsosse-4bb0ce7036881.jpg",
    priceVal: 9,
  },
  {
    name: "Tarte Tatin",
    price: "12.00€",
    description: "Apples, sugar, butter, pastry",
    img: "tarte-tatin.jpg",
    priceVal: 12,
  },
  {
    name: "Escargots",
    price: "14.50€",
    description: "Snails, garlic, parsley, butter",
    img: "escargots.jpg",
    priceVal: 14.5,
  },
  {
    name: "Cassoulet",
    price: "20.00€",
    description: "White beans, meat, pork sausage, duck",
    img: "cassoulet.jpg",
    priceVal: 20,
  },
  {
    name: "Macarons",
    price: "8.00€",
    description: "Meringue-based cookies, ganache filling",
    img: "macarons.jpg",
    priceVal: 8,
  },
  {
    name: "Profiteroles",
    price: "10.00€",
    description: "Cream-filled choux pastry balls",
    img: "profiteroles.jpg",
    priceVal: 10,
  },
  {
    name: "Quiche Lorraine",
    price: "16.00€",
    description: "Eggs, cream, lardons, cheese",
    img: "quiche-lorraine.jpg",
    priceVal: 16,
  },
  {
    name: "Crêpes Suzette",
    price: "11.00€",
    description: "Thin pancakes, orange butter, Grand Marnier",
    img: "crepes-suzette.jpg",
    priceVal: 11,
  },
  {
    name: "Schnitzel mit Spätzle",
    price: "12.50€",
    description: "Schnitzel mit Spätzle",
    img: "SchnitzelMitSpätzle.jpg",
    priceVal: 12.5,
  },
];

export default function Menu() {
  /*const router = useRouter();
  const { id } = router.query;*/
  useEffect(() => {
    const apiCall = async (id) => {
      const resp = await fetch(`/api/restaurant/${id}/menu`);
      let data = await resp.json();
      cacheTag(data);
      console.log(data);
      return data;
    };
    apiCall();
  }, []);

  return (
    <div className="bg-gradient-to-br min-w-1xl from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center py-5">
      <header className="mb-12 text-center w-full">
        <h1 className="text-5xl font-serif font-semibold text-gray-900 tracking-wide">La Belle Époque</h1>
        <p className="mt-2 text-gray-600 italic max-w-md mx-auto">A taste of fine dining</p>
      </header>
      <div className="max-w-7xl min-w-4xl grid gap-4">
        <Getränke />
        <Vorspeisen />
        <Hauptspeisen />
        <Nachspeise />
      </div>
    </div>
  );
}

const Vorspeisen = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [price, setPrice] = useState(0);
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const getImage = (image_name) => {
    if (image_name) {
      return require(`./img/${image_name}`);
    }
  };
  const calcPrice = (Price) => {
    setPrice((oldPrice) => oldPrice + Price);
  };
  return (
    <main className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
      <div className="mb-3">
        <h3 className="text-center text-4xl font-semibold">Vorspeisen</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Speise</TableHead>
            <TableHead className="text-left">Beschreibung</TableHead>
            <TableHead className="text-right">Preis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer" onClick={() => toggleExpand(index)}>
                <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                <TableCell className="text-gray-600">{item.description}</TableCell>
                <TableCell className="text-right font-mono text-gray-800">{item.price}</TableCell>
              </TableRow>
              {expandedIndex === index && (
                <TableRow>
                  <TableCell colSpan="3" className="px-6 py-4">
                    <Image src={getImage(item.img)} alt={item.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div>Preis: {price}</div>
    </main>
  );
};

function Hauptspeisen() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [price, setPrice] = useState(0);
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const getImage = (image_name) => {
    if (image_name) {
      return require(`./img/${image_name}`);
    }
  };
  const calcPrice = (Price) => {
    setPrice((oldPrice) => oldPrice + Price);
  };
  return (
    <main className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
      <div className="mb-3">
        <h3 className="text-center text-4xl font-semibold">Hauptspeisen</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Speise</TableHead>
            <TableHead className="text-left">Beschreibung</TableHead>
            <TableHead className="text-right">Preis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer" onClick={() => toggleExpand(index)}>
                <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                <TableCell className="text-gray-600">{item.description}</TableCell>
                <TableCell className="text-right font-mono text-gray-800">{item.price}</TableCell>
              </TableRow>
              {expandedIndex === index && (
                <TableRow>
                  <TableCell colSpan="3" className="px-6 py-4">
                    <Image src={getImage(item.img)} alt={item.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div>Preis: {price}</div>
    </main>
  );
}
const Nachspeise = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [price, setPrice] = useState(0);
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const getImage = (image_name) => {
    if (image_name) {
      return require(`./img/${image_name}`);
    }
  };
  const calcPrice = (Price) => {
    setPrice((oldPrice) => oldPrice + Price);
  };
  return (
    <main className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
      <div className="mb-3">
        <h3 className="text-center text-4xl font-semibold">Nachspeisen</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Speise</TableHead>
            <TableHead className="text-left">Beschreibung</TableHead>
            <TableHead className="text-right">Preis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer" onClick={() => toggleExpand(index)}>
                <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                <TableCell className="text-gray-600">{item.description}</TableCell>
                <TableCell className="text-right font-mono text-gray-800">{item.price}</TableCell>
              </TableRow>
              {expandedIndex === index && (
                <TableRow>
                  <TableCell colSpan="3" className="px-6 py-4">
                    <Image src={getImage(item.img)} alt={item.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div>Preis: {price}</div>
    </main>
  );
};

const Getränke = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [price, setPrice] = useState(0);
  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const getImage = (image_name) => {
    if (image_name) {
      return require(`./img/${image_name}`);
    }
  };
  const calcPrice = (Price) => {
    setPrice((oldPrice) => oldPrice + Price);
  };
  return (
    <main className="bg-white rounded-xl shadow-lg max-w-6xl w-full py-12 p-8">
      <div className="mb-3">
        <h3 className="text-center text-4xl font-semibold">Getränke</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Speise</TableHead>
            <TableHead className="text-left">Beschreibung</TableHead>
            <TableHead className="text-right">Preis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow className="hover:bg-yellow-50 transition-colors duration-200 cursor-pointer" onClick={() => toggleExpand(index)}>
                <TableCell className="font-serif text-gray-900">{item.name}</TableCell>
                <TableCell className="text-gray-600">{item.description}</TableCell>
                <TableCell className="text-right font-mono text-gray-800">{item.price}</TableCell>
              </TableRow>
              {expandedIndex === index && (
                <TableRow>
                  <TableCell colSpan="3" className="px-6 py-4">
                    <Image src={getImage(item.img)} alt={item.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div>Preis: {price}</div>
    </main>
  );
};
