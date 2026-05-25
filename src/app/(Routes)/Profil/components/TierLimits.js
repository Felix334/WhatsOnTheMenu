const TierSystem = {
    FreeTier: {
        DishLimit: 50,
        CategoryLimit: 7,
        allowedFonts: {},
        allowedColorPallet: {},
    },
    PremiumTier: {
        DishLimit: 200,
        CategoryLimit: 15,
        allowedFonts: {},
        allowedColorPallet: {allAllowed: true},
        allowedCalendarLimit: {days: 365}
    },
}

export {TierSystem}