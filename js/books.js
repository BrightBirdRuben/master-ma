// De PDF wordt samen met de website gepubliceerd.
(function () {
  'use strict';
  document.querySelectorAll('.book-form').forEach(function (form) {
    if (!window.fetch || !window.FormData || !window.AbortController) return;
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.book-status');
    const link = form.querySelector('.book-download');
    const originalLabel = button.textContent;
    let busy = false, completed = false;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (busy || completed || !form.reportValidity()) return;
      busy = true;
      button.disabled = true;
      button.textContent = 'Bezig met versturen…';
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Uw aanvraag wordt verstuurd.';
      const controller = new AbortController();
      const timeout = setTimeout(function () { controller.abort(); }, 20000);
      try {
        const data = new FormData(form);
        data.set('updates_opt_in', form.querySelector('[name="updates_opt_in"]')?.checked ? 'ja' : 'nee');
        const response = await fetch(form.action, { method: 'POST', body: data,
          headers: { Accept: 'application/json' }, signal: controller.signal });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error('not-confirmed');
        completed = true;
        button.textContent = 'Aanvraag ontvangen';
        form.reset();
        const bookId = form.dataset.book;
        document.dispatchEvent(new CustomEvent('masterma:book-success', {detail: {bookId: bookId}}));
        if (form.dataset.downloadReady === 'true' && link) {
          // Voorkom een dode download of een HTML-fallback die als PDF wordt aangeboden.
          const pdf = await fetch(link.href, {method: 'HEAD', signal: controller.signal});
          if (pdf.ok && (pdf.headers.get('content-type') || '').includes('application/pdf')) {
            link.hidden = false;
            status.textContent = 'Bedankt. U kunt het boek hieronder gratis downloaden.';
          } else {
            status.textContent = 'Uw aanvraag is ontvangen. De download is tijdelijk niet beschikbaar. Mail deruyck@masterma.be om het boek op te vragen.';
          }
        } else {
          status.textContent = bookId === 'slimme-startup'
            ? 'Uw aanvraag is ontvangen. Neem contact op via deruyck@masterma.be als de download niet verschijnt.'
            : 'Bedankt. U staat op de interesselijst voor The Sellable Company. We houden u per e-mail op de hoogte van dit boek.';
        }
      } catch (_) {
        status.textContent = completed
          ? 'Uw aanvraag is ontvangen, maar de download kon niet worden gecontroleerd. Neem contact op via deruyck@masterma.be.'
          : 'We konden de ontvangst niet bevestigen. Uw gegevens blijven staan. Probeer opnieuw of mail deruyck@masterma.be. Bij een verbindingsprobleem kan de aanvraag toch ontvangen zijn.';
      } finally {
        clearTimeout(timeout);
        busy = false;
        form.removeAttribute('aria-busy');
        if (!completed) { button.disabled = false; button.textContent = originalLabel; }
        status.focus();
      }
    });
  });
})();
