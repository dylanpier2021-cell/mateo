/**
 * ============================================================================
 *  MATEO LANDSCAPING AND MORE LLC — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Every business fact, service, FAQ and — critically — every word of A2P
 *  consent language lives here. The whole site reads from this file.
 *
 *  ⚠️  WHY THIS MATTERS FOR A2P 10DLC:
 *  Carriers reject campaigns when the business name / phone / email / address
 *  differ between the website, the campaign description, the Terms and the
 *  Privacy Policy. Keeping all of it in ONE file makes drift impossible —
 *  edit here, and every page updates together.
 *
 *  👉 BEFORE SUBMITTING FOR A2P REVIEW, replace every [PLACEHOLDER] below.
 *     Run `npm run build` — it prints a loud warning listing anything unfilled.
 *
 *     1. PHONE   — search `PLACEHOLDER_PHONE`
 *     2. ADDRESS — search `PLACEHOLDER_STREET`
 *     3. SOCIAL  — search `PLACEHOLDER_FACEBOOK`
 *     4. REVIEWS — search `isPlaceholder` (swap in real customer reviews)
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  PLACEHOLDER SENTINELS                                                       */
/*  Deliberately obvious + machine-checkable. The build warns while these       */
/*  survive, so a placeholder can't quietly ship to a carrier reviewer.         */
/* -------------------------------------------------------------------------- */

// Typed as plain `string` (not the narrow literal) so the defensive guards that
// compare real values against these sentinels stay valid TypeScript once the
// real values are filled in — otherwise TS reports "no overlap" on a comparison
// that is the whole point of the guard.
export const PLACEHOLDER_PHONE: string = '(217) XXX-XXXX';
export const PLACEHOLDER_PHONE_E164: string = '+1217XXXXXXX';
export const PLACEHOLDER_STREET: string = '[STREET ADDRESS]';
export const PLACEHOLDER_FACEBOOK: string = 'https://www.facebook.com/';

/**
 * Insurance. Confirmed by the owner: the business carries insurance. The
 * "Are you insured?" FAQ answer and the hero trust list read from this flag.
 *
 * Note: this asserts INSURED only — not "licensed". Landscaping/handyman work
 * often needs no state license, and claiming one that doesn't exist is its own
 * false-advertising problem, so nothing on the site says "licensed".
 */
export const INSURANCE_CONFIRMED = true;

/* -------------------------------------------------------------------------- */
/*  SITE                                                                        */
/* -------------------------------------------------------------------------- */

export const SITE = {
  /**
   * Production URL. Must be HTTPS and must match the A2P registration exactly.
   * Uses the www host because that's where the live site is served
   * (https://www.mateoslandscapingandmore.com). Keep the opt-in URL registered
   * with the carrier on this same host, and make sure the non-www host redirects
   * here so a reviewer never lands on a split domain.
   */
  url: 'https://www.mateoslandscapingandmore.com',
  locale: 'en_US',
  lang: 'en',
  ogImage: '/images/hero/hero-landscaping.jpg',
} as const;

/* -------------------------------------------------------------------------- */
/*  BUSINESS — NAP (Name, Address, Phone). Identical on every page.             */
/* -------------------------------------------------------------------------- */

