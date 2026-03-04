# Edge Functions Optimization - TODO List

## Step 1: Update Prisma for Edge Compatibility
- [x] Create Edge-optimized Prisma client setup
- [x] Remove manual `$disconnect()` calls from all routes

## Step 2: Optimize API Routes
- [x] Add Edge runtime to `/api/restaurant/[restaurantID]/menu/route.js`
- [x] Add Edge runtime to `/api/restaurant/List/route.js`
- [x] Add dynamic export to `/api/user/profil/getData/route.js`
- [x] Add dynamic export to `/api/auth/login/route.ts`

## Step 3: Add Caching Headers
- [x] Add cache headers to read-only GET routes
- [x] Add revalidation times where appropriate

## Step 4: Remove next-auth from Edge routes
- [x] Removed unused next-auth imports from Edge routes





