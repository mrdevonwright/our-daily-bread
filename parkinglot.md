# Parking Lot

Ideas shelved for later.

---

## Stripe QR Code Auto-Logging

Replace the Venmo/Cash App/Zelle QR generator with a Stripe Payment Link QR code per baker.

**How it would work:**
1. Generate a Stripe Payment Link via API with `baker_id` + `church_id` in the metadata
2. QR code points to that link — customer scans, enters amount, pays by card
3. Stripe fires a webhook to `/api/donate/webhook` (already exists)
4. Webhook reads metadata, calculates loaves from amount, auto-logs to `sales_logs`

**Trade-offs:**
- Pro: zero manual entry, fully automatic tracking
- Con: Stripe fee ~2.9% + 30¢ per transaction vs. zero-fee Venmo/Cash App
- Con: customers must enter card vs. tapping phone to pay

**When to revisit:** if the movement scales and manual Sunday logging becomes a bottleneck.
