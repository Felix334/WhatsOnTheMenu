import { useEffect, useState } from "react";

// --- Fetch function ---
const fetchRestaurantData = async (userID, signal) => {
  console.log("Frage Daten an")
  const response = await fetch("/api/user/profil/getData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID }),
    signal,
  });

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
};

// --- Helper ---
const extractMenuData = (freshData) => {
  const restaurant = freshData?.userData?.restaurant;
  const menu = restaurant?.menu;

  if (!menu) {
    return {
      restaurantID: "",
      bgColor: "",
      font: "",
      categoryGroup: [],
      count: 0,
    };
  }

  const categoryGroup = menu?.categoryGroup || [];

  const count = categoryGroup.reduce(
    (total, group) => total + (group?.categories?.length || 0),
    0
  );

  return {
    restaurantID: restaurant?.id || "",
    bgColor: menu?.bgColor || "",
    font: menu?.font || "",
    categoryGroup,
    count,
  };
};

// --- Hook ---
export const useRestaurantData = (userID) => {
const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bgColorState, setBgColorState] = useState(""); // Local state for bgColor with setter
  console.log("Suche restaurant mit ID:", userID)

  useEffect(() => {
    if (!userID) return;

    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true);

        const freshData = await fetchRestaurantData(
          userID,
          controller.signal
        );

        console.log("Server Response:", freshData);

        setServerData(freshData);
        
        // Initialize local bgColor state from derived data
        const derived = extractMenuData(freshData);
        setBgColorState(derived.bgColor);
      } catch (error) {
        if (error.message === "UNAUTHORIZED") {
          window.alert("Bitte melden Sie sich an");
        } else if (error.name !== "AbortError") {
          console.error("Fetch failed:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [userID]);

  // 🔥 Derived data (kein extra State mehr nötig)
  const derived = extractMenuData(serverData);
  const {
    restaurantID,
    bgColor, // derived, read-only
    font,
    categoryGroup,
    count: positionNum,
  } = derived;

  return {
    serverData,
    isLoading,
    restaurantID,
    bgColor: bgColorState, // use mutable state
    font,
    categoryGroup,
    positionNum,
    setBgColor: setBgColorState, // provide setter for UI updates
    setIsLoading,
  };

};