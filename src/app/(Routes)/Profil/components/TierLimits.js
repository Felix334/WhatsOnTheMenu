const TierSystem = {
    FreeTier: {
        DishLimit: 50,
        CategoryLimit: 7,
        allowedFonts: {},
        allowedColorPallet: {},
    },
    Business : {
        DishLimit: 100,
        CategoryLimit: 15,
        allowedColorPallet: {allAllowed: true},
    },
    PremiumTier: {
        DishLimit: 200,
        CategoryLimit: 25,
        allowedFonts: {},
        allowedColorPallet: {allAllowed: true},
        allowedCalendarLimit: {days: 365}
    },
}

export {TierSystem}