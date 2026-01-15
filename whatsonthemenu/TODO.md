# Database Adjustments Implementation Plan

## Steps to Complete:
- [x] Add RestaurantQueue model for pending restaurant submissions with user verification
- [x] Modify Category model: add bgColor, font, fontColor fields
- [x] Add parentId field to User model for hierarchical accounts (parent accounts for chains)
- [x] Add Company model for parent companies with sub-accounts for employees
- [x] Expand Role enum to include Manager, Executive, etc. for executive rights
- [x] Add Dashboard model linked to User for employee dashboards
- [x] Add Subscription enum and subscription field to User model for different subscription accounts
- [x] Add Payment model to store payments in DB
- [x] Add Report model linked to Dish (and possibly others) for report system, viewable in admin dashboard
- [x] Add EmailInbox model for email inbox functionality
- [x] Run Prisma migration to apply schema changes
