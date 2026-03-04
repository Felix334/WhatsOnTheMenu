# Edge Functions Optimization Plan

## Information Gathered

After analyzing the codebase, I found several issues preventing optimal Edge Function performance:

### 1. **Prisma Client Setup** (`src/lib/prisma.ts`)
- Using PostgreSQL adapter (`PrismaPg`) with connection pool - NOT Edge compatible
- No Edge runtime support

### 2. **API Routes Issues**
- Most routes don't specify `runtime` or `dynamic` options
- Using `bcrypt` for password hashing - NOT Edge compatible (should use `@node-rs/argon2`)
- No caching headers on GET routes
- Heavy nested database queries without pagination

### 3. **Specific Route Problems**
- `menu/route.js` - Fetches ALL data (categories, dishes, ingredients, reviews) in one query
- `getData/route.js` - Very deep nested includes, no pagination
- `List/route.js` - Fetches ALL restaurants without pagination
- `login/route.ts` - Uses bcrypt which doesn't work in Edge runtime

---

## Plan

### Step 1: Update Prisma for Edge Compatibility
- Create Edge-optimized Prisma client
- Use Prisma's built-in connection pooling

### Step 2: Optimize Individual API Routes
- Add `export const runtime = 'edge'` to appropriate routes
- Add caching headers for read-only GET routes
- Add `export const dynamic = 'force-dynamic'` where needed

### Step 3: Optimize Database Queries
- Add pagination to list endpoints
- Select only required fields instead of full includes
- Implement cursor-based pagination for large datasets

### Step 4: Edge-Compatible Authentication
- Replace bcrypt with Edge-compatible hashing (@node-rs/argon2)

---

## Files to Edit

1. `src/lib/prisma.ts` - Edge-compatible Prisma setup
2. `src/app/api/restaurant/[restaurantID]/menu/route.js` - Add caching, pagination
3. `src/app/api/restaurant/List/route.js` - Add caching, pagination
4. `src/app/api/user/profil/getData/route.js` - Add caching
5. `src/app/api/auth/login/route.ts` - Edge-compatible hashing
6. Other API routes as needed

---

## Follow-up Steps

1. Install `@node-rs/argon2` for Edge-compatible password hashing
2. Test all routes after changes
3. Monitor Edge function cold start times
4. Consider adding response caching at CDN level

