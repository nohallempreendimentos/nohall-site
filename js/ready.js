(function () {
  'use strict';

  var config = window.NOHALL_READY_CONFIG;
  if (!config) return;

  var header = document.getElementById('siteHeader');
  var mobileNav = document.getElementById('mobNav');
  var readyContext = Object.freeze({
    perfil: ['investidor', 'incorporadora'],
    pacote: ['essential', 'performance', 'premium']
  });

  function actionUrl(action, elementFallback) {
    if (!action.available) return elementFallback || action.fallbackUrl;
    var target = new URL(action.futureUrl, window.location.origin);
    var source = new URL(elementFallback || action.fallbackUrl, window.location.origin);
    Object.keys(readyContext).forEach(function (key) {
      var value = source.searchParams.get(key);
      if (readyContext[key].includes(value)) target.searchParams.set(key, value);
    });
    return target.toString();
  }

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', header.classList.contains('shell-solid') || window.scrollY > 10);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { mobileNav.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') mobileNav.classList.remove('open');
    });
  }

  document.querySelectorAll('[data-ready-action]').forEach(function (link) {
    var key = link.getAttribute('data-ready-action');
    var action = config.actions[key];
    if (!action) return;
    var elementFallback = link.getAttribute('data-ready-fallback');
    link.href = actionUrl(action, elementFallback);
    if (link.hasAttribute('data-ready-action-label')) link.textContent = action.label;
    link.dataset.readyAvailable = String(action.available);
  });

  if (config.commercial.visible) {
    var formatter = new Intl.NumberFormat(config.commercial.locale, {
      style: 'currency',
      currency: config.commercial.currency,
      maximumFractionDigits: 0
    });
    document.querySelectorAll('[data-ready-price]').forEach(function (price) {
      var value = config.commercial.packages[price.getAttribute('data-ready-price')];
      if (typeof value !== 'number') return;
      price.textContent = formatter.format(value);
      price.closest('[data-ready-package]')?.classList.toggle('is-provisional', config.commercial.provisional);
    });
    document.querySelectorAll('[data-ready-price-prefix]').forEach(function (prefix) {
      prefix.textContent = config.commercial.pricePrefix;
    });
    document.querySelectorAll('[data-ready-price-label]').forEach(function (label) {
      label.textContent = config.commercial.provisionalLabel;
    });
    document.querySelectorAll('[data-ready-price-note]').forEach(function (note) {
      note.textContent = config.commercial.note;
    });
  } else {
    document.querySelectorAll('[data-ready-commercial]').forEach(function (section) {
      section.hidden = true;
    });
  }

  document.querySelectorAll('[data-ready-gateway]').forEach(function (gateway) {
    var key = gateway.getAttribute('data-ready-gateway');
    var action = config.actions[key];
    if (!action) return;
    var status = gateway.querySelector('[data-ready-gateway-status]');
    gateway.classList.toggle('is-available', action.available);
    if (status) status.textContent = action.available ? 'Portal disponível' : 'Portal em preparação';
  });

  var transformation = document.querySelector('[data-ready-transformation]');
  var stages = transformation ? Array.from(transformation.querySelectorAll('[data-ready-stage]')) : [];
  var frames = transformation ? Array.from(transformation.querySelectorAll('[data-ready-frame]')) : [];

  function setStage(index) {
    stages.forEach(function (stage, stageIndex) {
      var active = stageIndex === index;
      stage.classList.toggle('is-active', active);
      stage.setAttribute('aria-current', active ? 'step' : 'false');
    });
    frames.forEach(function (frame, frameIndex) {
      frame.classList.toggle('is-active', frameIndex === index);
    });
  }

  if (transformation && stages.length && frames.length && 'IntersectionObserver' in window) {
    var stageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setStage(stages.indexOf(entry.target));
      });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
    stages.forEach(function (stage) { stageObserver.observe(stage); });
    setStage(0);
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
})();