export const BUSINESS = {
  /** Registered legal entity. Use this verbatim in all consent + legal copy. */
  legalName: 'Mateo Landscaping and More LLC',
  /** Doing-business-as / display brand. */
  dba: 'Mateo Landscaping & More',
  /** Convenience alias used in body copy. */
  name: 'Mateo Landscaping & More',
  /** Owner / principal of the LLC. */
  owner: 'Maria Pablo Francisco',
  shortBrand: 'Landscaping · Fencing · Decks · Handyman',
  tagline: "Champaign's trusted landscaping, fencing & home services.",

  /** Business line. Keep display + E.164 in sync and identical to the A2P registration. */
  phoneDisplay: '(217) 866-0943',
  phoneE164: '+12178660943',

  /**
   * Contact email. NOTE: this is a Gmail address, chosen by the owner. A branded
   * address on the domain (info@mateoslandscapingandmore.com) is stronger for
   * A2P/10DLC review — carriers view free-email senders less favorably — so
   * switching to a domain mailbox later is recommended if approval is a concern.
   */
  email: 'mateobernabe123@gmail.com',

  address: {
    /** Physical address. Must match the A2P registration and Google Business Profile. */
    street: '1513 Paula Dr',
    city: 'Champaign',
    state: 'IL',
    stateFull: 'Illinois',
    zip: '61821',
    country: 'US',
  },

  homeCity: 'Champaign',
  homeState: 'IL',
  homeStateFull: 'Illinois',

  geo: { lat: 40.1164, lng: -88.2434 },

  /** Keep consistent everywhere — the About page, schema and copy all read this. */
  yearsInBusiness: 7,
  foundedYear: 2019,

  languages: ['English', 'Spanish'],

  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '07:00',
    closes: '18:00',
    display: 'Mon–Sat, 7:00am – 6:00pm · Closed Sunday',
  },

  priceRange: '$$',
  currency: 'USD',
} as const;

/** Full one-line address string. Rendered identically in header/footer/contact. */
export const addressOneLine = `${BUSINESS.address.street}, ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`;

/* -------------------------------------------------------------------------- */
/*  LINK HELPERS                                                                */
/* -------------------------------------------------------------------------- */

export const telHref = `tel:${BUSINESS.phoneE164}`;
export const mailHref = `mailto:${BUSINESS.email}`;
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  addressOneLine
)}`;
/** Embedded map — keyless Google Maps embed, no API key or billing required. */
export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  `${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}`
)}&output=embed`;

/* -------------------------------------------------------------------------- */
/*  SOCIAL — mirrors schema.org `sameAs`. Only list VERIFIED, live profiles.    */
/* -------------------------------------------------------------------------- */

export const SOCIAL = {
  /** Verified, live Facebook page. Mirrored into schema.org `sameAs`. */
  facebook: 'https://www.facebook.com/profile.php?id=61575308364472',
} as const;

/** Only real, resolving URLs belong in `sameAs` — a dead link hurts review. */
export const SAME_AS: string[] = Object.values(SOCIAL).filter(
  (url) => url !== PLACEHOLDER_FACEBOOK
);

/* -------------------------------------------------------------------------- */
/*  NAVIGATION — every link here must resolve (no 404s during A2P review).      */
/* -------------------------------------------------------------------------- */

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Get a Free Quote', href: '/get-a-free-quote' },
] as const;

/** Legal pages — linked separately in the footer, as carriers require. */
export const LEGAL_NAV = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
] as const;

/* -------------------------------------------------------------------------- */
/*  SERVICE AREA                                                                */
/* -------------------------------------------------------------------------- */

export const SERVICE_AREA_NAMES = [
  'Champaign',
  'Urbana',
  'Savoy',
  'Mahomet',
  'Bondville',
  'Tolono',
] as const;

/** One-line service-area sentence, reused across pages. */
export const serviceAreaLine = `Proudly serving Champaign, Urbana, Savoy, Mahomet and the surrounding Champaign–Urbana area.`;

/* -------------------------------------------------------------------------- */
/*  SERVICES                                                                    */
/* -------------------------------------------------------------------------- */

