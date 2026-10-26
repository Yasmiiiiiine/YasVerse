/* YasVerse — mode sombre (option) et langues FR/EN. Défaut : clair + français. Choix mémorisé. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function load(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- Dictionnaire FR -> EN (clé = texte français normalisé) ---------- */
  var EN = {
    "YasVerse — l’univers numérique de Yasmine": "YasVerse — Yasmine’s digital universe",
    "Aller au contenu": "Skip to content",
    "L’univers numérique de Yasmine": "Yasmine’s digital universe",
    "Profil": "Profile", "Parcours": "Journey", "Projets": "Projects", "Me contacter": "Contact me",
    "● ÉTUDIANTE EN INFORMATIQUE · BOUIRA, ALGÉRIE": "● COMPUTER SCIENCE STUDENT · BOUIRA, ALGERIA",
    "Le numérique": "Technology", "avec": "with", "curiosité": "curiosity", "et intention.": "and intention.",
    "Bienvenue dans mon univers. Je suis Rabia Yasmine, étudiante en troisième année d’informatique, passionnée par la programmation, la cybersécurité et les idées qui prennent forme.": "Welcome to my universe. I’m Rabia Yasmine, a third-year computer science student passionate about programming, cybersecurity and ideas taking shape.",
    "Découvrir mes projets": "Discover my projects", "Explorer mon profil ↓": "Explore my profile ↓",
    "Mon profil": "My profile", "Scannez pour": "Scan to", "partager": "share",
    "— Apprendre · construire · partager": "— Learn · build · share",
    "Ajoutez votre photo": "Add your photo",
    "Informatique & technologies": "Computer science & technology",
    "Curieuse par nature ✦": "Curious by nature ✦", "● Ouverte aux opportunités": "● Open to opportunities",
    "↓ DÉFILEZ POUR EXPLORER": "↓ SCROLL TO EXPLORE",
    "01 — QUI SUIS-JE ?": "01 — WHO AM I?", "Un profil": "A profile", "en mouvement.": "in motion.",
    "J’aime comprendre comment les choses fonctionnent — puis imaginer comment les rendre meilleures.": "I love understanding how things work — then imagining how to make them better.",
    "Passionnée par la programmation et les disciplines technologiques, je m’appuie sur une solide base en mathématiques qui nourrit ma logique et ma rigueur. Ambitieuse et orientée vers l’action, j’aime concevoir des projets innovants et relever des défis techniques.": "Passionate about programming and technology, I rely on a solid foundation in mathematics that feeds my logic and rigour. Ambitious and action-oriented, I enjoy designing innovative projects and tackling technical challenges.",
    "MON UNIVERSITÉ": "MY UNIVERSITY", "Bouira, Algérie": "Bouira, Algeria",
    "J’y poursuis mon cursus en informatique dans un environnement qui valorise la rigueur, le travail et la recherche scientifique. Chaque étape renforce mon envie d’apprendre et de contribuer.": "I pursue my computer science studies there, in an environment that values rigour, hard work and scientific research. Each step strengthens my desire to learn and to contribute.",
    "Licence · 3ᵉ année": "Bachelor’s · 3rd year", "Informatique": "Computer science",
    "02 — CE QUE J’APPRENDS": "02 — WHAT I’M LEARNING", "Des expériences qui": "Experiences that", "font grandir.": "help me grow.",
    "Formations, découvertes et expériences de terrain : chaque occasion est une nouvelle façon de progresser.": "Training, discoveries and field experience: every opportunity is a new way to progress.",
    "CYBERSÉCURITÉ": "CYBERSECURITY", "Formation spécialisée": "Specialised training",
    "La sécurité, de la théorie à la pratique": "Security, from theory to practice",
    "Un parcours complet autour de la protection des systèmes, des réseaux et des applications web, avec des exercices en environnement contrôlé.": "A complete path covering the protection of systems, networks and web applications, with exercises in a controlled environment.",
    "Voir les modules étudiés": "See the modules studied",
    "Fondamentaux": "Fundamentals", "Introduction · réseaux · cryptographie · gestion des risques": "Introduction · networks · cryptography · risk management",
    "Tests & applications": "Testing & applications",
    "Hacking éthique · Nmap · Metasploit · OWASP · Burp Suite": "Ethical hacking · Nmap · Metasploit · OWASP · Burp Suite",
    "Détection & réponse": "Detection & response",
    "Technologies & projet": "Technologies & project", "Cloud · Zero Trust · sécurité IoT · audit et rapport final": "Cloud · Zero Trust · IoT security · audit and final report",
    "Également : bases de données, conformité et référentiels ISO 27001 / NIST.": "Also: databases, compliance and ISO 27001 / NIST frameworks.",
    "Formation en ligne": "Online course", "Java intermédiaire": "Intermediate Java",
    "Programmation orientée objet, classes, héritage, interfaces et polymorphisme, puis exceptions, collections, threads et fichiers.": "Object-oriented programming, classes, inheritance, interfaces and polymorphism, then exceptions, collections, threads and files.",
    "POO": "OOP", "Fichiers": "Files",
    "Apprentissage en ligne": "Online learning", "Python : concepts et pratique": "Python: concepts and practice",
    "Collections, gestion des erreurs, programmation fonctionnelle et bases de la programmation orientée objet.": "Collections, error handling, functional programming and the basics of object-oriented programming.",
    "Tuples & dictionnaires": "Tuples & dictionaries", "Décorateurs": "Decorators", "Héritage": "Inheritance",
    "STAGE INFORMATIQUE": "IT INTERNSHIP", "Environnement bancaire": "Banking environment",
    "Découvrir l’informatique en milieu bancaire": "Discovering IT in a banking environment",
    "Observation de l’architecture réseau, des équipements, de la gestion des connexions et incidents, ainsi que des procédures et règles de confidentialité.": "Observing the network architecture, equipment, connection and incident management, as well as confidentiality procedures and rules.",
    "Réseaux": "Networks", "Confidentialité": "Confidentiality",
    "DESIGN GRAPHIQUE": "GRAPHIC DESIGN", "Club universitaire TEKNE": "TEKNE university club", "Créer avec Illustrator": "Creating with Illustrator",
    "Associer imagination, sens esthétique et réflexion pour concevoir des réalisations visuelles originales et partager de nouvelles idées.": "Combining imagination, aesthetic sense and reflection to design original visual work and share new ideas.",
    "Créativité": "Creativity", "Esprit collectif": "Team spirit",
    "03 — CE QUE JE CONSTRUIS": "03 — WHAT I BUILD", "Des idées qui": "Ideas that", "deviennent projets.": "become projects.",
    "J’explore la sécurité, le développement et l’apprentissage par la pratique.": "I explore security, development and learning by doing.",
    "PROTECTION NUMÉRIQUE": "DIGITAL PROTECTION", "PROJET WEB": "WEB PROJECT",
    "Une interface d’analyse pour évaluer le niveau de risque d’URL, d’e-mails et de mots de passe. Le projet sépare son interface web de son API Python construite avec FastAPI.": "An analysis interface that assesses the risk level of URLs, emails and passwords. The project separates its web interface from its Python API built with FastAPI.",
    "Cybersécurité": "Cybersecurity", "Visiter le projet ↗": "Visit the project ↗",
    "analyse des services": "service analysis", "environnement contrôlé": "controlled environment", "● laboratoire terminé": "● lab completed",
    "PROJET DE FORMATION": "TRAINING PROJECT",
    "Projet final de formation réalisé dans un laboratoire d’apprentissage : reconnaissance, analyse d’une machine Windows cible et documentation des étapes dans un rapport.": "Final training project carried out in a learning lab: reconnaissance, analysis of a target Windows machine and documentation of the steps in a report.",
    "Lab contrôlé": "Controlled lab", "Consulter le PDF de présentation ↗": "Read the presentation PDF ↗",
    "Votre navigateur ne prend pas en charge la vidéo.": "Your browser does not support video.", "Télécharger la vidéo": "Download the video",
    "PROJET EN COURS": "PROJECT IN PROGRESS",
    "Un pont numérique entre le parcours universitaire et la vie professionnelle. La plateforme aide les étudiants et diplômés à valoriser leurs compétences, à découvrir des offres et à suivre leurs candidatures, tout en permettant aux entreprises de repérer des profils adaptés.": "A digital bridge between university studies and working life. The platform helps students and graduates showcase their skills, discover job offers and track their applications, while allowing companies to spot suitable profiles.",
    "Emploi & stages": "Jobs & internships", "Profils vérifiés": "Verified profiles", "Recrutement": "Recruitment",
    "Voir la démo en ligne ↗": "See the live demo ↗", "Découvrir le projet": "Discover the project",
    "Espace candidat": "Candidate area", "Profil, CV, documents, offres et suivi des candidatures.": "Profile, CV, documents, job offers and application tracking.",
    "Espace entreprise": "Company area", "Publication d’offres et recherche selon des critères explicites.": "Posting job offers and searching by explicit criteria.",
    "Vérification": "Verification", "Validation universitaire et vérification des diplômes par QR code ou lien.": "University validation and degree verification via QR code or link.",
    "Évolution": "Roadmap", "MVP, universités, vérification, matching avancé, puis mobile et montée en charge.": "MVP, universities, verification, advanced matching, then mobile and scaling.",
    "Projet conçu par Rabia Yasmine et Khobizi Ibtessam.": "Project designed by Rabia Yasmine and Khobizi Ibtessam.",
    "Toujours en train d’explorer": "Always exploring",
    "Pratique et veille sur TryHackMe, Hack The Box et des projets de programmation créative.": "Practice and monitoring on TryHackMe, Hack The Box and creative programming projects.",
    "ET MAINTENANT ?": "WHAT’S NEXT?", "Une idée, une question,": "An idea, a question,", "une opportunité ?": "an opportunity?",
    "Je serais ravie d’échanger avec vous.": "I’d be delighted to hear from you.", "Écrivez-moi ↗": "Write to me ↗", "Voir mon GitHub ↗": "See my GitHub ↗",
    "Conçu avec curiosité et une touche de rose.": "Made with curiosity and a touch of pink.", "Retour en haut ↑": "Back to top ↑",
    /* attributs et balises meta */
    "Navigation principale": "Main navigation",
    "Partager mon profil — QR code vers yas-verse.vercel.app": "Share my profile — QR code to yas-verse.vercel.app",
    "QR code pour partager le profil de Rabia Yasmine": "QR code to share Rabia Yasmine’s profile",
    "Portrait de Rabia Yasmine": "Portrait of Rabia Yasmine",
    "Démonstration vidéo du projet Compus Travail": "Video demo of the Compus Travail project",
    "Découvrez le profil, les formations et les projets de Rabia Yasmine, étudiante en informatique à Bouira.": "Discover the profile, training and projects of Rabia Yasmine, a computer science student in Bouira.",
    "YasVerse, le portfolio numérique de Rabia Yasmine, étudiante en informatique à Bouira.": "YasVerse, the digital portfolio of Rabia Yasmine, a computer science student in Bouira."
  };
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

  /* ---------- Traduction ---------- */
  var textNodes = null, origText = new WeakMap();
  function collectText() {
    textNodes = [];
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode && n.parentNode.nodeName;
        if (p === 'SCRIPT' || p === 'STYLE' || p === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    while (w.nextNode()) textNodes.push(w.currentNode);
  }
  var ATTRS = [['nav', 'aria-label'], ['.profil-qr', 'aria-label'], ['.profil-qr img', 'alt'], ['.portrait img', 'alt'], ['video', 'aria-label'],
    ['meta[name="description"]', 'content'], ['meta[property="og:title"]', 'content'], ['meta[property="og:description"]', 'content'], ['meta[name="twitter:title"]', 'content']];
  var origAttr = [], origTitle = document.title;

  function applyLang(lang) {
    if (!textNodes) collectText();
    textNodes.forEach(function (n) {
      if (!origText.has(n)) origText.set(n, n.nodeValue);
      var o = origText.get(n);
      if (lang === 'en') {
        var t = EN[norm(o)];
        if (t) { var m = o.match(/^(\s*)[\s\S]*?(\s*)$/); n.nodeValue = m[1] + t + m[2]; return; }
      }
      if (n.nodeValue !== o) n.nodeValue = o;
    });
    if (!origAttr.length) {
      ATTRS.forEach(function (a) {
        document.querySelectorAll(a[0]).forEach(function (el) {
          if (el.hasAttribute(a[1])) origAttr.push([el, a[1], el.getAttribute(a[1])]);
        });
      });
    }
    origAttr.forEach(function (x) {
      x[0].setAttribute(x[1], lang === 'en' ? (EN[norm(x[2])] || x[2]) : x[2]);
    });
    document.title = lang === 'en' ? (EN[norm(origTitle)] || origTitle) : origTitle;
    root.lang = lang;
  }

  /* ---------- Thème ---------- */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var langBtn = document.querySelector('[data-lang-toggle]');
  var theme = load('yv-theme', 'light') === 'dark' ? 'dark' : 'light';
  var lang = load('yv-lang', 'fr') === 'en' ? 'en' : 'fr';

  var LABELS = {
    fr: { toDark: 'Passer en mode sombre', toLight: 'Passer en mode clair', toLang: 'Switch to English' },
    en: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode', toLang: 'Passer en français' }
  };
  function refreshTools() {
    var L = LABELS[lang];
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
      themeBtn.setAttribute('aria-label', theme === 'dark' ? L.toLight : L.toDark);
      themeBtn.title = theme === 'dark' ? L.toLight : L.toDark;
    }
    if (langBtn) {
      langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
      langBtn.setAttribute('aria-label', L.toLang);
      langBtn.title = L.toLang;
    }
  }
  function applyTheme(t, animate) {
    theme = t;
    if (animate && !reduced) {
      root.classList.add('theme-anim');
      setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
    }
    if (t === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#15101a' : '#fff8fa');
    var hero = document.querySelector('.hero-shader');
    if (hero && hero.yvSetPalette) hero.yvSetPalette(t === 'dark' ? 'night' : 'light');
    refreshTools();
  }

  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = theme === 'dark' ? 'light' : 'dark';
    save('yv-theme', next); applyTheme(next, true);
  });
  if (langBtn) langBtn.addEventListener('click', function () {
    lang = lang === 'fr' ? 'en' : 'fr';
    save('yv-lang', lang); applyLang(lang); refreshTools();
  });

  applyTheme(theme, false);
  if (lang === 'en') applyLang('en');
  refreshTools();
})();
