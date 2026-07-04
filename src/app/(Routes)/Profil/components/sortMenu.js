import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

function SortComponents({ componentList, onSave }) {
  const [groups, setGroups] = useState([...componentList].sort((a, b) => a.position - b.position));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setGroups([...componentList].sort((a, b) => a.position - b.position));
  }, [componentList]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (type, id, groupId) => {
    dragItem.current = { type, id, groupId };
  };

  const handleDragEnter = (type, id, groupId) => {
    dragOverItem.current = { type, id, groupId };
  };

  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (!from || !to || from.id === to.id) return;

    if (from.type === "group" && to.type === "group") {
      const updated = [...groups];
      const fromIdx = updated.findIndex((g) => g.id === from.id);
      const toIdx = updated.findIndex((g) => g.id === to.id);
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      setGroups(updated.map((g, i) => ({ ...g, position: i })));
    }

    if (from.type === "category" && to.type === "category" && from.groupId === to.groupId) {
      const updated = groups.map((g) => {
        if (g.id !== from.groupId) return g;
        const cats = [...g.categories];
        const fromIdx = cats.findIndex((c) => c.id === from.id);
        const toIdx = cats.findIndex((c) => c.id === to.id);
        const [moved] = cats.splice(fromIdx, 1);
        cats.splice(toIdx, 0, moved);
        return { ...g, categories: cats.map((c, i) => ({ ...c, position: i })) };
      });
      setGroups(updated);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSave = async () => {
    const ordered = groups.map((g, i) => ({
      ...g,
      position: i,
      categories: [...g.categories].sort((a, b) => a.position - b.position).map((c, j) => ({ ...c, position: j })),
    }));
    const snapshot = componentList;

    // Ausgangspositionen – nur die wirklich verschobenen Einträge senden.
    const groupBaseline = new Map(snapshot.map((g) => [g.id, g.position]));
    const catBaseline = new Map(snapshot.flatMap((g) => g.categories.map((c) => [c.id, c.position])));

    const changedGroups = ordered
      .map((g) => ({ id: g.id, position: g.position }))
      .filter((g) => groupBaseline.get(g.id) !== g.position);
    const changedCategories = ordered
      .flatMap((g) => g.categories.map((c) => ({ id: c.id, position: c.position })))
      .filter((c) => catBaseline.get(c.id) !== c.position);

    // Nichts verschoben → keine Anfrage.
    if (changedGroups.length === 0 && changedCategories.length === 0) return;

    onSave?.(ordered);
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profil/sortMenu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups: changedGroups, categories: changedCategories }),
      });
      if (!res.ok) throw new Error();
      toast.success("Reihenfolge gespeichert");
    } catch {
      onSave?.(snapshot);
      toast.error("Fehler beim Speichern der Reihenfolge");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sortieren</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sortieren</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto py-1">
          {groups.map((group) => (
            <div key={group.id} draggable onDragStart={() => handleDragStart("group", group.id)} onDragEnter={() => handleDragEnter("group", group.id)} onDragEnd={handleDrop} onDragOver={(e) => e.preventDefault()} className="rounded-lg border bg-card cursor-grab active:cursor-grabbing active:opacity-50 transition-opacity">
              <div className="flex items-center gap-2 px-3 py-2 border-b">
                <span className="text-muted-foreground select-none">⠿</span>
                <span className="font-medium text-sm">{group.name}</span>
              </div>

              <div className="flex flex-col gap-1 p-2">
                {[...group.categories]
                  .sort((a, b) => a.position - b.position)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart("category", cat.id, group.id);
                      }}
                      onDragEnter={(e) => {
                        e.stopPropagation();
                        handleDragEnter("category", cat.id, group.id);
                      }}
                      onDragEnd={(e) => {
                        e.stopPropagation();
                        handleDrop();
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted cursor-grab active:cursor-grabbing active:opacity-50 transition-opacity"
                    >
                      <span className="text-muted-foreground text-xs select-none">⠿</span>
                      <span className="text-sm">{cat.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Abbrechen</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Speichern..." : "Speichern"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { SortComponents };
