# Mateo Landscaping and More LLC — Website

Landscaping, fencing, decks and handyman services in Champaign, IL.
Built to pass **A2P 10DLC / Twilio carrier review**.

Astro 5 · Tailwind 4 · TypeScript · static output.

---

## 🚀 Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run check    # typecheck
```

Deploy `dist/` to Netlify (config included in `netlify.toml`). **HTTPS is
mandatory for A2P review** — Netlify provisions the certificate automatically.

---

## 🛑 BEFORE YOU SUBMIT FOR A2P — fill these in

Everything is data-driven from **one file**:
[`src/data/business.ts`](src/data/business.ts). `npm run build` prints a warning
listing anything still unfilled. **Do not submit for A2P review until that list
is empty.**

| # | What | Where | Why it matters |
|---|------|-------|----------------|
| 1 | **Phone** | `BUSINESS.phoneDisplay` + `phoneE164` | Must match the campaign registration *exactly* |
| 2 | **Street address** | `BUSINESS.address.street` | Carriers want a real address — a home address is fine |
| 3 | **Facebook** | `SOCIAL.facebook` | Or delete it — a dead social link hurts review |
| 4 | **Reviews** | `TESTIMONIALS` | Currently clearly-labelled samples — see below |
| 5 | **Photos** | `PHOTOS_ARE_STOCK` | Currently licensed stock — see below |
| 6 | **Insurance** | `INSURANCE_CONFIRMED` | Unverified claim — see below |

`phoneE164` is the `tel:` link format: `(217) 555-0138` → `+12175550138`.

### ⚠️ The three honesty flags

These exist because the site would otherwise make claims about a real business
that nobody has verified. Each one is a real liability for the client, not
pedantry — and each removes itself once the fact is confirmed.

- **`TESTIMONIALS[].isPlaceholder`** — the review cards render a visible
  "Sample — replace" badge, and star-rating rich results (`Review` /
  `aggregateRating` JSON-LD) stay switched **off**. Publishing invented reviews
  as real customers is deceptive advertising, an FTC problem, and a Google
  manual-action risk. Replace with real, permissioned reviews → set `false`.
- **`PHOTOS_ARE_STOCK`** — the Our Work page carries a visible notice saying the
  photos illustrate the type of work rather than being Mateo's own jobs, and no
  caption claims a specific job at a specific address. Drop real job photos into
  the same paths → set `false`, then put real locations back in the captions.
- **`INSURANCE_CONFIRMED`** — the brief never said this business is licensed or
  insured, so **the site does not say so**. The "Are you insured?" FAQ currently
  invites the customer to ask. Once you have seen the policy → set `true` (the
  FAQ answer switches automatically) and you may add "Licensed & insured" back
  to the home page hero list in `src/pages/index.astro`.

---

## 🚨 A2P compliance — what's already handled

**Do not "tidy up" any of the following without understanding why it's there.**
Each one is a documented carrier rejection reason.

### The consent block

Both forms render the same component —
[`src/components/ConsentFields.astro`](src/components/ConsentFields.astro) — whose
wording comes from `CONSENT` in `business.ts`. That is what makes the Contact and
Quote consent sections **identical by construction** rather than by discipline.
The build-time audit asserts they are byte-identical.

Encoded rules:

- ✅ **Two separate checkboxes** — transactional and marketing.
- ✅ **Both unchecked by default** — no `checked` attribute.
- ✅ **Both optional** — no `required`. Submission works either way; `form.ts`
  never gates on them.
- ✅ **Full legal entity name** inside each statement.
- ✅ **Privacy / Terms links below the checkboxes**, as separate text — never
  inside the checkbox wording.
- ✅ **The phrase "text START" appears nowhere** on the site.
- ✅ **Post-submit → `/thank-you`**, a plain confirmation page with **no second
  opt-in form** on it.

### Consent records

`form.ts` records each checkbox as `yes`/`no` plus `consent_timestamp` and
`opt_in_url`. **Keep this.** It's your proof of how and when a number was
collected if a carrier or customer ever asks.

### The opt-in URL

`https://www.mateoslandscapingandmore.com/get-a-free-quote` — this exact path is what gets
registered with the carrier. **Do not rename**
`src/pages/get-a-free-quote.astro` without updating the A2P registration to match.

### Privacy Policy

