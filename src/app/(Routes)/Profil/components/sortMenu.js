import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

// Reihenfolge auf drei Ebenen: Gruppen, Kategorien innerhalb einer Gruppe und
// Gerichte innerhalb einer Kategorie. Verschoben wird immer nur innerhalb der
// eigenen Ebene und desselben Elternteils — ein Kategoriewechsel läuft über
// den separaten "Verschieben"-Dialog (moveDish.js).
function SortComponents({ componentList, onSave }) {
  const normalize = (list) =>
    [...list]
      .sort((a, b) => a.position - b.position)
      .map((g) => ({
        ...g,
        // Kategorien und Gerichte kommen bereits sortiert aus getData
        // (orderBy position) — hier nur kopieren, nicht neu sortieren, sonst
        // würden Gerichte ohne Position (Altbestand) nach vorn rutschen.
        categories: [...(g.categories ?? [])].map((c) => ({ ...c, dishes: [...(c.dishes ?? [])] })),
      }));

  const [groups, setGroups] = useState(() => normalize(componentList));
  const [isSaving, setIsSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setGroups(normalize(componentList));
  }, [componentList]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (type, id, parentId) => {
    dragItem.current = { type, id, parentId };
  };

  const handleDragEnter = (type, id, parentId) => {
    dragOverItem.current = { type, id, parentId };
  };

  const move = (list, fromId, toId) => {
    const updated = [...list];
    const fromIdx = updated.findIndex((e) => e.id === fromId);
    const toIdx = updated.findIndex((e) => e.id === toId);
    if (fromIdx === -1 || toIdx === -1) return list;
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    return updated;
  };

  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;

    if (!from || !to || from.id === to.id || from.type !== to.type) return;

    if (from.type === "group") {
      setGroups((prev) => move(prev, from.id, to.id));
    }

    if (from.type === "category" && from.parentId === to.parentId) {
      setGroups((prev) => prev.map((g) => (g.id === from.parentId ? { ...g, categories: move(g.categories, from.id, to.id) } : g)));
    }

    if (from.type === "dish" && from.parentId === to.parentId) {
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          categories: g.categories.map((c) => (c.id === from.parentId ? { ...c, dishes: move(c.dishes, from.id, to.id) } : c)),
        })),
      );
    }
  };

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleSave = async () => {
    const snapshot = componentList;

    // Ausgangspositionen – nur die wirklich verschobenen Einträge senden.
    const groupBaseline = new Map(snapshot.map((g) => [g.id, g.position]));
    const catBaseline = new Map(snapshot.flatMap((g) => (g.categories ?? []).map((c) => [c.id, c.position])));
    const dishBaseline = new Map(snapshot.flatMap((g) => (g.categories ?? []).flatMap((c) => (c.dishes ?? []).map((d) => [d.id, d.position]))));

    const ordered = groups.map((g, i) => ({
      ...g,
      position: i,
      categories: g.categories.map((c, j) => ({
        ...c,
        position: j,
        dishes: c.dishes.map((d, k) => ({ ...d, position: k })),
      })),
    }));

    const changedGroups = ordered.map((g) => ({ id: g.id, position: g.position })).filter((g) => groupBaseline.get(g.id) !== g.position);
    const changedCategories = ordered.flatMap((g) => g.categories.map((c) => ({ id: c.id, position: c.position }))).filter((c) => catBaseline.get(c.id) !== c.position);
    // Gerichte ohne bisherige Position (Altbestand, position === null) bekommen
    // hier zum ersten Mal einen Wert — deshalb ist der Vergleich gegen null
    // gewollt und kein Fehler.
    const changedDishes = ordered
      .flatMap((g) => g.categories.flatMap((c) => c.dishes.map((d) => ({ id: d.id, position: d.position }))))
      .filter((d) => dishBaseline.get(d.id) !== d.position);

    if (changedGroups.length === 0 && changedCategories.length === 0 && changedDishes.length === 0) return;

    onSave?.(ordered);
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profil/sortMenu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups: changedGroups, categories: changedCategories, dishes: changedDishes }),
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Sortieren</DialogTitle>
          <DialogDescription>Gruppen, Kategorien und Gerichte per Drag &amp; Drop umsortieren. Verschoben wird jeweils innerhalb der eigenen Ebene.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto py-1">
          {groups.map((group) => (
            <div key={group.id} draggable onDragStart={() => handleDragStart("group", group.id)} onDragEnter={() => handleDragEnter("group", group.id)} onDragEnd={handleDrop} onDragOver={(e) => e.preventDefault()} className="rounded-lg border bg-card cursor-grab active:cursor-grabbing active:opacity-50 transition-opacity">
              <div className="flex items-center gap-2 px-3 py-2 border-b">
                <span className="text-muted-foreground select-none">⠿</span>
                <span className="font-medium text-sm">{group.name}</span>
              </div>

              <div className="flex flex-col gap-1 p-2">
                {group.categories.map((cat) => (
                  <div key={cat.id} className="rounded-md bg-muted/50">
                    <div
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
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-muted cursor-grab active:cursor-grabbing active:opacity-50 transition-opacity"
                    >
                      <span className="text-muted-foreground text-xs select-none">⠿</span>
                      <span className="text-sm flex-1 min-w-0 truncate">{cat.name}</span>
                      {cat.dishes.length > 0 && (
                        <button
                          type="button"
                          // draggable-Eltern: ohne stopPropagation startet der Klick einen Drag
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(cat.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap"
                        >
                          {cat.dishes.length} {cat.dishes.length === 1 ? "Gericht" : "Gerichte"} <span className={`inline-block transition-transform ${expanded[cat.id] ? "rotate-180" : ""}`}>▾</span>
                        </button>
                      )}
                    </div>

                    {expanded[cat.id] && (
                      <div className="flex flex-col gap-0.5 px-2 pb-2 pl-6">
                        {cat.dishes.map((dish) => (
                          <div
                            key={dish.id}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleDragStart("dish", dish.id, cat.id);
                            }}
                            onDragEnter={(e) => {
                              e.stopPropagation();
                              handleDragEnter("dish", dish.id, cat.id);
                            }}
                            onDragEnd={(e) => {
                              e.stopPropagation();
                              handleDrop();
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex items-center gap-2 px-2 py-1 rounded bg-background/70 hover:bg-background cursor-grab active:cursor-grabbing active:opacity-50 transition-opacity"
                          >
                            <span className="text-muted-foreground text-[10px] select-none">⠿</span>
                            <span className="text-xs truncate">{dish.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
