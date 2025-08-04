import { Table, TableBody, TableHead, TableRow, TableCell, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


const MenuSection = ({ section, toggleOpenEditWin }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 my-4">
      <h3 className="text-2xl font-semibold">{section.title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Speise</TableHead>
            <TableHead>Beschreibung</TableHead>
            <TableHead className="text-right">Preis</TableHead>
            <Button onClick={toggleOpenEditWin}>+</Button>
          </TableRow>
        </TableHeader>
        <TableBody>
          {section.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">{item.price}€</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuSection