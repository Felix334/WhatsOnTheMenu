import { MENU_ENTRY_LIMITS } from "@/lib/menuLimits";

const TierSystem = {
  FreeTier: {
    DishLimit: MENU_ENTRY_LIMITS.FreeTier.DishLimit,
    CategoryLimit: MENU_ENTRY_LIMITS.FreeTier.CategoryLimit,
    allowedColorPallet: {},
  },
  Professional: {
    DishLimit: MENU_ENTRY_LIMITS.Professional.DishLimit,
    CategoryLimit: MENU_ENTRY_LIMITS.Professional.CategoryLimit,
    allowedColorPallet: { allAllowed: true },
  },
  Business: {
    DishLimit: MENU_ENTRY_LIMITS.Business.DishLimit,
    CategoryLimit: MENU_ENTRY_LIMITS.Business.CategoryLimit,
    allowedColorPallet: { allAllowed: true },
  },
};

export { TierSystem };