export interface Service {
  slug: string;
  name: string;
  icon: string;
  /** Short line for cards on the home page. */
  blurb: string;
  /** Long-form copy for the Services page section. */
  body: string;
  /** Bulleted specifics. */
  includes: string[];
  image: string;
  imageAlt: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'lawn-care-landscaping',
    name: 'Lawn Care & Landscaping',
    icon: 'leaf',
    blurb:
      'Mowing, seasonal cleanups, landscape design, planting and fresh mulch — a yard you are glad to come home to.',
    body: "A well-kept yard is the first thing anyone notices about your home. We handle the whole range — regular mowing and edging through the season, spring and fall cleanups, new landscape design and planting, and mulch that makes the beds look sharp. Whether you want us out every week or just once to reset an overgrown yard, we'll work to your schedule.",
    includes: [
      'Weekly & bi-weekly mowing, trimming and edging',
      'Spring and fall cleanups — leaves, brush and debris hauled away',
      'Landscape design and installation',
      'Tree, shrub and flower bed planting',
      'Mulch delivery and installation',
      'Bush trimming and overgrowth removal',
    ],
    image: '/images/services/service-lawn-care.jpg',
    imageAlt: 'A person mowing a green lawn with a push mower in late-afternoon light',
  },
  {
    slug: 'fencing',
    name: 'Fencing',
    icon: 'fence',
    blurb:
      'Wood, chain-link and privacy fence installation and repair — built straight, set solid and made to last.',
    body: "A fence has to do two jobs: look good and stay standing. We install new wood, chain-link and privacy fencing, and we repair the fence you already have when a storm or a few hard winters have taken their toll. Posts get set properly and lines get run straight — that is the difference between a fence that lasts fifteen years and one that leans in three.",
    includes: [
      'Wood privacy fence installation',
      'Chain-link fence installation',
      'Picket and decorative fencing',
      'Fence repair — leaning posts, broken pickets, storm damage',
      'Gate installation and repair',
      'Old fence removal and haul-away',
    ],
    image: '/images/services/service-fencing.jpg',
    imageAlt: 'A horizontal-slat cedar fence with a matching gate',
  },
  {
    slug: 'decks',
    name: 'Decks',
    icon: 'deck',
    blurb:
      'Custom deck builds and repairs — the outdoor space your backyard has been missing.',
    body: "A deck turns a backyard into somewhere you actually spend time. We build custom decks sized and laid out for how you plan to use the space, and we repair existing decks — replacing rotted boards, re-securing loose railings and bringing tired wood back to life. We walk the project with you before we start, so you know exactly what you're getting.",
    includes: [
      'Custom deck design and construction',
      'Deck repair — board replacement and rot removal',
      'Railing repair and replacement',
      'Stairs and landings',
      'Sanding, staining and sealing',
      'Deck removal and rebuild',
    ],
    image: '/images/services/service-decks.jpg',
    imageAlt: 'A wooden backyard deck furnished with a table, chairs and a grill',
  },
  {
    slug: 'handyman-remodeling',
    name: 'Handyman & Remodeling',
    icon: 'hammer',
    blurb:
      'Drywall, painting, ceiling tile and the general repairs on your list — one call, one crew.',
    body: "The \"and More\" in our name is this. Drywall patching and hanging, interior and exterior painting, ceiling tile, trim, doors and the general repairs that have been sitting on your list since last year — we take care of it. It's the same crew and the same standard you'd get from us outside, just indoors.",
    includes: [
      'Drywall repair, patching and hanging',
      'Interior and exterior painting',
      'Ceiling tile installation and replacement',
      'Trim, doors and general carpentry',
      'Small remodeling projects',
      'General home repairs and punch lists',
    ],
    image: '/images/services/service-handyman.jpg',
    imageAlt: 'A handyman rolling fresh white paint onto an interior wall beside taped trim',
  },
];

/** Pricing note — the prompt requires this transparency line on Services. */
export const PRICING_NOTE =
  'Every job is different — we give free, no-obligation estimates.';

/* -------------------------------------------------------------------------- */
/*  WHY CHOOSE US                                                               */
/* -------------------------------------------------------------------------- */

export const WHY_US = [
  {
    icon: 'clock',
    title: `${BUSINESS.yearsInBusiness} years in business`,
    body: `We've been taking care of Champaign–Urbana yards and homes since ${BUSINESS.foundedYear}. Our work is still here, and so are we.`,
  },
  {
    icon: 'receipt',
    title: 'Free estimates',
    body: 'We come out, look at the actual job, and give you a straight number. No charge, no obligation, no pressure.',
  },
  {
    icon: 'shield-check',
    title: 'Warrantied work',
    body: "We stand behind what we build. If something isn't right, we come back and make it right.",
  },
  {
    icon: 'languages',
    title: 'Bilingual — English & Spanish',
    body: 'Hablamos español. You will be understood, and you will understand exactly what we are doing and why.',
  },
  {
    icon: 'map-pin',
    title: 'Local & family-owned',
    body: 'We live here. Our neighbors are our customers, and that is exactly why we do the job right the first time.',
  },
  {
    icon: 'clock-check',
    title: 'We show up on time',
    body: 'We tell you when we will be there, and then we are there. It should not be remarkable, but we know it is.',
  },
];

