# Fix categoryGroupUpdate type in setData/route.ts

## Steps:
- [x] 1. Add CategoryGroupUpdateEntry interface to src/app/api/user/profil/setData/route.ts
- [x] 2. Replace the find((e: any)...) line with typed type guard version
- [x] 3. Test the API endpoint

Fixed! The 'any' type issue is resolved with proper type guard.
