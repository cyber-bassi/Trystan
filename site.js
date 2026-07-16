/* Lloyd Eyewear — shared JS
   Hamburger menu, form note, footer year, lookbook modals, GIGI frame popup. */

/* --- Nav --- */
var toggle = document.querySelector('.nav-toggle');
var links = document.getElementById('nav-links');
if (toggle && links) {
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.classList.remove('open'); }
  });
}

/* --- Contact form note --- */
var form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function () {
    document.getElementById('form-note').classList.add('ok');
  });
}

/* --- Footer year --- */
var year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* --- Scroll reveal (progressive enhancement: without JS nothing is hidden) --- */
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.cell, .diff-rows li, .v3-split, .offer-rows li, .statement p, .b3-panel .wrap')
    .forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
}

/* --- Lookbook modals --- */
function closeOverlays() {
  document.querySelectorAll('.lb-overlay.open, .frame-pop.open').forEach(function (el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
  });
  document.body.classList.remove('no-scroll');
}

document.querySelectorAll('[data-lookbook]').forEach(function (trigger) {
  function open() {
    var lb = document.getElementById(trigger.getAttribute('data-lookbook'));
    if (!lb) return;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }
  trigger.addEventListener('click', open);
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
});

/* Close: X button, click outside panel, Escape */
document.querySelectorAll('.lb-overlay').forEach(function (overlay) {
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.classList.contains('lb-close')) closeOverlays();
  });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeOverlays();
});

/* --- GIGI frame popup --- */
var pop = document.getElementById('frame-pop');
if (pop) {
  document.querySelectorAll('.lb-frame.clickable').forEach(function (frame) {
    frame.addEventListener('click', function () {
      document.getElementById('fp-img').src = frame.getAttribute('data-img');
      document.getElementById('fp-img').alt = 'GIGI Studios ' + frame.getAttribute('data-name');
      document.getElementById('fp-name').textContent = frame.getAttribute('data-name');
      document.getElementById('fp-series').textContent = frame.getAttribute('data-series') + ' Series';
      document.getElementById('fp-meta').textContent = frame.getAttribute('data-meta');
      pop.classList.add('open');
      pop.setAttribute('aria-hidden', 'false');
    });
  });
  pop.addEventListener('click', function (e) {
    if (e.target === pop || e.target.classList.contains('lb-close')) {
      pop.classList.remove('open');
      pop.setAttribute('aria-hidden', 'true');
      /* keep the lookbook behind it open */
    }
  });
}

/* --- Statement text: words light up dark → white on scroll --- */
var stmt = document.querySelector('.statement p');
if (stmt) {
  (function wrapWords(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); }
          else { var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) { wrapWords(child); }
    });
  })(stmt);
  var words = stmt.querySelectorAll('.w');
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    words.forEach(function (w) { w.classList.add('lit'); });
  } else {
    var litUpdate = function () {
      var r = stmt.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.9, end = vh * 0.45;      /* reveal window while scrolling */
      var p = (start - r.top) / (start - end);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    };
    litUpdate();
    window.addEventListener('scroll', litUpdate, { passive: true });
    window.addEventListener('resize', litUpdate);
  }
}
