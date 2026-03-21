# Stripe System Fix TODO

## [x] Step 1: Create this TODO.md (done)

## [x] Step 2: Fix webhook/route.js - Retrieve subscription price, create restaurantQueue on success, handle invoice.paid

## [x] Step 3: Fix checkout/route.js - Remove premature DB writes, pass restaurant via metadata, support multiple tiers if env set

## [x] Step 4: Update pricing/page.js - Add form to collect restaurant details before checkout for Pro tier

## [ ] Step 5: Test locally - Check env vars, use Stripe CLI for webhook, verify flow: pricing -> checkout -> success -> DB updates

## [ ] Step 6: Add server verification to success page (optional)

**Run after all edits:**
- `npm run dev`
- Test Pro checkout from /pricing
- Check console/DB for correct updates only on payment success

