"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";

const componentsList = [
  { type: 'headline', label: 'Headline' },
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'menuSection', label: 'Menu Section' }
];

const MenuSection = ({ section }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-2xl font-semibold">{section.title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-left">Speise</TableCell>
            <TableCell className="text-left">Beschreibung</TableCell>
            <TableCell className="text-right">Preis</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {section.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function PageBuilder() {
  const [components, setComponents] = useState([]);

  const addComponent = (type) => {
    if (type === 'menuSection') {
      const newSection = {
        type,
        title: 'New Section',
        items: []
      };
      setComponents([...components, newSection]);
    } else {
      setComponents([...components, { type, content: '' }]);
    }
  };

  const updateContent = (index, value) => {
    const updated = [...components];
    updated[index].content = value;
    setComponents(updated);
  };

  const addMenuItem = (sectionIndex) => {
    const updatedSections = [...components];
    const newItem = {
      name: 'New Dish',
      description: 'Description here...',
      price: '0.00€'
    };
    updatedSections[sectionIndex].items.push(newItem);
    setComponents(updatedSections);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Simple Menu Builder</h2>
      <div className="flex gap-4 mb-6">
        {componentsList.map(({ type, label }) => (
          <Button key={type} onClick={() => addComponent(type)}>{label}</Button>
        ))}
      </div>
      <div className="space-y-4">
        {components.map((comp, index) => {
          if (comp.type === 'menuSection') {
            return (
              <div key={index} className="border p-4 rounded-xl shadow-md">
                <MenuSection section={comp} />
                <Button onClick={() => addMenuItem(index)}>Speise hinzufügen</Button>
              </div>
            );
          }
          return (
            <div key={index} className="border p-4 rounded-xl shadow-md">
              <h1 className="text-3xl font-bold">{comp.content || 'Headline'}</h1>
              <input
                type="text"
                value={comp.content}
                onChange={(e) => updateContent(index, e.target.value)}
                placeholder="Enter content..."
                className="mt-2 p-2 w-full border rounded"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
