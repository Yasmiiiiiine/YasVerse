/* YasVerse — interactions (menu, reveals en cascade, onglet actif, progression, parallaxe) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* menu mobile */
  var menuButton = document.querySelector('.menu');
  var nav = document.querySelector('#nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  document.querySelector('#year').textContent = new Date().getFullYear();

  /* reveal au scroll + cascade */
  var SELECTORS = '.quote,.university,.experience,.project,.practice';
  function stagger(els, base, step) {
    els.forEach(function (el, i) {
      el.style.setProperty('--motion-delay', (base + i * step) + 'ms');
    });
  }
  document.querySelectorAll('.profile-grid,.experience-list,.project-grid').forEach(function (group) {
    stagger(Array.from(group.children), 0, 80);
  });
  var items = Array.from(document.querySelectorAll(SELECTORS));
  if ('IntersectionObserver' in window && !reduced) {
    items.forEach(function (el) { el.classList.add('reveal'); });
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* barre de progression de scroll + ombre du header */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var header = document.querySelector('header');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', h.scrollTop > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* onglet actif selon la section visible */
  var tabs = nav ? Array.from(nav.querySelectorAll('.tab[data-section]')) : [];
  if (tabs.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tabs.forEach(function (t) {
          t.classList.toggle('active', t.dataset.section === entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ['profil', 'parcours', 'projets'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* parallaxe légère du portrait au mouvement de la souris */
  var hero = document.querySelector('.hero');
  var portraitArea = document.querySelector('.portrait-area');
  if (hero && portraitArea && !reduced) {
    hero.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - .5) * 14;
      var y = (e.clientY / window.innerHeight - .5) * 12;
      portraitArea.style.translate = x + 'px ' + y + 'px';
    }, { passive: true });
  }
})();

/* Obsidian — parallaxe 3D douce + bouton son */
(function () {
  'use strict';
  var box = document.querySelector('[data-obsidian]');
  var card = document.querySelector('[data-obsidian-card]');
  if (!box || !card) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, raf = 0;

  function draw() {
    /* ressort simple : rapproche la valeur courante de la cible */
    cur.x += (target.x - cur.x) * 0.1;
    cur.y += (target.y - cur.y) * 0.1;
    card.style.transform =
      'perspective(1000px) translate3d(' + (cur.x * 40).toFixed(2) + 'px,' + (cur.y * 40).toFixed(2) + 'px,0) ' +
      'rotateX(' + (cur.y * -8).toFixed(2) + 'deg) rotateY(' + (cur.x * 8).toFixed(2) + 'deg)';
    if (Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001) {
      raf = requestAnimationFrame(draw);
    } else { raf = 0; }
  }
  function kick() { if (!raf) raf = requestAnimationFrame(draw); }

  if (!reduced) {
    box.addEventListener('mousemove', function (e) {
      var r = box.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width - 0.5;
      target.y = (e.clientY - r.top) / r.height - 0.5;
      kick();
    }, { passive: true });
    box.addEventListener('mouseleave', function () { target.x = 0; target.y = 0; kick(); });
  }

  /* bouton son (état visuel, comme dans la maquette) */
  var btn = box.querySelector('[data-sound]');
  if (btn) {
    var label = btn.querySelector('[data-sound-label]');
    btn.addEventListener('click', function () {
      var active = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(active));
      label.textContent = active ? 'SOUND ON' : 'SOUND OFF';
    });
  }
})();
