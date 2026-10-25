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

/* Mouvements partagés : tête qui se tourne vers le curseur, flottement, regard au repos (inspiré d'Iris) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var m = reduced ? 0.25 : 1;
  var pointer = { x: 0, y: 0, last: -1e9 };
  function setPointer(x, y) { pointer.x = x; pointer.y = y; pointer.last = performance.now(); }
  window.addEventListener('pointermove', function (e) { setPointer(e.clientX, e.clientY); }, { passive: true });
  window.addEventListener('touchmove', function (e) { if (e.touches[0]) setPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* fabrique un "acteur" : suit le curseur, lissé, avec idle et flottement */
  function actor(el, apply) {
    if (!el) return;
    var look = { x: 0, y: 0 }, visible = true, t0 = performance.now(), prev = t0, phase = Math.random() * 6;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 }).observe(el);
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) { prev = now; return; }
      var dt = Math.min((now - prev) / 1000, 0.05); prev = now;
      var t = (now - t0) / 1000 + phase;
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var tx, ty;
      if (now - pointer.last > 3500) {            /* au repos : regarde lentement autour */
        tx = Math.sin(t * 0.45) * 0.45; ty = Math.sin(t * 0.31 + 1.2) * 0.2;
      } else {                                      /* sinon : se tourne vers le curseur */
        tx = clamp((pointer.x - cx) / Math.max(window.innerWidth * 0.55, 500), -1.2, 1.2);
        ty = clamp((pointer.y - cy) / Math.max(window.innerHeight * 0.55, 400), -1.2, 1.2);
      }
      var k = 1 - Math.pow(0.0025, dt);
      look.x += (tx - look.x) * k; look.y += (ty - look.y) * k;
      apply(look, t, m);
    }
    requestAnimationFrame(frame);
  }

  /* carte QR du cerisier : flotte, se tourne vers le curseur, la branche suit légèrement */
  var profil = document.querySelector('[data-profil]');
  if (profil) {
    var card = profil.querySelector('.profil-qr'), branch = profil.querySelector('.profil-branch');
    actor(profil, function (look, t, m) {
      var bob = Math.sin(t * 1.6) * 4 * m;
      card.style.transform = 'translate3d(' + (look.x * 6).toFixed(2) + 'px,' + (bob + look.y * 4).toFixed(2) + 'px,0) ' +
        'rotateY(' + (look.x * 14).toFixed(2) + 'deg) rotateX(' + (-look.y * 10).toFixed(2) + 'deg) rotateZ(' + (Math.sin(t * 1.1) * 0.8 * m - look.x * 1.2).toFixed(2) + 'deg)';
      if (branch) branch.style.translate = (look.x * -9).toFixed(2) + 'px ' + (bob * 0.6 + look.y * -5).toFixed(2) + 'px';
    });
  }

  /* Obsidian appliqué à ma photo : tourne vers le curseur, flotte, l'image contre-bouge */
  var box = document.querySelector('[data-obsidian]');
  var photo = document.querySelector('[data-obsidian-card]');
  if (box && photo) {
    var img = photo.querySelector('img');
    actor(box, function (look, t, m) {
      var bob = Math.sin(t * 1.6) * 6 * m;
      photo.style.transform = 'perspective(1000px) translate3d(' + (look.x * 22).toFixed(2) + 'px,' + (look.y * 16 + bob).toFixed(2) + 'px,0) ' +
        'rotateY(' + (look.x * 7).toFixed(2) + 'deg) rotateX(' + (-look.y * 5).toFixed(2) + 'deg) rotateZ(' + (-look.x * 0.6 + Math.sin(t * 1.1) * 0.3 * m).toFixed(2) + 'deg)';
      if (img) img.style.transform = 'scale(1.1) translate3d(' + (look.x * -14).toFixed(2) + 'px,' + (look.y * -10).toFixed(2) + 'px,0)';
    });

    /* bouton son : ambiance douce générée en direct (aucun fichier audio), coupée par défaut */
    var btn = box.querySelector('[data-sound]');
    if (btn) {
      var label = btn.querySelector('[data-sound-label]');
      var audio = null, active = false;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { btn.hidden = true; }

      function build() {
        var ctx = new AC(), master = ctx.createGain(); master.gain.value = 0;
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.Q.value = 0.4;
        lp.connect(master); master.connect(ctx.destination);
        var lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
        lfo.frequency.value = 0.07; lfoGain.gain.value = 260; lfo.connect(lfoGain); lfoGain.connect(lp.frequency); lfo.start();
        [110, 164.81, 220, 277.18, 329.63].forEach(function (f, i) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f; o.detune.value = (i - 2) * 4;
          g.gain.value = 0.22 / (1 + i * 0.25); o.connect(g); g.connect(lp); o.start();
        });
        return { ctx: ctx, master: master, timer: 0 };
      }
      function fade(to, secs) {
        var now = audio.ctx.currentTime, g = audio.master.gain;
        g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(to, now + secs);
      }
      function setSound(on) {
        active = on;
        btn.setAttribute('aria-pressed', String(on));
        btn.setAttribute('aria-label', on ? 'Couper l’ambiance sonore' : 'Activer l’ambiance sonore');
        label.textContent = on ? 'SON ACTIVÉ' : 'SON COUPÉ';
        if (on) {
          if (!audio) audio = build();
          clearTimeout(audio.timer); audio.ctx.resume(); fade(0.12, 2.5);
        } else if (audio) {
          fade(0, 1);
          audio.timer = setTimeout(function () { audio.ctx.suspend(); }, 1100);
        }
      }
      btn.addEventListener('click', function () { setSound(!active); });
      document.addEventListener('visibilitychange', function () {
        if (!audio || !active) return;
        if (document.hidden) audio.ctx.suspend(); else audio.ctx.resume();
      });
    }
  }
})();