/* -------------------------------------------------------------------------- */
/*  PHOTOGRAPHY                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * ⚠️ TRUE while the site is still using licensed stock photography (Pexels)
 * rather than photos of Mateo's own completed jobs.
 *
 * While this is true:
 *   • The Our Work page shows a visible notice saying the photos are
 *     illustrative rather than past projects.
 *   • Captions stay service-descriptive and make no claim about a specific job
 *     at a specific address.
 *
 * Presenting stock photos as your own completed work is deceptive advertising —
 * a homeowner hiring off the strength of a deck you didn't build has been misled,
 * and it's the kind of thing that ends up in a complaint. Swap in real job photos
 * (same file paths under /public/images/), then set this to false: the notice
 * disappears and you can put real locations back in the captions.
 */
export const PHOTOS_ARE_STOCK = true;

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  tag: string;
}

export const GALLERY: GalleryItem[] = [
  {
    src: '/images/gallery/gallery-1.jpg',
    alt: 'A home with a manicured green lawn and landscaped flower beds',
    caption: 'Landscape design & planting',
    tag: 'Landscaping',
  },
  {
    src: '/images/gallery/gallery-2.jpg',
    alt: 'A wooden fence running along the edge of a mowed green lawn',
    caption: 'Wood fence installation',
    tag: 'Fencing',
  },
  {
    src: '/images/gallery/gallery-3.jpg',
    alt: 'A wooden backyard deck furnished with a table and chairs',
    caption: 'Custom deck builds',
    tag: 'Decks',
  },
  {
    src: '/images/gallery/gallery-4.jpg',
    alt: 'A lawn mower cutting a stripe into green grass',
    caption: 'Mowing, trimming & edging',
    tag: 'Lawn Care',
  },
  {
    src: '/images/gallery/gallery-5.jpg',
    alt: 'Trimmed round boxwood shrubs in a freshly mulched garden bed',
    caption: 'Mulch & bed edging',
    tag: 'Landscaping',
  },
  {
    src: '/images/gallery/gallery-6.jpg',
    alt: 'A freshly painted interior room with new wall finish and wood trim',
    caption: 'Interior painting & repairs',
    tag: 'Handyman',
  },
];

/* -------------------------------------------------------------------------- */
/*  BEFORE / AFTER                                                              */
/* -------------------------------------------------------------------------- */

export interface BeforeAfterItem {
  id: string;
  title: string;
  location: string;
  before: string;
  beforeAlt: string;
  after: string;
  afterAlt: string;
  note: string;
}

/**
 * Alt text and captions here describe what is ACTUALLY in each photo. While
 * PHOTOS_ARE_STOCK is true, `location` stays generic and nothing claims "the
 * same yard" — because these are two different stock photos, not one job
 * documented start to finish. Once real paired job photos replace these files,
 * set real locations and say so plainly.
 */
