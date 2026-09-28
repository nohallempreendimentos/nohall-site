(function () {
  'use strict';

  var PIXEL_ID = '1281390153418108';
  var CONSENT_KEY = 'nohall_cookie_consent';
  var pixelStarted = false;

  function startPixel() {
    if (pixelStarted) return;
    pixelStarted = true;

    /* Meta Pixel base code. The remote script is loaded only after consent. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('consent', 'grant');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
    trackContentView();
  }

  function trackContentView() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var contentPages = {
      'empreendimentos.html': 'Empreendimentos',
      'portfolio.html': 'Portfólio',
      'empreendimento-modelo.html': 'Empreendimento',
      'viewer.html': 'Visualizador de projeto',
      'lista-privada.html': 'Lista Privada'
    };

    if (contentPages[page]) {
      window.fbq('track', 'ViewContent', {
        content_name: contentPages[page],
        content_category: 'Nohall Empreendimentos'
      });
    }
  }

  function trackContact(method, destination) {
    if (!pixelStarted || typeof window.fbq !== 'function') return;
    window.fbq('track', 'Contact', {
      contact_method: method,
      destination: destination
    });
  }

  window.nohallTrackLead = function (source) {
    if (!pixelStarted || typeof window.fbq !== 'function') return;
    window.fbq('track', 'Lead', {
      content_name: source || 'site',
      content_category: 'Nohall Empreendimentos'
    });
  };

  function bindContactEvents() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href') || '';
      if (/^https:\/\/wa\.me\//i.test(href)) {
        trackContact('whatsapp', 'whatsapp');
      } else if (/^mailto:/i.test(href)) {
        trackContact('email', 'email');
      } else if (/^https:\/\/forms\.gle\//i.test(href)) {
        trackContact('formulario', 'lista_privada');
      }
    }, true);
  }

  function removeBanner() {
    var banner = document.getElementById('nohall-cookie-banner');
    if (banner) banner.remove();
  }

  function saveConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      /* Tracking still follows the choice for the current page. */
    }
  }

  function readConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function showBanner() {
    if (document.getElementById('nohall-cookie-banner')) return;

    var banner = document.createElement('section');
    banner.id = 'nohall-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de cookies');
    banner.innerHTML =
      '<div class="nohall-cookie-copy">' +
        '<strong>Privacidade e cookies</strong>' +
        '<span>Usamos o Meta Pixel para medir o desempenho do site e dos anúncios. Você pode aceitar ou recusar esse rastreamento.</span>' +
        '<a href="/politica-de-privacidade.html#cookies">Saiba mais</a>' +
      '</div>' +
      '<div class="nohall-cookie-actions">' +
        '<button type="button" data-cookie-choice="rejected">Recusar</button>' +
        '<button type="button" data-cookie-choice="accepted" class="is-primary">Aceitar</button>' +
      '</div>';

    var style = document.createElement('style');
    style.id = 'nohall-cookie-style';
    style.textContent =
      '#nohall-cookie-banner{position:fixed;z-index:10000;left:20px;right:20px;bottom:20px;max-width:980px;margin:auto;padding:18px 20px;background:#1e1e20;color:#fafaf8;border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 40px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:space-between;gap:24px;font-family:Inter,Arial,sans-serif}' +
      '.nohall-cookie-copy{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;font-size:12px;line-height:1.55}' +
      '.nohall-cookie-copy strong{font-size:13px}.nohall-cookie-copy span{color:rgba(250,250,248,.72)}.nohall-cookie-copy a{color:#d8b18f;text-decoration:underline}' +
      '.nohall-cookie-actions{display:flex;gap:10px;flex-shrink:0}.nohall-cookie-actions button{border:1px solid rgba(250,250,248,.45);background:transparent;color:#fafaf8;padding:10px 18px;cursor:pointer;font:500 10px Inter,Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase}' +
      '.nohall-cookie-actions button.is-primary{background:#a07855;border-color:#a07855}' +
      '@media(max-width:760px){#nohall-cookie-banner{align-items:stretch;flex-direction:column;gap:16px}.nohall-cookie-actions button{flex:1}}';

    document.head.appendChild(style);
    document.body.appendChild(banner);

    banner.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('[data-cookie-choice]');
      if (!button) return;
      var choice = button.getAttribute('data-cookie-choice');
      saveConsent(choice);
      removeBanner();
      if (choice === 'accepted') {
        startPixel();
      } else if (pixelStarted && typeof window.fbq === 'function') {
        window.fbq('consent', 'revoke');
      }
    });
  }

  window.nohallResetCookieConsent = function () {
    try {
      window.localStorage.removeItem(CONSENT_KEY);
    } catch (error) {
      /* The banner can still be shown for this page. */
    }
    showBanner();
  };

  function init() {
    bindContactEvents();
    var consent = readConsent();
    if (consent === 'accepted') {
      startPixel();
    } else if (consent !== 'rejected') {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
