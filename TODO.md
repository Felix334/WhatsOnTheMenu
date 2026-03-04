# Edge Functions Optimization - TODO List

## Step 1: Update Prisma for Edge Compatibility
- [x] Create Edge-optimized Prisma client setup
- [ ] Remove manual `$disconnect()` calls from all routes

## Step 2: Optimize API Routes
- [ ] Add Edge runtime to `/api/restaurant/[restaurantID]/menu/route.js`
- [ ] Add Edge runtime to `/api/restaurant/List/route.js`
- [ ] Add Edge runtime to `/api/user/profil/getData/route.js`
- [ ] Add Edge runtime to `/api/auth/login/route.ts`
- [ ] Add Edge runtime to other GET routes

## Step 3: Add Caching Headers
- [ ] Add cache headers to read-only GET routes
- [ ] Add revalidation times where appropriate

## Step 4: Optimize Database Queries
- [ ] Optimize menu route - select only needed fields
- [ ] Add pagination to list endpoints

## Step 5: Edge-Compatible Authentication
- [ ] Install @node-rs/argon2
- [ ] Replace bcrypt with argon2 in login/register routes

