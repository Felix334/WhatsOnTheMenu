import { useEffect, useState, useCallback } from "react";

let cachedData = null;

const consumeSkipFlag = () => {
  if (typeof window === "undefined") return false;
  const skip = sessionStorage.getItem("profil_skip_refetch") === "1";
  if (skip) sessionStorage.removeItem("profil_skip_refetch");
  return skip;
};

export const markUserAnsichtNavigation = () => {
  if (typeof window !== "undefined") sessionStorage.setItem("profil_skip_refetch", "1");
};

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
  const menu = restaurant?.menu[0];
  const categoryGroup = menu?.categoryGroup ?? [];
  categoryGroup.sort((a, b) => Number(a.position) - Number(b.position));
  return {
    restaurantID: restaurant?.id ?? "",
    bgColor: menu?.bgColor ?? "",
    font: menu?.font ?? "",
    headingFont: menu?.headingFont ?? "",
    density: menu?.density ?? "",
    categoryGroup,
    positionNum: categoryGroup.reduce((n, g) => n + (g?.categories?.length ?? 0), 0),
  };
};

export const useRestaurantData = (userID) => {
  const [serverData, setServerDataState] = useState(cachedData);
  // No spinner when cache already has data
  const [isLoading, setIsLoading] = useState(cachedData === null);

  const setServerData = useCallback((updater) => {
    setServerDataState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      cachedData = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!userID) return;

    // Skip refetch when returning from User-Ansicht and cache is warm
    if (cachedData !== null && consumeSkipFlag()) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        // Only show full loading spinner on first load (no cache)
        if (cachedData === null) setIsLoading(true);

        const data = await fetchRestaurantData(userID, controller.signal);
        if (process.env.NODE_ENV === "development") {
          console.log("Server Data", data);
        }
        cachedData = data;
        setServerDataState(data);
      } catch (err) {
        if (err.message === "UNAUTHORIZED") {
          const { toast } = await import("sonner");
          toast.error("Bitte melden Sie sich an");
        } else if (err.name !== "AbortError") {
          console.error("Fetch failed:", err);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [userID]);

  return { serverData, setServerData, isLoading, setIsLoading, ...extractMenuData(serverData) };
};
