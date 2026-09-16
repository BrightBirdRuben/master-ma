// MASTER M&A — Gedeelde JavaScript
// Mobiel menu + scroll-reveal + year

(function() {
  'use strict';

  // Mobiel menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('is-open');
      const isOpen = navMenu.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? '✕' : '☰';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.textContent = '☰';
      });
    });
  }

  // Scroll-reveal animatie
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }
  
  // Jaartal in footer
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();

// Statistieken: Google wordt pas geladen na toestemming (basic consent mode).
(function () {
  'use strict';
  const measurementId = 'G-965FR30X92';
  const storageKey = 'masterma-analytics-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  let loaded = false;
  let returnFocus = null;
  const scriptUrl = document.currentScript && document.currentScript.src;
  const cookieUrl = scriptUrl ? new URL('../cookies.html', scriptUrl).href : '/cookies.html';

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved && saved.expires > Date.now() && ['granted', 'denied'].includes(saved.value)
        ? saved.value : null;
    } catch (_) { return null; }
  }

  function cleanUrl(value) {
    try { const url = new URL(value); return url.origin + url.pathname; }
    catch (_) { return ''; }
  }

  function startAnalytics() {
    // Lokale bestanden en Vercel-previews tellen niet mee in productiestatistieken.
    if (loaded || choice !== 'granted' || !['masterma.be', 'www.masterma.be'].includes(location.hostname)) return;
    loaded = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_update: false,
      page_location: cleanUrl(location.href),
      page_referrer: cleanUrl(document.referrer)
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }

  function removeAnalyticsCookies() {
    const parts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) {
      domains.push('; domain=' + parts.slice(i).join('.'));
      domains.push('; domain=.' + parts.slice(i).join('.'));
    }
    document.cookie.split(';').forEach(function (item) {
      const name = item.split('=')[0].trim();
      if (name === '_ga' || name.startsWith('_ga_')) {
        domains.forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; path=/' + domain;
        });
      }
    });
  }

  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-labelledby', 'analytics-consent-title');
  panel.hidden = true;
  panel.innerHTML = '<h2 id="analytics-consent-title">Uw keuze voor statistieken</h2>' +
    '<p>Met uw toestemming gebruiken we Google Analytics om bezoeken, contactklikken en geslaagde formulieraanvragen te meten. ' +
    'U kunt de website ook zonder deze statistieken gebruiken. Uw keuze kunt u onderaan elke pagina wijzigen.</p>' +
    '<a class="analytics-policy">Meer over cookies</a>' +
    '<div class="analytics-consent-actions"><button type="button" data-consent="denied">Statistieken weigeren</button>' +
    '<button type="button" data-consent="granted">Statistieken aanvaarden</button></div>';
  panel.querySelector('.analytics-policy').href = cookieUrl;
  document.body.appendChild(panel);

  function saveChoice(value) {
    choice = value;
    try { localStorage.setItem(storageKey, JSON.stringify({ value: value, expires: Date.now() + lifetime })); }
    catch (_) { /* De keuze geldt voor deze pagina als opslag niet beschikbaar is. */ }
    panel.hidden = true;
    if (value === 'granted') startAnalytics();
    else {
      window['ga-disable-' + measurementId] = true;
      removeAnalyticsCookies();
      // Verwijder ook reeds geladen automatische metingen uit deze pagina.
      if (loaded) { location.reload(); return; }
    }
    if (returnFocus) returnFocus.focus();
  }
  panel.querySelectorAll('[data-consent]').forEach(function (button) {
    button.addEventListener('click', function () { saveChoice(button.dataset.consent); });
  });

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = 'Cookievoorkeuren';
  settings.addEventListener('click', function () {
    returnFocus = settings;
    panel.hidden = false;
    panel.querySelector('button').focus();
  });
  const footerLinks = document.querySelector('.footer-bottom-links') || document.querySelector('footer') || document.body;
  footerLinks.appendChild(settings);

  document.addEventListener('click', function (event) {
    if (choice !== 'granted' || !loaded) return;
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const method = /^mailto:/i.test(href) ? 'email' : /^tel:/i.test(href) ? 'phone' : null;
    if (method) window.gtag('event', 'contact_click', { contact_method: method });
  });

  document.addEventListener('masterma:contact-success', function () {
    if (choice !== 'granted' || !loaded || window['ga-disable-' + measurementId]) return;
    window.gtag('event', 'generate_lead', { form_id: 'contact', method: 'contact_form' });
  });

  window.addEventListener('storage', function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    choice = readChoice();
    if (choice !== 'granted') {
      window['ga-disable-' + measurementId] = true;
      removeAnalyticsCookies();
      if (loaded) { location.reload(); return; }
    } else startAnalytics();
    panel.hidden = choice !== null;
  });

  choice = readChoice();
  if (choice === 'granted') startAnalytics();
  else removeAnalyticsCookies();
  panel.hidden = choice !== null;
})();
