"use client";

import React, { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { FaPen, FaTrash } from "react-icons/fa";
import { ArrowRightLeft, CheckCircle, Copy, XCircle } from "lucide-react";

import { SelectItem } from "./selectItem";
import { EdditCategoryMenu } from "./edditCategoryWin";
import { bgColorClass, bgColorStyle } from "./ColorPicker";
import { ALLERGENS } from "@/lib/allergens";

const RADIUS_CLASS = { none: "rounded-none", sm: "rounded-lg", md: "rounded-xl", xl: "rounded-3xl" };
const DENSITY_CLASS = { compact: "text-sm", normal: "", airy: "text-lg" };

const AllergenBadges = ({ allergens }) => {
  if (!allergens || allergens.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {allergens.map((key) => {
        const a = ALLERGENS.find((x) => x.key === key);
        return (
          <span key={key} title={a?.name ?? key} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
            {a?.id ?? "?"}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Eine Kategorie im Editor: Kopfzeile mit Aktionen und die Gericht-Tabelle.
 *
 * Bewusst auf Modulebene und nicht innerhalb von PageBuilder definiert — sonst
 * wird der Komponententyp bei jedem Render der Seite neu erzeugt, React mountet
 * alle Kategorien neu und der lokale Zustand (gewählte Farbe, Verfügbarkeit,
 * aufgeklappte Zeile) fällt auf die Serverwerte zurück.
 */
const MenuSection = ({
  title,
  menuItems,
  categoryId,
  groupName,
  bgColor,
  fontColor,
  borderRadius,
  elevated,
  leaderDots,
  titleAlign,
  titleUppercase,
  density,
  font,
  headingFont,
  deletedDishes,
  deletedCategories,
  onDeleteDish,
  onDeleteCategory,
  onDuplicateDish,
  onDuplicateCategory,
  onRequestMoveDish,
  restaurantId,
  userID,
  positionNum,
  allowPremiumColor,
  allowAvailability,
}) => {
  const [localBorderRadius, setLocalBorderRadius] = useState(borderRadius);
  const [localElevated, setLocalElevated] = useState(elevated ?? true);
  const [localBgColor, setLocalBgColor] = useState(bgColor);
  const [localFontColor, setLocalFontColor] = useState(fontColor ?? "");
  const [localLeaderDots, setLocalLeaderDots] = useState(leaderDots ?? false);
  const [localTitleAlign, setLocalTitleAlign] = useState(titleAlign || "center");
  const [localTitleUppercase, setLocalTitleUppercase] = useState(titleUppercase ?? false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
  const [changedItems, setChangedItems] = useState({});
  const [pendingDeleteDishId, setPendingDeleteDishId] = useState(null);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(false);

  const [stockMap, setStockMap] = useState(() => Object.fromEntries((menuItems ?? []).map((d) => [d.id, d.stock ?? "isAvailable"])));

  // Kommen frische Serverdaten an (Speichern, Preis-Massenänderung, Verschieben),
  // sind die optimistischen lokalen Kopien überholt — der Server gewinnt.
  // Ein reines Neurendern ändert die Array-Identität nicht, der Effekt läuft
  // also nicht bei jedem Tastendruck.
  useEffect(() => {
    setStockMap(Object.fromEntries((menuItems ?? []).map((d) => [d.id, d.stock ?? "isAvailable"])));
    setChangedItems({});
  }, [menuItems]);

  const isCategoryDeleted = deletedCategories.includes(categoryId);
  const displayItems = (menuItems ?? []).map((item) => (changedItems[item.id] ? { ...item, ...changedItems[item.id] } : item));

  const toggleAvailability = async (e, dishId) => {
    e.stopPropagation();
    const current = stockMap[dishId] ?? "isAvailable";
    const next = current === "isAvailable" ? "outOfStock" : "isAvailable";

    setStockMap((prev) => ({ ...prev, [dishId]: next }));
    try {
      const resp = await fetch("/api/user/profil/updateDishAvailability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishId, restaurantId, stock: next }),
      });
      if (!resp.ok) throw new Error("Fehler");
      toast.success(next === "isAvailable" ? "Gericht als verfügbar markiert" : "Gericht als nicht verfügbar markiert");
    } catch {
      setStockMap((prev) => ({ ...prev, [dishId]: current }));
      toast.error("Status konnte nicht geändert werden");
    }
  };

  const toggleExpand = (index) => setExpandedIndex(expandedIndex === index ? null : index);

  const openMenuItemEddit = (item) => {
    setSelectedItem(item);
    setOpenItem(true);
  };

  const fontStyle = !isCategoryDeleted && localFontColor ? { color: localFontColor } : {};

  // Aktionen pro Gericht — auf Mobil wird die Spalte sonst zu breit, deshalb wrap.
  const DishActions = ({ item }) => (
    <div className="flex gap-1 flex-wrap">
      <Button
        size="icon"
        variant="secondary"
        title="Gericht bearbeiten"
        onClick={(e) => {
          e.stopPropagation();
          openMenuItemEddit(item);
        }}
      >
        <FaPen />
      </Button>

      <Button
        size="icon"
        variant="outline"
        title="Gericht duplizieren"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicateDish({ dish: item, categoryName: title, groupName });
        }}
      >
        <Copy className="size-4" />
      </Button>

      <Button
        size="icon"
        variant="outline"
        title="In andere Kategorie verschieben"
        onClick={(e) => {
          e.stopPropagation();
          onRequestMoveDish({ dish: item, categoryId });
        }}
      >
        <ArrowRightLeft className="size-4" />
      </Button>

      <Button
        size="icon"
        variant="destructive"
        title="Gericht löschen"
        onClick={(e) => {
          e.stopPropagation();
          setPendingDeleteDishId(item.id);
        }}
      >
        <FaTrash />
      </Button>

      {allowAvailability && (
        <Button
          size="icon"
          variant="outline"
          title={stockMap[item.id] === "outOfStock" ? "Nicht verfügbar – klicken zum Aktivieren" : "Verfügbar – klicken zum Deaktivieren"}
          onClick={(e) => toggleAvailability(e, item.id)}
          className={stockMap[item.id] === "outOfStock" ? "border-red-400 text-red-500 hover:bg-red-50" : "border-green-400 text-green-600 hover:bg-green-50"}
        >
          {stockMap[item.id] === "outOfStock" ? <XCircle className="size-4" /> : <CheckCircle className="size-4" />}
        </Button>
      )}
    </div>
  );

  return (
    <div className={`${RADIUS_CLASS[localBorderRadius] ?? "rounded-xl"} ${localElevated ? "shadow-lg" : "border border-gray-200"} ${DENSITY_CLASS[density] ?? ""} max-w-7xl h-full max-h-full w-full overflow-hidden ${bgColorClass(localBgColor)}`} style={bgColorStyle(localBgColor)}>
      <div className={`relative flex items-center justify-center py-6 px-4 border-b ${bgColorClass(localBgColor)}`} style={bgColorStyle(localBgColor)}>
        <h3 className={`w-full text-2xl sm:text-3xl md:text-4xl font-semibold ${localTitleUppercase ? "uppercase tracking-widest" : ""} ${isCategoryDeleted ? "text-red-600 line-through" : ""}`} style={{ ...fontStyle, textAlign: localTitleAlign, ...(headingFont ? { fontFamily: headingFont } : {}) }}>
          {title}
        </h3>

        <div className="absolute left-2 sm:left-4 flex gap-2">
          <Button onClick={() => setOpenCategoryMenu((o) => !o)} size="icon" variant="outline" title="Kategorie gestalten">
            <FaPen />
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" title="Kategorie duplizieren" onClick={() => onDuplicateCategory({ categoryName: title, groupName, dishes: displayItems })}>
                <Copy className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Kategorie samt Gerichten kopieren</TooltipContent>
          </Tooltip>

          <Button variant="destructive" size="icon" onClick={() => setConfirmDeleteCategory(true)} title="Kategorie löschen">
            <FaTrash />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full table-fixed" style={{ fontFamily: font }}>
          <colgroup>
            <col className="w-56" />
            <col className="w-full" />
            <col className="w-24" />
          </colgroup>
          <TableHeader>
            <TableRow className={`hover:bg-gray-100 w-full ${bgColorClass(localBgColor)}`} style={bgColorStyle(localBgColor)}>
              <TableHead className="text-left" style={fontStyle}>
                Aktionen
              </TableHead>
              <TableHead className="text-left" style={fontStyle}>
                Speisen
              </TableHead>
              <TableHead className="text-right" style={fontStyle}>
                Preis
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-gray-400 py-6">
                  Noch keine Gerichte in dieser Kategorie
                </TableCell>
              </TableRow>
            ) : (
              displayItems.map((item, index) => {
                const isDeleted = deletedDishes.includes(item.id);
                return (
                  <Fragment key={item.id ?? index}>
                    <TableRow className={`${isDeleted ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-50"} transition-colors duration-200 cursor-pointer border-b`} onClick={() => toggleExpand(index)}>
                      <TableCell className="align-middle">
                        <DishActions item={item} />
                      </TableCell>

                      <TableCell className={`align-middle ${isDeleted ? "text-red-600 line-through" : "text-gray-900"}`} style={isDeleted ? {} : fontStyle}>
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className={`font-serif truncate ${stockMap[item.id] === "outOfStock" ? "text-gray-400" : ""}`}>{item.name}</span>
                            {localLeaderDots && <span aria-hidden className="flex-1 min-w-6 border-b border-dotted border-current opacity-40" />}
                          </div>
                          {item.description && (
                            <span className="text-sm text-gray-500" style={isDeleted ? {} : fontStyle}>
                              {item.description}
                            </span>
                          )}
                          {allowAvailability && stockMap[item.id] === "outOfStock" && <span className="text-xs font-medium text-red-500 mt-0.5">● Nicht verfügbar</span>}
                          <AllergenBadges allergens={item.allergens} />
                        </div>
                      </TableCell>

                      <TableCell className={`text-right font-mono align-middle ${isDeleted ? "text-red-600 line-through" : "text-gray-800"}`} style={isDeleted ? {} : fontStyle}>
                        {Number(item.price).toFixed(2)}€
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <SelectItem open={openItem} onOpenChange={setOpenItem} selectedItem={selectedItem} setChangedItem={(item) => setChangedItems((prev) => ({ ...prev, [item.id]: item }))} category={title} restaurantId={restaurantId} userID={userID} />

      {/* Bestätigungs-Dialog: Gericht löschen */}
      <ConfirmDialog
        open={pendingDeleteDishId !== null}
        onOpenChange={(open) => !open && setPendingDeleteDishId(null)}
        title="Gericht löschen?"
        description="Das Gericht wird beim nächsten Speichern entfernt."
        confirmLabel="Löschen"
        onConfirm={() => {
          onDeleteDish(pendingDeleteDishId);
          setPendingDeleteDishId(null);
        }}
      />

      {/* Bestätigungs-Dialog: Kategorie löschen */}
      <ConfirmDialog
        open={confirmDeleteCategory}
        onOpenChange={setConfirmDeleteCategory}
        title="Kategorie löschen?"
        description="Die gesamte Kategorie und alle Gerichte darin werden entfernt."
        confirmLabel="Kategorie löschen"
        onConfirm={() => {
          onDeleteCategory(categoryId);
          setConfirmDeleteCategory(false);
        }}
      />

      <EdditCategoryMenu
        open={openCategoryMenu}
        onOpenChange={setOpenCategoryMenu}
        selectedCategory={{
          name: title,
          position: 0,
          color: localBgColor,
          fontColor: localFontColor,
          borderRadius: localBorderRadius,
          elevated: localElevated,
          leaderDots: localLeaderDots,
          titleAlign: localTitleAlign,
          titleUppercase: localTitleUppercase,
          id: categoryId,
        }}
        setChangedCategory={() => {}}
        onBorderRadiusChange={setLocalBorderRadius}
        onElevatedChange={setLocalElevated}
        onColorChange={setLocalBgColor}
        onFontColorChange={setLocalFontColor}
        onLeaderDotsChange={setLocalLeaderDots}
        onTitleAlignChange={setLocalTitleAlign}
        onTitleUppercaseChange={setLocalTitleUppercase}
        category={title}
        restaurantId={restaurantId}
        userID={userID}
        categoryId={categoryId}
        position={positionNum}
        allowPremiumColor={allowPremiumColor}
      />
    </div>
  );
};

export { MenuSection, AllergenBadges };
