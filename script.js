/* ================================================================
   SAGA Research Collaboration · script.js
   ================================================================ */

'use strict';

/* ── 1. HERO CANVAS ────────────────────────────────────────── */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var ctx   = canvas.getContext('2d');
  var N     = 50, DIST = 140, RGB = '37,99,235', SPEED = 0.35;
  var nodes = [], rafId;
  var mouse = { x: null, y: null };

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = [];
    for (var i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  Math.random() * 1.8 + 1,
        a:  Math.random() * 0.4 + 0.15
      });
    }
  }

  function update() {
    nodes.forEach(function (n) {
      if (mouse.x !== null) {
        var dx = mouse.x - n.x, dy = mouse.y - n.y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) { n.vx += dx / d * 0.012; n.vy += dy / d * 0.012; }
      }
      n.x += n.vx; n.y += n.vy;
      if (n.x < -60) n.x = canvas.width  + 60;
      if (n.x > canvas.width  + 60) n.x = -60;
      if (n.y < -60) n.y = canvas.height + 60;
      if (n.y > canvas.height + 60) n.y = -60;
      var s = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (s > 1.4) { n.vx = n.vx / s * 1.4; n.vy = n.vy / s * 1.4; }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(' + RGB + ',' + (1 - d / DIST) * 0.18 + ')';
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
    nodes.forEach(function (n) {
      var g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7);
      g.addColorStop(0, 'rgba(' + RGB + ',' + n.a * 0.4 + ')');
      g.addColorStop(1, 'rgba(' + RGB + ',0)');
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 7, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + RGB + ',' + n.a + ')'; ctx.fill();
    });
  }

  function animate() { update(); draw(); rafId = requestAnimationFrame(animate); }

  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', function () { mouse.x = null; mouse.y = null; });
  window.addEventListener('resize', function () {
    cancelAnimationFrame(rafId); resize(); createNodes(); animate();
  });

  resize(); createNodes(); animate();
}());


/* ── 2. MOBILE NAV ─────────────────────────────────────────── */
function closeMobileNav() {
  var nav = document.getElementById('nav-mobile');
  var btn = document.getElementById('hamburger');
  if (nav) { nav.classList.remove('open'); nav.setAttribute('aria-hidden', 'true'); }
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

(function () {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('nav-mobile');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    nav.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#nav-mobile') && !e.target.closest('#hamburger')) closeMobileNav();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });
}());


/* ── 3. SCROLLED HEADER ────────────────────────────────────── */
(function () {
  var h = document.getElementById('site-header');
  if (!h) return;
  function upd() { h.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', upd, { passive: true });
  upd();
}());


/* ── 4. ACTIVE NAV LINK ────────────────────────────────────── */
(function () {
  var page = document.body.dataset.page;
  if (!page) return;
  var map = { home: 'index.html', team: 'team.html', publications: 'publications.html', contact: 'contact.html' };
  var href = map[page];
  if (!href) return;
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(function (a) {
    if (a.getAttribute('href') === href) a.classList.add('active');
  });
}());


/* ── 5. SCROLL REVEAL ──────────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.fade-in, .fade-in-stagger');
  if (!els.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function (el) { obs.observe(el); });
}());


/* ── 6. STATS COUNTER ──────────────────────────────────────── */
(function () {
  var stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, target = +el.dataset.count, start = 0;
      var inc = target / (1400 / 16);
      (function tick() {
        start = Math.min(start + inc, target);
        el.textContent = Math.round(start);
        if (start < target) setTimeout(tick, 16);
      }());
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(function (s) { obs.observe(s); });
}());


/* ── 7. CONTACT FORM ───────────────────────────────────────── */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name    = form.querySelector('#cf-name');
    var email   = form.querySelector('#cf-email');
    var subject = form.querySelector('#cf-subject');
    var msg     = form.querySelector('#cf-message');
    var valid   = true;
    [name, email, msg].forEach(function (el) {
      if (!el) return;
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error'); valid = false;
    }
    if (!valid) return;
    var sub  = encodeURIComponent((subject && subject.value) || 'Message from ' + name.value);
    var body = encodeURIComponent('Name: ' + name.value + '\nEmail: ' + email.value + '\n\n' + msg.value);
    window.location.href = 'mailto:tisa@mmmi.sdu.dk?subject=' + sub + '&body=' + body;
  });
}());


