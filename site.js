/* ============================================================
   SPECULATION ENTERTAINMENT, shared behavior
   ============================================================ */

/* ---- Sticky nav: solid background after scroll ---- */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---- Launch discount announcement bar ----
   Edit the copy / button / link below. Shows on every page that
   loads site.js. Closes for the rest of the visit when X is clicked
   (sessionStorage), reappears on a fresh visit. ---- */
(function () {
  const PROMO = {
    lead: 'Summer Launch',
    html: 'Book through <strong>September 22, 2026</strong> and take <em>30% off</em> every package<sup>*</sup>, ask about our summer launch discount.',
    fine: '*Discount applies to packages only. Add-ons and à la carte services are excluded.',
    cta: 'Inquire',
    href: '#contact'
  };
  if (sessionStorage.getItem('promoDismissed') === '1') return;

  const bar = document.createElement('aside');
  bar.className = 'promo';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Launch discount announcement');
  bar.innerHTML =
    '<p class="promo-text"><span class="promo-lead">' + PROMO.lead + '</span>' + PROMO.html +
      '<span class="promo-fine">' + PROMO.fine + '</span></p>' +
    '<a class="promo-cta" href="' + PROMO.href + '">' + PROMO.cta + '</a>' +
    '<button class="promo-close" aria-label="Dismiss announcement">&times;</button>';
  document.body.appendChild(bar);

  // slide in shortly after load
  requestAnimationFrame(() => setTimeout(() => bar.classList.add('in'), 600));

  const close = () => {
    bar.classList.add('dismissed');
    sessionStorage.setItem('promoDismissed', '1');
    setTimeout(() => bar.remove(), 650);
  };
  bar.querySelector('.promo-close').addEventListener('click', close);
  bar.querySelector('.promo-cta').addEventListener('click', () => {
    // collapse the bar once they head to the form
    setTimeout(close, 200);
  });
})();

/* ---- Photo carousel (auto-advance + arrows + dots) ----
   Slides can be listed in the HTML, OR built automatically from a
   folder. Give the carousel a data-gallery="assets/gallery" attribute
   and it loads every image listed in that folder's manifest.json
   (regenerated on every deploy). To change the gallery, just add or
   remove image files in assets/gallery, nothing here needs editing.
   Big photos are served through Netlify's on-the-fly image resizer so
   the page stays fast; if that isn't available it falls back to the
   original file. ---- */
(function () {
  const useCdn = location.protocol !== 'file:';

  function optimized(rawPath) {
    if (!useCdn) return rawPath;
    return '/.netlify/images?url=' + encodeURIComponent(rawPath) + '&w=1600&q=72';
  }

  function buildSlides(car, base, files) {
    const track = car.querySelector('.carousel-track');
    const dir = base.replace(/\/$/, '');
    track.innerHTML = files.map(f => {
      const raw = dir + '/' + f;
      return '<div class="carousel-slide"><img src="' + optimized(raw) +
        '" data-raw="' + raw + '" alt="Speculation Entertainment event photo" loading="lazy"/></div>';
    }).join('');
    // If the resizer URL ever fails, quietly fall back to the original file.
    track.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function onErr() {
        img.removeEventListener('error', onErr);
        img.src = img.getAttribute('data-raw');
      });
    });
  }

  function initCarousel(car) {
    const track = car.querySelector('.carousel-track');
    const slides = Array.from(car.querySelectorAll('.carousel-slide'));
    const dotsWrap = car.querySelector('.carousel-dots');
    if (slides.length < 2) {
      car.querySelectorAll('.carousel-arrow').forEach(a => a.style.display = 'none');
      if (dotsWrap) dotsWrap.innerHTML = '';
      return;
    }
    let i = 0, timer = null;
    const INTERVAL = 5000;

    dotsWrap.innerHTML = slides.map((_, n) =>
      `<button class="carousel-dot${n === 0 ? ' active' : ''}" aria-label="Go to photo ${n + 1}"></button>`).join('');
    const dots = Array.from(dotsWrap.children);

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === i));
    }
    function next() { go(i + 1); }
    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    car.querySelector('.carousel-next').addEventListener('click', () => { next(); start(); });
    car.querySelector('.carousel-prev').addEventListener('click', () => { go(i - 1); start(); });
    dots.forEach((d, n) => d.addEventListener('click', () => { go(n); start(); }));
    car.addEventListener('mouseenter', stop);
    car.addEventListener('mouseleave', start);
    start();
  }

  document.querySelectorAll('[data-carousel]').forEach(car => {
    const base = car.getAttribute('data-gallery');
    if (base) {
      fetch(base.replace(/\/$/, '') + '/manifest.json', { cache: 'no-cache' })
        .then(r => (r.ok ? r.json() : []))
        .then(files => {
          if (Array.isArray(files) && files.length) buildSlides(car, base, files);
          initCarousel(car);
        })
        .catch(() => initCarousel(car));
    } else {
      initCarousel(car);
    }
  });
})();

