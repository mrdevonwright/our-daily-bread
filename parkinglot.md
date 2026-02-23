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

---

## Public Baker Profiles & Social Layer

Let bakers opt in to a public profile so they can be discovered and connected with by other bakers across the movement.

**How it would work:**
1. Profile settings: toggle "Make my profile public" (default: private)
2. Public profile page at `/bakers/[id]` — shows name, church, bio, stats (loaves sold, raised), and a "Say hi" button
3. Baker directory or map on `/bakers` — browse bakers by church or region
4. Messaging or connection requests between bakers (lightweight: just an email intro, not a full inbox)

**Why it matters:**
- Creates a sense of community and belonging across churches
- Bakers can learn from each other, share tips, encourage one another
- Naturally spreads the movement — "my friend Sarah from Denver is doing this too!"

**Design principles:**
- Opt-in only — never expose someone's info without consent
- Keep it warm and ministry-focused, not LinkedIn/social media
- No follower counts, likes, or anything that creates status anxiety
- Think pen pals, not social media

**When to revisit:** when the baker community is large enough that cross-church connections feel natural (50+ bakers).