export const BEFORE_AFTER: BeforeAfterItem[] = [
  {
    id: 'yard-reset',
    title: 'Overgrown yard → cut, cleared and striped',
    location: 'Lawn care & cleanup',
    before: '/images/ba/yard-before.jpg',
    beforeAlt: 'A badly overgrown yard of waist-high weeds with a single mown strip cut through it',
    after: '/images/ba/yard-after.jpg',
    afterAlt: 'A neatly mown, striped green front lawn in front of a house',
    note: 'The difference a full cleanup makes: overgrowth cut back, debris hauled off, and the lawn brought back to a clean, even cut.',
  },
  {
    id: 'bed-rebuild',
    title: 'Bare soil → planted and in bloom',
    location: 'Landscape design & planting',
    before: '/images/ba/beds-before.jpg',
    beforeAlt: 'A bare garden bed of freshly turned soil with a spade standing in it',
    after: '/images/ba/beds-after.jpg',
    afterAlt: 'A garden bed densely planted with daffodils, pansies and daisies in bloom',
    note: 'What a replanting does: beds cleared and re-worked, then planted out and mulched so they fill in season after season.',
  },
];

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS                                                                */
/*                                                                              */
/*  Real customer reviews provided by the owner.                                */
/*                                                                              */
/*  ⚠️ On attribution: these arrived without customer names, so each is         */
/*     attributed simply as "Homeowner". We do NOT invent names or towns —      */
/*     attaching a fabricated identity to a real quote is itself a form of      */
/*     fake review. If you have the reviewers' first names / initials (and the  */
/*     source, e.g. Google or Facebook), add `name` and `location` per entry;   */
/*     named, source-linked reviews are far more convincing to a homeowner.     */
/*                                                                              */
/*  `isPlaceholder` stays for the card's sample-badge logic; it is false for    */
/*  every real review below, so no badge shows and Review schema is emitted.    */
/* -------------------------------------------------------------------------- */

export interface Testimonial {
  quote: string;
  name: string;
  /** Optional — left blank when the reviewer's town isn't known. */
  location: string;
  /** Optional — service tag, when the review clearly names one. */
  service: string;
  rating: number;
  /** While true, the card renders a visible "sample" badge. */
  isPlaceholder: boolean;
}

const review = (quote: string, service = ''): Testimonial => ({
  quote,
  name: 'Homeowner',
  location: '',
  service,
  rating: 5,
  isPlaceholder: false,
});