/* ---- Mobile menu toggle ---- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    })
  );
})();

/* ---- Scroll reveal ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ---- Gold sparkle particles inside [data-sparks] ---- */
(function () {
  document.querySelectorAll('[data-sparks]').forEach(host => {
    const count = parseInt(host.getAttribute('data-sparks'), 10) || 16;
    const layer = document.createElement('div');
    layer.className = 'sparks';
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.setProperty('--dur', (3 + Math.random() * 5) + 's');
      s.style.setProperty('--delay', (Math.random() * 6) + 's');
      const sz = 1 + Math.random() * 2;
      s.style.width = sz + 'px'; s.style.height = sz + 'px';
      layer.appendChild(s);
    }
    host.insertBefore(layer, host.firstChild);
  });
})();

/* ---- Contact form → opens email app (mailto) ---- */
(function () {
  document.querySelectorAll('form[data-mailto]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const to = form.getAttribute('data-mailto');
      const get = (n) => { const f = form.elements[n]; return f ? f.value.trim() : ''; };
      const name = [get('first'), get('last')].filter(Boolean).join(' ');
      const subject = `Event Inquiry${get('type') ? ', ' + get('type') : ''}${name ? ' (' + name + ')' : ''}`;
      const lines = [
        name && `Name: ${name}`,
        get('email') && `Email: ${get('email')}`,
        get('phone') && `Phone: ${get('phone')}`,
        get('type') && `Event Type: ${get('type')}`,
        get('date') && `Event Date: ${get('date')}`,
        get('location') && `Location: ${get('location')}`,
        '',
        get('message') || ''
      ].filter(l => l !== undefined && l !== null && l !== false);
      const body = lines.join('\n');
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });
})();

/* ============================================================
   PACKAGE RENDERER
   Renders the package cards from a config array. See the
   PACKAGES block near the top of each page for how to edit
   prices / features, change the data there, nothing here.
   ============================================================ */
function renderPackages(containerId, list, options) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const opt = options || {};
  const ctaText = opt.cta || 'Inquire';
  const ctaHref = opt.href || '#contact';
  el.innerHTML = list.map(p => {
    const featured = p.featured ? ' featured' : '';
    const badge = p.badge ? `<span class="pkg-badge">${p.badge}</span>` : '';
    const priceIsText = typeof p.price === 'string' && isNaN(parseInt(p.price, 10));
    const fromLabel = priceIsText ? '' : '<span class="pkg-from">Starting at</span>';
    const priceClass = priceIsText ? 'pkg-price text' : 'pkg-price';
    const priceVal = priceIsText ? p.price : ('$' + Number(p.price).toLocaleString());
    const feats = (p.features || []).map(f => {
      const hl = (typeof f === 'object' && f.hl) ? ' class="hl"' : '';
      const txt = (typeof f === 'object') ? f.text : f;
      return `<li${hl}>${txt}</li>`;
    }).join('');
    return `
      <div class="pkg${featured} reveal">
        ${badge}
        <p class="pkg-tier">${p.tier || ''}</p>
        <h3 class="pkg-name">${p.name}</h3>
        <div class="pkg-price-row">${fromLabel}<span class="${priceClass}">${priceVal}</span></div>
        <p class="pkg-hours">${p.hours || ''}</p>
        <div class="pkg-div"></div>
        <ul class="pkg-feats">${feats}</ul>
        <a href="${p.href || ctaHref}" class="pkg-cta">${p.cta || ctaText}</a>
      </div>`;
  }).join('');
  // Re-observe freshly rendered reveal elements
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  el.querySelectorAll('.reveal').forEach(r => io.observe(r));
}