/* ── 8. PUBLICATIONS ───────────────────────────────────────── */
function formatAuthors(raw) {
  if (!raw) return '';
  return raw.split(/ and /i).map(function (n) {
    n = n.trim();
    if (n.indexOf(',') > -1) {
      var p = n.split(',');
      return (p[1] || '').trim() + ' ' + (p[0] || '').trim();
    }
    return n;
  }).join(', ');
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseBibtex(text) {
  var entries = [], rx = /@(\w+)\s*\{([^,]+),([^@]*)\}/gs;
  var typeMap = {
    article: 'journal', inproceedings: 'conference', proceedings: 'conference',
    workshop: 'workshop', misc: 'preprint', techreport: 'preprint', unpublished: 'preprint'
  };
  function get(fields, key) {
    var r = new RegExp(key + '\\s*=\\s*[{"]([^}"]*)[}"]', 'i');
    var m = r.exec(fields);
    return m ? m[1].trim().replace(/\s+/g, ' ') : '';
  }
  var m;
  while ((m = rx.exec(text)) !== null) {
    var t = m[1].toLowerCase(), f = m[3];
    entries.push({
      title:   get(f, 'title')  || '(No title)',
      authors: formatAuthors(get(f, 'author') || get(f, 'authors')),
      venue:   get(f, 'booktitle') || get(f, 'journal') || get(f, 'howpublished') || '',
      year:    parseInt(get(f, 'year'), 10) || new Date().getFullYear(),
      type:    typeMap[t] || 'conference',
      doi:     get(f, 'doi'),
      url:     get(f, 'url'),
      pdf:     get(f, 'pdf')
    });
  }
  return entries;
}

(function () {
  var list = document.getElementById('pub-list');
  if (!list) return;

  var data = [], currentFilter = 'all';

  function render(items) {
    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<div class="pub-empty" role="status"><p>No publications in this category yet.</p></div>';
      return;
    }
    items.forEach(function (pub) {
      var label     = pub.type.charAt(0).toUpperCase() + pub.type.slice(1);
      var titleHtml = pub.url
        ? '<a href="' + escHtml(pub.url) + '" target="_blank" rel="noopener noreferrer">' + escHtml(pub.title) + '</a>'
        : escHtml(pub.title);
      var links = [
        pub.doi ? '<a class="pub-link" href="https://doi.org/' + escHtml(pub.doi) + '" target="_blank" rel="noopener noreferrer">DOI</a>' : '',
        pub.url ? '<a class="pub-link" href="' + escHtml(pub.url) + '" target="_blank" rel="noopener noreferrer">Link</a>' : '',
        pub.pdf ? '<a class="pub-link" href="' + escHtml(pub.pdf) + '" target="_blank" rel="noopener noreferrer">PDF</a>' : ''
      ].filter(Boolean).join('');
      var el = document.createElement('div');
      el.className = 'pub-item';
      el.setAttribute('role', 'listitem');
      el.innerHTML =
        '<div class="pub-header">' +
          '<span class="pub-type-badge ' + escHtml(pub.type) + '">' + escHtml(label) + '</span>' +
          '<div class="pub-title">' + titleHtml + '</div>' +
        '</div>' +
        '<div class="pub-authors">' + escHtml(pub.authors) + '</div>' +
        (pub.venue ? '<div class="pub-venue">' + escHtml(pub.venue) + '</div>' : '') +
        '<div class="pub-footer">' +
          '<span class="pub-year">' + pub.year + '</span>' +
          (links ? '<div class="pub-links">' + links + '</div>' : '') +
        '</div>';
      list.appendChild(el);
    });
  }

  function applyFilter(f) {
    currentFilter = f;
    render(f === 'all' ? data : data.filter(function (p) { return p.type === f; }));
  }

  document.querySelectorAll('.pub-filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.pub-filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  list.innerHTML = '<div class="pub-empty" role="status"><p>Loading publications…</p></div>';

  fetch('publications.bib')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(function (text) {
      data = parseBibtex(text).sort(function (a, b) { return b.year - a.year; });
      applyFilter(currentFilter);
    })
    .catch(function (err) {
      list.innerHTML = '<div class="pub-empty" role="status"><p>' +
        (window.location.protocol === 'file:'
          ? 'Serve the site with a local server to load publications.<br>Run: <code>python3 -m http.server</code>'
          : 'Could not load publications.bib: ' + err.message) +
        '</p></div>';
    });
}());


/* ── 9. FOOTER YEAR ────────────────────────────────────────── */
(function () {
  var el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}());
