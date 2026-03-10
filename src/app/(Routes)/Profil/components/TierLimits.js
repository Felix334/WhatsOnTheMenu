const TierSystem = {
    FreeTier: {
        DishLimit: 20,
        CategoryLimit: 7,
        allowedFonts: {},
        allowedColorPallet: {},
    },
    PremiumTier: {
        DishLimit: 100,
        CategoryLimit: 15,
        allowedFonts: {},
        allowedColorPallet: {allAllowed: true},
        allowedCalendarLimit: {}
    }
}

export {TierSystem}