const TierSystem = {
    FreeTier: {
        DishLimit: 30,
        CategoryLimit: 8,
        allowedFonts: {},
        allowedColorPallet: {},
    },
    PremiumTier: {
        DishLimit: 100,
        CategoryLimit: 30,
        allowedFonts: {},
        allowedColorPallet: {allAllowed: true},
        allowedCalendarLimit: {}
    }
}

export {TierSystem}