/* ============================================================
   SIGNATURE UPGRADES RENDERER
   Renders the upgrade cards from the lists below. Each item is
   shown as "Starting at $X" (the lowest price). Rules:
     • from: a NUMBER  -> "Starting at $X" (optional suffix, e.g. "/ hr")
     • price: "--"     -> shows a dash (priced on request)
     • price: "text"   -> shows that text as-is (e.g. "On request")
   ============================================================ */
function renderUpgrades(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.map(u => {
    let priceBlock;
    if (typeof u.from === 'number') {
      const suffix = u.suffix ? ` <span class="upgrade-suffix">${u.suffix}</span>` : '';
      priceBlock = `<div class="upgrade-cost"><span class="upgrade-from">Starting at</span><div class="upgrade-price">$${u.from.toLocaleString()}${suffix}</div></div>`;
    } else {
      const price = (u.price == null || u.price === '' || u.price === '--') ? '--' : u.price;
      const cls = price === '--' ? 'upgrade-price dash' : 'upgrade-price note';
      priceBlock = `<div class="${cls}">${price}</div>`;
    }
    return `<div class="upgrade reveal"><h3 class="upgrade-name">${u.name}</h3>${priceBlock}</div>`;
  }).join('');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  el.querySelectorAll('.reveal').forEach(r => io.observe(r));
}

/* ════════════════════════════════════════════════════════════
   EDIT YOUR SIGNATURE UPGRADES HERE
   Premium upgrades shown on the DJ and Bar pages. Set a lowest
   price with `from: 250` (renders "Starting at $250"), or use
   `price: '--'` for items with no set price yet.
   ════════════════════════════════════════════════════════════ */
var SIGNATURE_UPGRADES = [
  { name: 'Gobo Monogram Projection', from: 250 },
  { name: 'Dancing on the Clouds', from: 250 },
  { name: 'Snow Machine', from: 300 },
  { name: 'CO2 Cannons', from: 250 },
  { name: 'Foam Glow Sticks', from: 55, suffix: 'per 50 ct' },
  { name: 'Cold Spark Machine', from: 275 },
  { name: 'Smoke Machine & Color Lighting', from: 50 },
  { name: 'Photo Booth', from: 150 },
  { name: '360 Photo Booth', from: 300 },
  { name: 'Photo Montage & Highlight Reel', from: 150 },
  { name: 'Interactive Guest Book', from: 60 },
  { name: 'Champagne / Prosecco Tower', from: 150 }
];

/* Add-ons, folded into the upgrades grid on any page whose
   #signature-upgrades has a data-extras attribute. Same list on
   both the DJ and Bar pages so they read identically. */
var UNIFIED_ADDONS = [
  { name: 'Additional Hour of DJ Service', from: 100, suffix: '/ hr' },
  { name: 'Additional Hour of Bar Service', from: 75, suffix: '/ hr' },
  { name: 'Additional Bartender', from: 50, suffix: '/ hr' },
  { name: 'Karaoke (add-on to any DJ package)', from: 150 },
  { name: 'Uplighting (4 Units)', from: 150 },
  { name: 'Uplighting (8 Units)', from: 250 },
  { name: 'Uplighting (12 Units)', from: 350 },
  { name: 'Fog / Haze Machine', from: 100 },
  { name: 'Travel Fee (outside service area)', from: 100 },
  { name: 'Rush Booking (under 2 weeks)', from: 200 }
];

/* Auto-render the upgrades wherever the section appears */
(function () {
  const el = document.getElementById('signature-upgrades');
  if (!el) return;
  let list = SIGNATURE_UPGRADES.slice();
  if (el.hasAttribute('data-extras')) list = list.concat(UNIFIED_ADDONS);
  renderUpgrades('signature-upgrades', list);
})();
