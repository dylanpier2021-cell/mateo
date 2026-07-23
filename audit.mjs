/**
 * A2P 10DLC compliance audit — runs against the BUILT HTML in dist/, not the
 * source. What the carrier reviewer sees is the only thing that counts.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DIST = process.argv[2];
const read = (p) => readFileSync(join(DIST, p), 'utf8');

let pass = 0;
let fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? `\n       → ${detail}` : ''}`);
  }
};

const LEGAL = 'Mateo Landscaping and More LLC';
const EMAIL = 'mateobernabe123@gmail.com';
// The owner chose a Gmail contact address (see business.ts). The "no free-email"
// check allows this one known address but still flags any OTHER stray free email.
const ALLOWED_FREE_EMAIL = 'mateobernabe123@gmail.com';

const TRANSACTIONAL = `By checking this box, I consent to receive transactional messages related to my account, orders, or services I have requested from ${LEGAL}. These messages may include reminders, appointment confirmations, and service updates, among others. Message frequency may vary. Message &amp; data rates may apply. Reply HELP for help or STOP to opt out.`;
const MARKETING = `By checking this box, I consent to receive marketing and promotional messages, including special offers, discounts, and seasonal service reminders, among others, from ${LEGAL}. Message frequency may vary. Message &amp; data rates may apply. Reply HELP for help or STOP to opt out.`;
const MOBILE_CLAUSE = 'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.';

const quote = read('get-a-free-quote/index.html');
const contact = read('contact/index.html');
const privacy = read('privacy-policy/index.html');
const terms = read('terms/index.html');
const thanks = read('thank-you/index.html');

/* ---------------------------------------------------------------- FORMS -- */
console.log('\n── FORM RULES ──');

for (const [label, html] of [['quote', quote], ['contact', contact]]) {
  check(`[${label}] transactional consent text is verbatim`, html.includes(TRANSACTIONAL));
  check(`[${label}] marketing consent text is verbatim`, html.includes(MARKETING));

  // Extract the consent inputs.
  const inputs = [...html.matchAll(/<input[^>]*name="consent_(transactional|marketing)"[^>]*>/g)].map(m => m[0]);
  check(`[${label}] exactly 2 consent checkboxes`, inputs.length === 2, `found ${inputs.length}`);
  check(`[${label}] both UNCHECKED by default`, inputs.every(i => !/\bchecked\b/.test(i)));
  check(`[${label}] both OPTIONAL (no required attr)`, inputs.every(i => !/\brequired\b/.test(i)));
  check(`[${label}] both are type=checkbox`, inputs.every(i => /type="checkbox"/.test(i)));

  // Required field set.
  for (const field of ['name', 'phone', 'email', 'message']) {
    check(`[${label}] has a "${field}" field`, new RegExp(`name="${field}"`).test(html));
  }
  check(`[${label}] has a service field`, /name="service"/.test(html));

  // Privacy/Terms links present, and NOT inside the checkbox label text.
  check(`[${label}] links to Privacy Policy`, html.includes('href="/privacy-policy"'));
  check(`[${label}] links to Terms & Conditions`, html.includes('href="/terms"'));
  check(
    `[${label}] "View our Privacy Policy and Terms & Conditions." sits below the boxes`,
    /View our\s*<a[^>]*href="\/privacy-policy"[^>]*>Privacy Policy<\/a>\s*and\s*<a[^>]*href="\/terms"[^>]*>Terms &amp; Conditions<\/a>\s*\./.test(html)
  );
  check(
    `[${label}] consent labels contain NO embedded links`,
    !/<span class="consent-text">[^<]*<a /.test(html)
  );

  // Forbidden phrase.
  check(`[${label}] does NOT contain "text START"`, !/text START/i.test(html));

  // Post-submit destination is the thank-you page, not another form.
  check(`[${label}] submits to /thank-you`, /action="\/thank-you"/.test(html));
}

