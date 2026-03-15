# Stripe Payment Integration - Approved Plan

## Steps (6/13 completed):

### Backend Updates (3 steps)
1. [x] Update `src/app/api/payment/checkout/route.js` - Accept tier/user, create customer, use real price_id.
2. [x] Update `src/app/api/payment/webhook/route.js` - Parse metadata userId, update User subscription/status.
3. [x] Create `src/app/api/restaurant/requestRegister/ProfessionalTier/route.js` - Handle post-payment restaurant creation.

### Frontend Integration (6 steps)
4. [x] Create `src/app/(Routes)/pricing/page.js` - Tier selection page.
5. [x] Create `src/app/(Routes)/pricing/success/page.js` - Success page with redirect.
6. [x] Create `src/app/(Routes)/pricing/cancel/page.js` - Cancel page with retry.
7. [x] Edit `src/app/(Routes)/ErstelleRestaurantAccount/Professional/page.js` - Add Stripe checkout button.
8. [x] Edit `src/app/(Routes)/ErstelleRestaurantAccount/FreeTier/page.js` - Add upgrade to Pro button.
9. [x] Edit `src/app/(Routes)/Profil/page.js` - Add subscription management/upgrade UI.

### Frontend Integration (6 steps)
4. [ ] Create `src/app/(Routes)/pricing/page.js` - Tier selection page.
5. [ ] Create `src/app/(Routes)/success/page.js` - Success page with redirect.
6. [ ] Create `src/app/(Routes)/cancel/page.js` - Cancel page with retry.
7. [ ] Edit `src/app/(Routes)/ErstelleRestaurantAccount/Professional/page.js` - Add Stripe checkout button.
8. [ ] Edit `src/app/(Routes)/ErstelleRestaurantAccount/FreeTier/page.js` - Add upgrade to Pro button.
9. [ ] Edit `src/app/(Routes)/Profil/page.js` - Add subscription management/upgrade UI.

### Testing & Env (4 steps)
10. [ ] Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env (user action).
11. [x] price_pro_monthly placeholder - replace with real Stripe ID.
12. [ ] Test full flow: dev server, checkout, webhook.
13. [ ] Prisma push if needed, complete.

**Notes:** Backend core updated. Add STRIPE_WEBHOOK_SECRET to .env. Next: ProfessionalTier API (step 3).
