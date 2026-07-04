const TierSystem = {
  FreeTier: {
    DishLimit: 50,
    CategoryLimit: 7,
    allowedColorPallet: {},
  },
  Professional: {
    DishLimit: 200,
    CategoryLimit: 25,
    allowedColorPallet: { allAllowed: true },
  },
  Business: {
    DishLimit: 100,
    CategoryLimit: 15,
    allowedColorPallet: { allAllowed: true },
  },
};

export { TierSystem };