export const TESTIMONIALS: Testimonial[] = [
  review(
    'Mateo did an amazing job cleaning up our landscaping. He was friendly, professional, and finished everything on time. Our yard has never looked better.',
    'Lawn Care & Landscaping'
  ),
  review(
    'We hired Mateo for a small landscaping project, and the results exceeded our expectations. Great communication, fair pricing, and quality work from start to finish.',
    'Lawn Care & Landscaping'
  ),
  review(
    'Mateo transformed our front yard in just a couple of days. He paid attention to every detail and made sure we were happy before leaving.',
    'Lawn Care & Landscaping'
  ),
  review(
    "Excellent experience! Mateo was respectful, hardworking, and clearly takes pride in his work. I'd definitely hire him again."
  ),
  review(
    'Very reliable and easy to work with. Mateo explained everything before starting and delivered exactly what he promised. Highly recommend.'
  ),
  review(
    'Our landscaping project turned out beautiful. Mateo was punctual, professional, and kept the work area clean throughout the job.',
    'Lawn Care & Landscaping'
  ),
  review(
    'Great customer service and even better craftsmanship. Mateo went above and beyond to make sure everything looked perfect.'
  ),
  review(
    "I was impressed with Mateo's attention to detail. The finished project looks fantastic, and the entire process was smooth from beginning to end."
  ),
  review(
    'Mateo is honest, dependable, and does excellent work. He treated our property with care and delivered high-quality results.'
  ),
  review(
    "We couldn't be happier with the outcome. Mateo worked efficiently and made our yard look completely refreshed.",
    'Lawn Care & Landscaping'
  ),
  review(
    'Professional from the first phone call to the final walkthrough. Mateo communicated well, arrived on time, and did outstanding work.'
  ),
  review(
    'The landscaping looks incredible. Mateo was courteous, knowledgeable, and made sure every detail was completed the right way.',
    'Lawn Care & Landscaping'
  ),
  review(
    'Fantastic experience. Mateo listened to what we wanted, offered helpful suggestions, and completed the project on schedule.'
  ),
  review(
    "Quality work at a fair price. Mateo was friendly, hardworking, and exceeded our expectations. We'd happily recommend his services."
  ),
  review(
    "We had a great experience working with Mateo. He was reliable, respectful, and delivered beautiful results. We'd definitely hire him again."
  ),
];

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'Do you give free estimates?',
    a: `Yes — always free, and always no-obligation. We come out, walk the job with you, and give you a straight number. ${PRICING_NOTE} Call or text us at ${BUSINESS.phoneDisplay}, or fill out the quote form on this site.`,
  },
  {
    q: 'What areas do you serve?',
    a: `We're based in ${BUSINESS.homeCity}, ${BUSINESS.homeState} and serve Champaign, Urbana, Savoy, Mahomet and the surrounding Champaign–Urbana area. If you're just outside that, call us anyway — we'll tell you honestly whether we can get to you.`,
  },
  {
    q: 'Are you insured?',
    a: INSURANCE_CONFIRMED
      ? `Yes. ${BUSINESS.legalName} carries liability insurance, and we're happy to provide proof of coverage before we start work. If a contractor won't show you that, don't let them on your property.`
      : `Ask us and we'll give you a straight answer along with our current coverage details before any work starts — and you should ask every contractor you consider, not just us. Call ${BUSINESS.phoneDisplay} or email ${BUSINESS.email}.`,
  },
  {
    q: 'How fast can you start?',
    a: 'For most lawn care and smaller repair jobs, within a few days. Fences, decks and remodeling projects depend on the size of the job and the season — spring is our busiest stretch. When we give you the estimate, we give you a realistic start date, not an optimistic one.',
  },
  {
    q: 'Do you warranty your work?',
    a: "Yes. We stand behind what we build and install. If something isn't right, call us and we'll come back out and make it right. Specific warranty terms depend on the job and are spelled out in your estimate.",
  },
  {
    q: 'How do I get a quote?',
    a: `Three ways, whichever is easiest: call or text ${BUSINESS.phoneDisplay}, email ${BUSINESS.email}, or fill out the Get a Free Quote form on this site and we'll get back to you.`,
  },
  {
    q: 'Do you speak Spanish?',
    a: 'Sí. We are a bilingual company — English and Spanish. Whichever you are more comfortable in, that is the language we will work in.',
  },
  {
    q: 'Do you handle both the outside and the inside of my home?',
    a: 'We do — that is what the "and More" in our name means. Landscaping, fencing and decks outside; drywall, painting, ceiling tile and general repairs inside. One call and one crew instead of chasing four contractors.',
  },
];

/* -------------------------------------------------------------------------- */
/*  ═══ A2P 10DLC CONSENT LANGUAGE ═══                                          */
/*                                                                              */
/*  🚨 DO NOT EDIT THESE STRINGS WITHOUT UNDERSTANDING THE CONSEQUENCES.        */
/*                                                                              */
/*  These exact words are what the carrier reviews. Every form on the site      */
/*  renders them from these constants, which is what guarantees the Contact     */
/*  and Quote forms are IDENTICAL — a hard requirement.                         */
/*                                                                              */
/*  Rules encoded here:                                                         */
/*   • Two SEPARATE checkboxes: transactional and marketing.                    */
/*   • Both UNCHECKED by default and both OPTIONAL (never `required`).          */
/*   • The legal entity name appears in full inside each statement.             */
/*   • Privacy/Terms links live BELOW the checkboxes, never inside the text.    */
/*   • The phrase "text START" must appear NOWHERE in the consent section.      */
/* -------------------------------------------------------------------------- */

export const CONSENT = {
  transactional: {
    id: 'consent-transactional',
    name: 'consent_transactional',
    label: `By checking this box, I consent to receive transactional messages related to my account, orders, or services I have requested from ${BUSINESS.legalName}. These messages may include reminders, appointment confirmations, and service updates, among others. Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt out.`,
  },
  marketing: {
    id: 'consent-marketing',
    name: 'consent_marketing',
    label: `By checking this box, I consent to receive marketing and promotional messages, including special offers, discounts, and seasonal service reminders, among others, from ${BUSINESS.legalName}. Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt out.`,
  },
} as const;

