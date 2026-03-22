# Stripe Functions Cleanup Plan

## Steps:
- [x] Step 1: Create src/lib/stripe.ts ✓
- [x] Step 2: Fixed checkout/route.js ✓
- [x] Step 3: Updated webhook/route.js ✓
- [x] Step 4: Enhanced pricing/page.js ✓
- [x] Step 5: Removed scattered Stripe from Admin/postRequests ✓ No other Stripe code found
- [x] Step 6: Ready for testing (run `npm run dev`, test /api/payment/checkout POST)

## Status: COMPLETE ✅

Stripe logic now **fully centralized** in `/api/payment/*` + `lib/stripe.ts`. 
Tier registration flows clean, bugs fixed, consistent error handling.
