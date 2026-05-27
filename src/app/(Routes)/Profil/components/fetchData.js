import { useEffect, useState } from "react";

const fetchRestaurantData = async (userID, signal) => {
  const response = await fetch("/api/user/profil/getData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userID }),
    signal,
  });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  


  return response.json();
};

const extractMenuData = (data) => {
  const restaurant = data?.userData?.restaurant;
  console.log("First Check!:", restaurant)
  const menu = restaurant?.menu[0];
  const categoryGroup = menu?.categoryGroup ?? [];
  categoryGroup.sort((a,b) => Number(a.position) - Number(b.position))
  return {
    restaurantID: restaurant?.id ?? "",
    bgColor: menu?.bgColor ?? "",
    font: menu?.font ?? "",
    categoryGroup,
    positionNum: categoryGroup.reduce((n, g) => n + (g?.categories?.length ?? 0), 0),
  };
};

export const useRestaurantData = (userID) => {
  const [serverData, setServerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;
    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setServerData(await fetchRestaurantData(userID, controller.signal));
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          const { toast } = await import("sonner");
          toast.error("Bitte melden Sie sich an");
        }
        else if (err.name !== "AbortError") console.error("Fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [userID]);

  console.log("Server Response-API:", serverData);
  console.log("Second Check", extractMenuData(serverData));
  return { serverData, isLoading, setIsLoading, ...extractMenuData(serverData) };
};
