/**
 * Lead form submission — progressive enhancement over a working HTML form.
 *
 * With JS on and a webhook configured, we POST JSON to the GoHighLevel inbound
 * webhook and then send the user to /thank-you. With JS off, or no webhook set,
 * the browser performs the form's native POST and Netlify Forms captures it —
 * the form works either way.
 *
 * Consent handling (A2P):
 *   Both consent checkboxes are optional. We never block submission on them; we
 *   just record their state truthfully as "yes"/"no", plus a timestamp and the
 *   opt-in URL. That record is the proof of consent you need if a carrier or
 *   customer ever asks how a number was collected — so don't drop it.
 */

interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  consent_transactional: 'yes' | 'no';
  consent_marketing: 'yes' | 'no';
  /** Proof-of-consent metadata. */
  consent_timestamp: string;
  opt_in_url: string;
  source_form: string;
  page_path: string;
}

function setStatus(el: HTMLElement | null, message: string, kind: 'ok' | 'error') {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  el.style.color = kind === 'ok' ? 'var(--color-grass-600)' : '#b42318';
}

function initLeadForm(form: HTMLFormElement) {
  // Guard against double-binding when Astro's ClientRouter re-runs the script.
  if (form.dataset.leadBound === 'true') return;
  form.dataset.leadBound = 'true';

  const webhook = form.dataset.webhook?.trim() ?? '';
  const thanks = form.dataset.thanks?.trim() || '/thank-you';

  // No webhook configured → leave the native Netlify POST alone.
  if (!webhook) return;

  const statusEl = form.querySelector<HTMLElement>('[role="status"]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-lead-submit]');
  const labelEl = form.querySelector<HTMLElement>('[data-lead-label]');
  const originalLabel = labelEl?.textContent ?? 'Submit';

  form.addEventListener('submit', async (event) => {
    // Let the browser run its own validation first.
    if (!form.reportValidity()) return;
    event.preventDefault();

    // Honeypot: silently succeed for bots rather than telling them they failed.
    const honeypot = form.querySelector<HTMLInputElement>('input[name="bot-field"]');
    if (honeypot?.value) {
      window.location.assign(thanks);
      return;
    }

    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? '').trim();

    const payload: LeadPayload = {
      name: value('name'),
      phone: value('phone'),
      email: value('email'),
      service: value('service'),
      message: value('message'),
      // An unchecked box submits nothing at all — absence means "no".
      consent_transactional: data.get('consent_transactional') ? 'yes' : 'no',
      consent_marketing: data.get('consent_marketing') ? 'yes' : 'no',
      consent_timestamp: new Date().toISOString(),
      opt_in_url: window.location.href,
      source_form: value('source_form') || form.getAttribute('name') || 'lead',
      page_path: window.location.pathname,
    };

    if (submitBtn) submitBtn.disabled = true;
    if (labelEl) labelEl.textContent = 'Sending…';

    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      window.location.assign(thanks);
    } catch {
      if (submitBtn) submitBtn.disabled = false;
      if (labelEl) labelEl.textContent = originalLabel;
      setStatus(
        statusEl,
        "Sorry — that didn't go through. Please call or email us and we'll take care of it.",
        'error'
      );
    }
  });
}

function initAll() {
  document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach(initLeadForm);
}

initAll();
// Re-bind after client-side view transitions.
document.addEventListener('astro:page-load', initAll);