Carries the required mobile-data sentence **verbatim** from `MOBILE_DATA_CLAUSE`
in `business.ts`. Reviewers pattern-match that exact sentence — do not paraphrase.

> ⚖️ The Privacy Policy and Terms are an honest, solid starting point that
> reflects what this site actually does. They are **not legal advice** — have
> counsel review before launch.

### Verifying it

`npm run build`, then run the audit against `dist/` — it checks the **built
HTML**, which is the only thing a reviewer sees:

```bash
node audit.mjs ./dist    # 66 checks: consent text, form parity, links, NAP
```

---

## 📂 Structure

```
public/images/         hero · services · gallery · ba (before/after) · about
src/
  data/business.ts     ⭐ SINGLE SOURCE OF TRUTH — NAP, services, FAQs, CONSENT
  layouts/BaseLayout.astro
  components/
    ConsentFields.astro  🚨 the A2P consent block — read the header comment first
    LeadForm.astro       🚨 the ONE form used by /contact AND /get-a-free-quote
    Header · Footer · Faq · BeforeAfter · TestimonialCard · PageHero · CtaBand · Icon
  scripts/
    form.ts            lead submission + consent capture
    motion.ts          scroll reveals, header, before/after sliders
  pages/               index · services · our-work · about · reviews · faq
                       contact · get-a-free-quote · thank-you
                       privacy-policy · terms · 404
```

Multi-page is a hard A2P requirement — a one-page site is auto-rejected.

---

## 📨 Lead capture

Forms POST to a **GoHighLevel Inbound Webhook** when configured:

```bash
# .env
PUBLIC_GHL_INBOUND_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/..."
```

Set the same variable in Netlify → Site settings → Environment variables.

**Without it**, forms fall back to **Netlify Forms** automatically (they still
capture the lead and both consent flags), so nothing is ever silently lost. With
JS off, the native POST works too.

Payload sent to GHL:

```json
{
  "name": "…", "phone": "…", "email": "…", "service": "…", "message": "…",
  "consent_transactional": "yes|no",
  "consent_marketing": "yes|no",
  "consent_timestamp": "2026-07-16T…Z",
  "opt_in_url": "https://www.mateoslandscapingandmore.com/get-a-free-quote",
  "source_form": "quote|contact",
  "page_path": "/get-a-free-quote"
}
```

---

## 📋 GoHighLevel A2P registration (keep 1:1 with the site)

Use the **Pre-built (Chat Widget)** flow — highest approval rate.

**Campaign use case description:**

> This campaign sends confirmations, updates, and reminder messages to customers
> from Mateo Landscaping and More LLC through the website, and end users opt in
> to receive marketing and promotional messages, including special offers,
> discounts, and new service updates.

**How do end users consent to receive messages?**

> End users opt in by visiting https://www.mateoslandscapingandmore.com/get-a-free-quote,
> filling out the fields, and optionally selecting checkboxes to consent to
> receive transactional communications such as confirmations, updates, and
> reminders. Users may also opt in to receive marketing and promotional messages
> from Mateo Landscaping and More LLC, including special offers, discounts, and
> service updates.

**Sample message (transactional):**

> Hi [Name], this is Mateo Landscaping & More confirming your free estimate on
> [date] at [time]. Reply HELP for help or STOP to opt out.

⚠️ The business name, phone, email and address in the registration must be
**identical** to the website, the Terms and the Privacy Policy — all of which
read from `business.ts`. Fill that file in first, then copy from the rendered
site into the registration.

---

## 🎨 Brand

Deep green `#1B4332` · warm sand `#D6C7A1` · charcoal `#2B2B2B` · white.
Bright green CTAs `#2B8A3E` — nudged slightly darker than a pure bright green so
white button text clears the 4.5:1 contrast floor.

Tokens live in `@theme` in [`src/styles/global.css`](src/styles/global.css).
System font stacks only — no third-party font requests, which keeps LCP fast.

## ♿ Accessibility & performance

- Skip link, visible focus rings, labelled form fields, live-region form status.
- All motion is progressive enhancement and respects `prefers-reduced-motion`.
- The before/after slider is a range input — keyboard-operable for free.
- Hero preloaded for LCP; everything below the fold lazy-loads with explicit
  `width`/`height` (no layout shift).
- The mobile menu and both forms work with **JavaScript disabled**.