/* ------------------------------------------------- FORMS ARE IDENTICAL -- */
console.log('\n── CONTACT vs QUOTE CONSENT SECTIONS ARE IDENTICAL ──');
const consentBlock = (html) => {
  const m = html.match(/<fieldset class="grid gap-3 border-0 p-0">[\s\S]*?<\/fieldset>/);
  return m ? m[0] : null;
};
const qb = consentBlock(quote);
const cb = consentBlock(contact);
check('both pages expose a consent fieldset', Boolean(qb && cb));
if (qb && cb) {
  // Normalise the id/for prefixes, which legitimately differ per page.
  const norm = (s) => s.replace(/(id|for)="(quote|contact)-/g, '$1="X-');
  check('consent sections are byte-identical (after id-prefix normalisation)', norm(qb) === norm(cb),
    'the two forms must present the same consent block');
}

/* -------------------------------------------------------- THANK-YOU -- */
console.log('\n── THANK-YOU PAGE ──');
check('exists', existsSync(join(DIST, 'thank-you/index.html')));
check('contains NO opt-in form', !/<form[^>]*data-lead-form/.test(thanks));
check('contains NO consent checkboxes', !/name="consent_/.test(thanks));
check('is noindex', /name="robots" content="noindex/.test(thanks));

/* ---------------------------------------------------- PRIVACY POLICY -- */
console.log('\n── PRIVACY POLICY ──');
check('contains the required mobile-data clause VERBATIM', privacy.includes(MOBILE_CLAUSE),
  'carriers pattern-match this exact sentence');
check('is a dedicated page', existsSync(join(DIST, 'privacy-policy/index.html')));
check('states consent is optional / not a condition', /not required to (agree|consent)/i.test(privacy));
check('includes HELP/STOP language', /Reply <strong>HELP<\/strong>/.test(privacy) && /STOP<\/strong>/.test(privacy));
check('does NOT contain "text START"', !/text START/i.test(privacy));

/* ------------------------------------------------------------ TERMS -- */
console.log('\n── TERMS & CONDITIONS ──');
check('is a dedicated page', existsSync(join(DIST, 'terms/index.html')));
check('has an SMS/messaging section', /text messaging program/i.test(terms));
check('states consent is not a condition of purchase', /not a condition of any purchase/i.test(terms));
check('does NOT contain "text START"', !/text START/i.test(terms));

/* ------------------------------------------------- NAP CONSISTENCY -- */
console.log('\n── NAP CONSISTENCY ACROSS EVERY PAGE ──');
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});
const pages = walk(DIST);
check(`built ${pages.length} HTML pages`, pages.length >= 12);

const missingName = pages.filter((p) => !readFileSync(p, 'utf8').includes(LEGAL));
check('legal name appears on EVERY page', missingName.length === 0,
  missingName.map((p) => p.replace(DIST, '')).join(', '));

const missingEmail = pages.filter((p) => !readFileSync(p, 'utf8').includes(EMAIL));
check('branded email appears on EVERY page', missingEmail.length === 0,
  missingEmail.map((p) => p.replace(DIST, '')).join(', '));

// The owner opted for a Gmail contact address, so we don't assert "branded";
// we assert the site shows exactly that one chosen address and no OTHER free
// email leaked in. (A branded domain address remains recommended for A2P.)
const strayFreeEmail = pages.filter((p) => {
  const text = readFileSync(p, 'utf8');
  const hits = text.match(/[A-Za-z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook)\.com/gi) || [];
  return hits.some((h) => h.toLowerCase() !== ALLOWED_FREE_EMAIL);
});
check('no free-email address other than the owner\'s chosen one', strayFreeEmail.length === 0,
  strayFreeEmail.map((p) => p.replace(DIST, '')).join(', '));

/* --------------------------------------------------- LINK INTEGRITY -- */
console.log('\n── LINK INTEGRITY (no 404s) ──');
const routes = new Set(
  pages.map((p) => {
    const r = p.replace(DIST, '').replace(/\/index\.html$/, '').replace(/\.html$/, '');
    return r === '' ? '/' : r;
  })
);

const broken = [];
for (const p of pages) {
  const html = readFileSync(p, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
    const href = m[1].replace(/\/$/, '') || '/';
    if (href.startsWith('//')) continue;
    // Static assets resolve on disk; routes resolve against the built page set.
    const asset = join(DIST, href);
    if (existsSync(asset)) continue;
    if (routes.has(href)) continue;
    broken.push(`${p.replace(DIST, '')} → ${href}`);
  }
}
check('every internal link resolves', broken.length === 0, broken.join('\n       → '));

// Nav links present on every page
for (const route of ['/services', '/our-work', '/about', '/reviews', '/faq', '/contact', '/get-a-free-quote', '/privacy-policy', '/terms']) {
  const missing = pages.filter((p) => !readFileSync(p, 'utf8').includes(`href="${route}"`));
  check(`"${route}" linked from every page`, missing.length === 0, missing.map((p) => p.replace(DIST, '')).join(', '));
}

/* ------------------------------------------------------- IMAGES -- */
console.log('\n── IMAGES ──');
const imgs = new Set();
for (const p of pages) {
  for (const m of readFileSync(p, 'utf8').matchAll(/<img[^>]+src="(\/[^"]+)"/g)) imgs.add(m[1]);
}
const missingImgs = [...imgs].filter((i) => !existsSync(join(DIST, i)));
check(`all ${imgs.size} referenced images exist on disk`, missingImgs.length === 0, missingImgs.join(', '));

const noAlt = [];
for (const p of pages) {
  for (const m of readFileSync(p, 'utf8').matchAll(/<img(?![^>]*\balt=)[^>]*>/g)) noAlt.push(`${p.replace(DIST, '')}: ${m[0].slice(0, 60)}`);
}
check('every <img> has an alt attribute', noAlt.length === 0, noAlt.join('\n       → '));

/* ------------------------------------------------------- SUMMARY -- */
console.log(`\n${'─'.repeat(60)}`);
console.log(`  ${pass} passed, ${fail} failed`);
console.log('─'.repeat(60));
process.exit(fail > 0 ? 1 : 0);