/**
 * ═══ VISIBLE SMS DISCLOSURE ═══
 *
 * The consent LABELS above live inside <label>/<span> elements. Some A2P
 * scanners only read plain page text and miss disclosures embedded in checkbox
 * labels, flagging the opt-in as non-compliant. To fix that, ConsentFields.astro
 * ALSO renders these fields as a static, server-rendered paragraph directly
 * beneath the checkboxes — same facts, plain readable text the scanner can see.
 *
 * Every required element is a separate field so the audit can assert each one is
 * present in the built HTML. Keep the sender as the full legal entity name.
 */
export const SMS_DISCLOSURE = {
  sender: BUSINESS.legalName,
  messageType:
    'You will receive transactional messages (appointment confirmations, reminders, service updates) and, if you opt in, marketing messages (offers and seasonal reminders).',
  frequency: 'Message frequency may vary.',
  rates: 'Message & data rates may apply.',
  helpStop: 'Reply HELP for help. Reply STOP to opt out / unsubscribe.',
} as const;

/**
 * The exact sentence carriers look for in the Privacy Policy. Rendered verbatim
 * on /privacy-policy. Do not paraphrase — reviewers pattern-match this.
 */
export const MOBILE_DATA_CLAUSE =
  'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.';

/* -------------------------------------------------------------------------- */
/*  LEAD CAPTURE                                                                */
/* -------------------------------------------------------------------------- */

export const LEAD = {
  /**
   * GoHighLevel Inbound Webhook. Set PUBLIC_GHL_INBOUND_WEBHOOK_URL in the host
   * environment. If unset, forms fall back to Netlify Forms so leads (and their
   * consent flags) are still captured. See README → "Lead capture".
   */
  inboundWebhookUrl: import.meta.env?.PUBLIC_GHL_INBOUND_WEBHOOK_URL ?? '',
  /** Post-submit destination. Must NOT be another opt-in form (A2P rule). */
  thankYouPath: '/thank-you',
} as const;

/** Service options offered in form dropdowns. */
export const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => s.name),
  'Something else / not sure',
];

/* -------------------------------------------------------------------------- */
/*  BUILD-TIME GUARD                                                            */
/*  Prints warnings during `npm run build`. Two tiers:                          */
/*    • A2P BLOCKERS — must be empty before submitting the campaign. NAP that   */
/*      doesn't match the registration is a hard rejection.                     */
/*    • RECOMMENDED  — honesty / polish items. Not carrier blockers, but each   */
/*      is a claim about a real business worth getting right before launch.     */
/* -------------------------------------------------------------------------- */

const a2pBlockers: string[] = [];
if (BUSINESS.phoneDisplay === PLACEHOLDER_PHONE) a2pBlockers.push('PHONE    → BUSINESS.phoneDisplay / phoneE164');
if (BUSINESS.address.street === PLACEHOLDER_STREET) a2pBlockers.push('ADDRESS  → BUSINESS.address.street');
if (SOCIAL.facebook === PLACEHOLDER_FACEBOOK) a2pBlockers.push('FACEBOOK → SOCIAL.facebook (fill in or remove)');

const recommended: string[] = [];
if (TESTIMONIALS.some((t) => t.isPlaceholder)) recommended.push('REVIEWS  → TESTIMONIALS still contain sample text');
if (PHOTOS_ARE_STOCK) recommended.push('PHOTOS   → still licensed stock, not the company\'s own job photos');

if (typeof console !== 'undefined') {
  if (a2pBlockers.length > 0) {
    console.warn(
      [
        '',
        '  ⛔  A2P BLOCKERS — do NOT submit the campaign until these are filled:',
        ...a2pBlockers.map((u) => `      • ${u}`),
        '',
      ].join('\n')
    );
  }
  if (recommended.length > 0) {
    console.warn(
      [
        '',
        '  ℹ️  RECOMMENDED before launch (not A2P blockers):',
        ...recommended.map((u) => `      • ${u}`),
        '',
      ].join('\n')
    );
  }
}
