// hooks/useRestaurantData.js

import { useEffect, useState } from "react";

// --- Fetch function ---
const fetchRestaurantData = async (userID, signal) => {
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

// --- Helper to extract data ---
const extractMenuData = (freshData) => {
  const restaurant = freshData?.userData?.restaurant;
  const menu = restaurant?.menu;

  if (!Array.isArray(menu) || menu.length === 0) {
    return { categoryGroup: [], count: 0 };
  }

  const categoryGroup = menu[0]?.categoryGroup;

  if (!Array.isArray(categoryGroup)) {
    return { categoryGroup: [], count: 0 };
  }

  const count = categoryGroup.reduce(
    (total, group) => total + (group?.categories?.length || 0),
    0
  );

  return {
    restaurantID: restaurant?.id,
    bgColor: menu[0]?.bgColor || "",
    font: menu[0]?.font || "",
    categoryGroup,
    count,
  };
};

// --- Custom Hook ---
export const useRestaurantData = (userID) => {
  const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantID, setRestaurantID] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [font, setFont] = useState("");
  const [positionNum, setPositionNum] = useState(0);

  useEffect(() => {
    if (!userID) return;

    const controller = new AbortController();

    const loadData = async () => {
      try {
        setIsLoading(true)
        const freshData = await fetchRestaurantData(userID, controller.signal);

        console.log("Server Response:", freshData);
        if(freshData){
          setServerData(freshData)
          setIsLoading(false)
        }


        const {
          restaurantID,
          bgColor,
          font,
          count,
          categoryGroup,
        } = extractMenuData(freshData);

        setRestaurantID(restaurantID);
        setBgColor(bgColor);
        setFont(font);
        setPositionNum(count);

        console.log("Kategorien:", categoryGroup);
        console.log("Count:", count);
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

  return {
    serverData,
    isLoading,
    restaurantID,
    bgColor,
    font,
    positionNum,
    setBgColor,
    setIsLoading
  };
};
