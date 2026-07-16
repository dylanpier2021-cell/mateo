/**
 * Motion layer — scroll reveals, header shrink, and the before/after sliders.
 *
 * Everything here is progressive enhancement: the CSS start states only apply
 * under `html.motion-safe`, which BaseLayout's inline script sets when JS is on
 * AND the user hasn't asked for reduced motion. No JS / reduced motion → the
 * page renders fully visible and static.
 */

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------- */
/*  SCROLL REVEALS                                                              */
/* -------------------------------------------------------------------------- */

function initReveals() {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  // No IntersectionObserver (or reduced motion) → just show everything.
  if (prefersReduced() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // reveal once, then stop watching
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  );

  items.forEach((el) => {
    // Already in view on load (e.g. the hero) → reveal immediately, no flash.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  HEADER SHRINK ON SCROLL                                                     */
/* -------------------------------------------------------------------------- */

function initHeader() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* -------------------------------------------------------------------------- */
/*  BEFORE / AFTER SLIDERS                                                      */
/*  The visible divider tracks a range input layered on top, which keeps the    */
/*  control keyboard-accessible and screen-reader-labelled for free.            */
/* -------------------------------------------------------------------------- */

function initBeforeAfter() {
  document.querySelectorAll<HTMLElement>('.ba__frame').forEach((frame) => {
    const range = frame.querySelector<HTMLInputElement>('.ba__range');
    if (!range) return;

    const apply = () => frame.style.setProperty('--pos', `${range.value}%`);
    apply();
    range.addEventListener('input', apply);
  });
}

/* -------------------------------------------------------------------------- */
/*  MOBILE MENU                                                                 */
/*  The menu is a <details> element, so it works with zero JS. This only adds   */
/*  the niceties: close on outside click and on Escape.                         */
/* -------------------------------------------------------------------------- */

function initMobileMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
  if (!menu) return;

  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    }
  });
}

/* -------------------------------------------------------------------------- */

function init() {
  initReveals();
  initHeader();
  initBeforeAfter();
  initMobileMenu();
}

init();
// Re-run after client-side view transitions.
document.addEventListener('astro:page-load', init);
