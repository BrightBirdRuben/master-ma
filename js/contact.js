// Ontvangstbevestiging door Formspree, onafhankelijk van toestemming voor statistieken.
(function () {
  'use strict';
  const form = document.getElementById('contact-form');
  if (!form || !window.fetch || !window.FormData || !window.AbortController) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contact-status');
  const fallback = document.getElementById('contact-fallback');
  let busy = false;
  let completed = false;
  form.addEventListener('submit', async function (event) {
    if (busy || completed) { event.preventDefault(); return; }
    if (event.submitter === fallback) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    busy = true;
    button.disabled = true;
    button.textContent = 'Bezig met versturen…';
    fallback.hidden = true;
    status.textContent = 'Uw bericht wordt verstuurd.';
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(function () { controller.abort(); }, 20000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form),
        headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        status.textContent = 'De verzending is niet bevestigd. Controleer uw gegevens en probeer via Formspree opnieuw, of neem telefonisch contact met ons op.';
        fallback.hidden = false;
        return;
      }
      completed = true;
      form.reset();
      status.textContent = 'Bedankt. Uw bericht is ontvangen. We reageren binnen twee werkdagen.';
      button.textContent = 'Bericht ontvangen';
      document.dispatchEvent(new CustomEvent('masterma:contact-success'));
    } catch (_) {
      status.textContent = 'We konden de ontvangst niet bevestigen. Uw bericht kan toch verzonden zijn. Uw ingevulde gegevens blijven staan. Neem bij twijfel telefonisch contact op, of probeer via Formspree opnieuw.';
      fallback.hidden = false;
    } finally {
      clearTimeout(timeout);
      busy = false;
      form.removeAttribute('aria-busy');
      if (!completed) {
        button.disabled = false;
        button.textContent = 'Bericht versturen';
      }
      status.focus();
    }
  });
})();
