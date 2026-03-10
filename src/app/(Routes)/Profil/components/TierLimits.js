const TierSystem = {
    FreeTier: {
        DishLimit: 30,
        CategoryLimit: 8,
        allowedFonts: {},
        allowedColorPallet: {},
    },
    PremiumTier: {
        DishLimit: 200,
        CategoryLimit: 20,
        allowedFonts: {},
        allowedColorPallet: {allAllowed: true},
        allowedCalendarLimit: {}
    }
}

export {TierSystem}