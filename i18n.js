/**
 * TRLBLZR.RUN — i18n
 * Toggle FR/EN. Toutes les chaînes de texte du site dans cet objet.
 * Usage : ajouter data-i18n="section.key" sur tout élément à traduire.
 */
const I18N = {
  fr: {
    // === META ===
    'meta.title.home': 'TRLBLZR.RUN — Trail Running Business Club',
    'meta.title.apply': 'Postuler — TRLBLZR.RUN',
    'meta.desc': "Du trail running en montagne pour dirigeants, avec des athlètes professionnels. On ne pitche pas — on s'aligne.",

    // === HEADER / NAV ===
    'nav.sessions': 'Sessions',
    'nav.athletes': 'Athletes',
    'nav.club': 'The Club',
    'common.apply': 'Postuler',
    'common.back': '← Retour',
    'lang.label': 'FR',

    // === HERO ===
    'hero.tag': 'TRLBLZR // 0001',
    'hero.label': 'Trail Running Business Club',
    'hero.title': "Entre&nbsp;dans<br>l'extraordinaire.",
    'hero.lead': "Du Trail Running en montagne pour dirigeants de tous les niveaux, avec des athlètes de trail professionnels. On ne pitche pas — on s'aligne. Le mouvement fait le reste.",
    'hero.ctaPrimary': 'Postuler',
    'hero.ctaSecondary': 'Voir les sessions →',
    'hero.session': 'Session // 0002 — Vercors · Août 2025',
    'hero.scroll': '↓ Scroll',

    // === MANIFESTO ===
    'manifesto.label': 'Manifesto',
    'manifesto.title': 'Résilience <span class="gt">&gt;</span> <span class="vitesse">Vitesse</span>.',
    'manifesto.body': "On ne vient pas chercher un chrono. On vient apprendre à durer.",

    // === SESSIONS — NEXT ===
    'sections.next.index': '01 / 04 — NEXT',
    'sections.next.heading': 'Prochaines sessions',
    'sections.next.link': 'Toutes les expériences →',

    'sessions.next.annecy.date': '22 — 24 Mai 2026',
    'sessions.next.annecy.title': 'Performance<span class="theme">Massif des Bauges</span>',
    'sessions.next.annecy.body': "Trois jours dans la région d'Annecy autour d'un thème&nbsp;: la performance. Tu cours sur les sentiers du massif des Bauges, tu écoutes ce que les élites du trail ont appris du long, du dur, du lent. Tu repars avec un cadre, pas une recette.",
    'sessions.next.annecy.tempImage': 'Photo provisoire — visuel définitif à venir',

    'sessions.next.vercors.date': '03 — 05 Juillet 2026',
    'sessions.next.vercors.title': 'Longévité<span class="theme">Hauts plateaux du Vercors</span>',
    'sessions.next.vercors.body': "Trois jours sur les hauts plateaux du Vercors, autour d'un thème qui change tout&nbsp;: la longévité. Comment durer, comment se réparer, comment construire un corps qui tient sur la durée. Le sentier devient laboratoire.",

    'sessions.next.tbd.tag': 'À venir',
    'sessions.next.tbd.sub': 'Date et lieu à annoncer',
    'sessions.next.tbd.label': 'Bientôt',
    'sessions.next.tbd.date': 'Automne 2026',
    'sessions.next.tbd.title': 'Nouvelle session<span class="theme">Thème à révéler</span>',
    'sessions.next.tbd.body': "Une troisième session prend forme. Lieu, dates et thématique seront annoncés bientôt. Inscris-toi pour être prévenu en priorité et avoir accès aux premières places.",
    'sessions.next.tbd.cta': 'Rester informé',

    // === PAST EDITIONS ===
    'sections.past.index': '02 / 04 — PAST EDITIONS',
    'sections.past.heading': "Ce qu'ils en disent",

    'past.0001.meta': 'Avril 2025',
    'past.0001.title': 'Annecy<br>— Aravis',
    'past.0001.body': "Premier week-end dans les Aravis. Une dizaine de fondateurs, une championne du monde de trail, et la confirmation qu'on tenait quelque chose.",

    'past.0002.meta': 'Août 2025',
    'past.0002.title': 'Vercors<br>— Hauts Plateaux',
    'past.0002.body': "Une édition fondatrice. Plateaux du Vercors, dénivelé long, soirées sans téléphone, débats jusque tard. C'est de là que vient TRLBLZR.",

    'past.0003.meta': 'Mars 2026',
    'past.0003.title': 'Vercors<br>— Hiver',
    'past.0003.body': "Édition hivernale sur les sentiers du Vercors. Rythme soutenu, conditions exigeantes, ascension partagée. Le froid trie ce qui compte.",

    'past.0004.meta': 'Avril 2026',
    'past.0004.title': 'Annecy<br>— Printemps',
    'past.0004.body': "Retour dans les Aravis au sortir de l'hiver. Le printemps en montagne, des dénivelés francs, et la même règle : on court, on échange, on dort tôt.",

    'past.playHint': '▶ Hover to play',
    'past.testimonialsLabel': '— Témoignages',

    'test.aurore': "On n'est pas là pour se comparer, mais pour définir son propre objectif et l'atteindre. Un très bon dosage de sport, de discussions informelles et de moments collectifs.",
    'test.florian': "Je suis revenu avec une énergie que je n'avais pas eue depuis des semaines. J'en suis sorti avec un plan clair&nbsp;: business, nutrition, perf. Motivation au max.",
    'test.antoine': "Un format aussi unique qu'intense&nbsp;: des kilomètres, du D+, des échanges profonds, une énergie collective dingue. C'est rare de pouvoir se livrer sans filtre.",
    'test.alice': "Dans ces moments-là, quelque chose se passe. On tombe les masques, on sort des titres, des fonctions. Et on revient à quelque chose de plus simple&nbsp;: le mouvement, l'effort, le collectif.",

    // === ATHLETES ===
    'sections.athletes.index': '03 / 04 — ATHLETES',
    'sections.athletes.heading': 'Les pros qui nous accompagnent',
    'athletes.photoPending': 'Photo à venir',
    'athletes.role.ultra': 'Ultra-Trailer · Co-founder Trail Running Lab',
    'athletes.role.trail': 'Athlète trail',
    'athlete.geoffray.desc': "<strong>Équipe de France de trail.</strong> Championne du monde trail court (2023) et championne d'Europe (2024). Athlète Kiprun, basée à Grenoble.",
    'athlete.clement.desc': "Fondateur <strong>AC Ultra Performance</strong>, co-fondateur <strong>Trail Running Lab</strong>. Spécialité ultras + FKTs. <strong>FKT GR10</strong> (Pyrénées)&nbsp;: 900&nbsp;km / 52&nbsp;000&nbsp;D+ en <strong>11&nbsp;j&nbsp;13&nbsp;h</strong> self-supported (juillet 2025).",
    'athlete.ohms.desc': 'Jeune athlète élite ultra-trail (ICN Business School). <span class="medal">🥇</span><strong>The Canyons by UTMB® 100M</strong> — 1<sup>er</sup> (avril 2026).',
    'athlete.granet.desc': 'Basé à Annecy, club Annecy Athlétisme. <strong>SwissPeaks Trail 660K</strong> — 4<sup>e</sup> (2024). <span class="medal">🥈</span>Alpi Trail de Pichauris (85&nbsp;km, 2025), top 100 UTMB 2021 (76<sup>e</sup>).',
    'athlete.lelong.desc': "<strong>Équipe de France</strong> de trail. Ingénieure, mission Petzl.",
    'athlete.debizet.desc': "Team / sponsor <strong>ASICS</strong>. Développeur frontend.",

    // === CLUB ===
    'sections.club.index': '04 / 04 — THE CLUB',
    'sections.club.heading': 'La communauté',
    'club.statLabel': 'Coureurs · Entrepreneurs',
    'club.tagline': "Plus de 250 entrepreneurs et investisseurs qui courent ensemble — sans petits fours, sans slides, en vrai.",
    'club.item1': 'Social Runs hebdomadaires à Paris et Lyon, in real life.',
    'club.item2': 'Communauté WhatsApp + LinkedIn pour partager training, expérience, news Trail × Leadership.',
    'club.item3': 'Accès prioritaire aux informations et opportunités.',
    'club.cta': 'Rejoindre le club',

    // === FINAL CTA ===
    'final.eyebrow': 'Go further',
    'final.title': 'Rejoins<br>le <span class="accent">sentier.</span>',
    'final.body': "S'abonner ou postule directement pour une session.<br>Un appel découverte de 30 minutes pour vérifier que c'est aligné — pour toi comme pour nous.",
    'final.cta': 'Postuler',

    // === FOOTER ===
    'footer.descr': "Trail running en montagne pour dirigeants. On ne pitche pas — on s'aligne. Le mouvement fait le reste.",
    'footer.explore': 'Explorer',
    'footer.follow': 'Suivre',
    'footer.copyright': '© 2026 TRLBLZR · All rights reserved',
    'footer.tagline': 'Courir <span class="sep">—</span> Échanger <span class="sep">—</span> Se perfectionner <span class="sep">—</span> Recommencer',

    // === APPLY PAGE ===
    'apply.step1.label': 'Profil',
    'apply.step2.label': 'Informations',
    'apply.step3.label': 'Envoi',

    'apply.s1.eyebrow': 'Postuler / Étape 1 sur 3',
    'apply.s1.title': 'Rejoindre <span class="accent">le club.</span>',
    'apply.s1.lead': "Quelques minutes pour qu'on apprenne à se connaître. Sélectionne d'abord ton profil — les informations qu'on te demandera ensuite dépendent de ce choix.",
    'apply.s1.dirigeant.title': 'Dirigeant<br>Entrepreneur',
    'apply.s1.dirigeant.desc': "Fondateur, CEO, investisseur, leader. Tu veux rejoindre la communauté et participer à une session — quel que soit ton niveau de trail.",
    'apply.s1.athlete.title': 'Athlète<br>Pro / Élite',
    'apply.s1.athlete.desc': "Trail runner pro ou semi-pro. Tu peux nous rejoindre pour partager ton expérience, encadrer les sessions et bénéficier de la communauté.",
    'apply.s1.note': "Sessions traitées sous 48–72&nbsp;h. Si éligible, tu recevras un lien pour réserver un appel découverte de 30&nbsp;min avec Etienne.",

    'apply.s2.eyebrow': 'Postuler / Étape 2 sur 3',
    'apply.s2.title.dirigeant': 'Profil dirigeant.',
    'apply.s2.title.athlete': 'Profil athlète.',
    'apply.s2.lead': "Tout ce qu'il nous faut pour évaluer ta candidature. WhatsApp est notre canal principal de communication pour les sessions.",
    'apply.s2.profileLabel': 'Profil sélectionné',
    'apply.s2.changeLink': 'Changer →',
    'apply.s2.sessionLabel': 'Session ciblée',
    'apply.s2.firstname': 'Prénom',
    'apply.s2.lastname': 'Nom',
    'apply.s2.company': 'Société',
    'apply.s2.itra': 'Index ITRA',
    'apply.s2.itra.hint': 'Index ITRA (ou laisse vide si pas applicable)',
    'apply.s2.utmb': 'Index UTMB',
    'apply.s2.utmb.hint': 'Index UTMB (ou laisse vide)',
    'apply.s2.email': 'Email',
    'apply.s2.whatsapp': 'WhatsApp',
    'apply.s2.linkedin': 'LinkedIn',
    'apply.s2.linkedin.optional': '(optionnel)',
    'apply.s2.rgpd': "J'accepte que mes informations soient utilisées par TRLBLZR.RUN pour traiter ma candidature et me recontacter. Conformément au RGPD, je peux à tout moment demander la suppression de mes données en écrivant à <a href=\"mailto:etienne@bourdon.com\">etienne@bourdon.com</a>.",
    'apply.s2.submit': 'Soumettre ma candidature',
    'apply.s2.submitting': 'Envoi en cours…',
    'apply.s2.error.required': "Merci de remplir tous les champs marqués d'un astérisque, y compris la case RGPD.",
    'apply.s2.error.network': "Une erreur est survenue à l'envoi. Réessaie ou écris-nous directement à etienne@bourdon.com.",

    'apply.s3.eyebrow': 'Postuler / Étape 3 sur 3',
    'apply.s3.title': 'Candidature <span class="accent">reçue.</span>',
    'apply.s3.thanks': 'Merci <span id="confirm-firstname">—</span>. On revient vers toi sous 48 à 72 heures avec une réponse personnalisée.',
    'apply.s3.ref': 'Référence —',
    'apply.s3.suite': 'Voici la suite',
    'apply.s3.body': "Etienne va personnellement étudier ta candidature. Toutes les soumissions passent par une revue manuelle — c'est ce qui garde le club exigeant.",
    'apply.s3.step1': "<strong>Revue de ta candidature (48–72&nbsp;h).</strong> On évalue le profil et l'alignement avec les sessions à venir.",
    'apply.s3.step2': "<strong>Réponse par email.</strong> Si éligible, tu recevras un lien direct pour réserver un appel découverte de 30&nbsp;min avec Etienne, qui finalise l'inscription.",
    'apply.s3.step3': "<strong>Sinon, on t'écrit aussi.</strong> Si la session ciblée est complète ou si le timing n'est pas le bon, on revient vers toi dès qu'une fenêtre se libère.",
    'apply.s3.cta.cal': 'Réserver un appel découverte',
    'apply.s3.cta.home': "Retour à l'accueil",
    'apply.s3.contact': "Une question urgente ? Écris-moi à",
  },

  en: {
    // === META ===
    'meta.title.home': 'TRLBLZR.RUN — Trail Running Business Club',
    'meta.title.apply': 'Apply — TRLBLZR.RUN',
    'meta.desc': "Mountain trail running for executives, alongside professional athletes. We don't pitch — we align. The movement does the rest.",

    // === HEADER / NAV ===
    'nav.sessions': 'Sessions',
    'nav.athletes': 'Athletes',
    'nav.club': 'The Club',
    'common.apply': 'Apply',
    'common.back': '← Back',
    'lang.label': 'EN',

    // === HERO ===
    'hero.tag': 'TRLBLZR // 0001',
    'hero.label': 'Trail Running Business Club',
    'hero.title': 'Step into<br>the extraordinary.',
    'hero.lead': "Mountain trail running for executives at every level, run alongside pro trail athletes. We don't pitch — we align. The movement does the rest.",
    'hero.ctaPrimary': 'Apply',
    'hero.ctaSecondary': 'See the sessions →',
    'hero.session': 'Session // 0002 — Vercors · August 2025',
    'hero.scroll': '↓ Scroll',

    // === MANIFESTO ===
    'manifesto.label': 'Manifesto',
    'manifesto.title': 'Resilience <span class="gt">&gt;</span> <span class="vitesse">Speed</span>.',
    'manifesto.body': "We're not here to chase a time. We're here to learn how to last.",

    // === SESSIONS — NEXT ===
    'sections.next.index': '01 / 04 — NEXT',
    'sections.next.heading': 'Upcoming sessions',
    'sections.next.link': 'All experiences →',

    'sessions.next.annecy.date': 'May 22 — 24, 2026',
    'sessions.next.annecy.title': 'Performance<span class="theme">Massif des Bauges</span>',
    'sessions.next.annecy.body': "Three days in the Annecy region around one theme: performance. You run the Bauges trails. You listen to what trail elites have learned from the long, the hard, the slow. You leave with a framework, not a recipe.",
    'sessions.next.annecy.tempImage': 'Placeholder image — final visual coming',

    'sessions.next.vercors.date': 'July 3 — 5, 2026',
    'sessions.next.vercors.title': 'Longevity<span class="theme">Vercors Plateaus</span>',
    'sessions.next.vercors.body': "Three days on the Vercors high plateaus, around a theme that changes everything: longevity. How to last, how to recover, how to build a body that holds up over time. The trail becomes a lab.",

    'sessions.next.tbd.tag': 'Coming up',
    'sessions.next.tbd.sub': 'Date and place to be announced',
    'sessions.next.tbd.label': 'Soon',
    'sessions.next.tbd.date': 'Fall 2026',
    'sessions.next.tbd.title': 'New session<span class="theme">Theme to be revealed</span>',
    'sessions.next.tbd.body': "A third session is taking shape. Location, dates and theme will be announced soon. Sign up to get notified first and access early spots.",
    'sessions.next.tbd.cta': 'Stay informed',

    // === PAST EDITIONS ===
    'sections.past.index': '02 / 04 — PAST EDITIONS',
    'sections.past.heading': 'What they say',

    'past.0001.meta': 'April 2025',
    'past.0001.title': 'Annecy<br>— Aravis',
    'past.0001.body': "First weekend in the Aravis. A dozen founders, a trail world champion, and confirmation that we had something.",

    'past.0002.meta': 'August 2025',
    'past.0002.title': 'Vercors<br>— High Plateaus',
    'past.0002.body': "A founding edition. Vercors plateaus, long elevation, phone-free evenings, debates late into the night. This is where TRLBLZR comes from.",

    'past.0003.meta': 'March 2026',
    'past.0003.title': 'Vercors<br>— Winter',
    'past.0003.body': "Winter edition on the Vercors trails. Sustained pace, demanding conditions, shared ascent. The cold filters what matters.",

    'past.0004.meta': 'April 2026',
    'past.0004.title': 'Annecy<br>— Spring',
    'past.0004.body': "Back to the Aravis at winter's end. Spring in the mountains, honest elevation gains, and the same rule: we run, we talk, we sleep early.",

    'past.playHint': '▶ Hover to play',
    'past.testimonialsLabel': '— Testimonials',

    'test.aurore': "We're not here to compare ourselves but to define our own goal and reach it. A great balance of sport, informal discussions and collective moments.",
    'test.florian': "I came back with an energy I hadn't had in weeks. I left with a clear plan: business, nutrition, performance. Motivation maxed out.",
    'test.antoine': "A format as unique as it is intense: kilometers, vertical gain, deep exchanges, an incredible collective energy. It's rare to be able to open up without a filter.",
    'test.alice': "In those moments, something happens. The masks drop, we step out of titles and roles. And we return to something simpler: movement, effort, the collective.",

    // === ATHLETES ===
    'sections.athletes.index': '03 / 04 — ATHLETES',
    'sections.athletes.heading': 'The pros that join us',
    'athletes.photoPending': 'Photo coming',
    'athletes.role.ultra': 'Ultra-Trailer · Co-founder Trail Running Lab',
    'athletes.role.trail': 'Trail athlete',
    'athlete.geoffray.desc': "<strong>French national team (trail).</strong> Short trail world champion (2023) and European champion (2024). Kiprun athlete, based in Grenoble.",
    'athlete.clement.desc': "Founder of <strong>AC Ultra Performance</strong>, co-founder of <strong>Trail Running Lab</strong>. Specialty: ultras + FKTs. <strong>GR10 FKT</strong> (Pyrenees)&nbsp;: 900&nbsp;km / 52,000&nbsp;m D+ in <strong>11&nbsp;d&nbsp;13&nbsp;h</strong> self-supported (July 2025).",
    'athlete.ohms.desc': 'Young elite ultra-trail athlete (ICN Business School). <span class="medal">🥇</span><strong>The Canyons by UTMB® 100M</strong> — 1<sup>st</sup> (April 2026).',
    'athlete.granet.desc': 'Based in Annecy, Annecy Athlétisme club. <strong>SwissPeaks Trail 660K</strong> — 4<sup>th</sup> (2024). <span class="medal">🥈</span>Alpi Trail de Pichauris (85&nbsp;km, 2025), top 100 UTMB 2021 (76<sup>th</sup>).',
    'athlete.lelong.desc': "<strong>French national team</strong> trail runner. Engineer, Petzl mission.",
    'athlete.debizet.desc': "Team / sponsor <strong>ASICS</strong>. Frontend developer.",

    // === CLUB ===
    'sections.club.index': '04 / 04 — THE CLUB',
    'sections.club.heading': 'The community',
    'club.statLabel': 'Runners · Entrepreneurs',
    'club.tagline': "More than 250 entrepreneurs and investors running together — no canapés, no slides, the real thing.",
    'club.item1': 'Weekly social runs in Paris and Lyon, in real life.',
    'club.item2': 'WhatsApp + LinkedIn community to share training, experience, Trail × Leadership news.',
    'club.item3': 'Priority access to news and opportunities.',
    'club.cta': 'Join the club',

    // === FINAL CTA ===
    'final.eyebrow': 'Go further',
    'final.title': 'Join<br>the <span class="accent">trail.</span>',
    'final.body': "Subscribe, or apply directly to a session.<br>A 30-minute discovery call to check it's a fit — for you as much as for us.",
    'final.cta': 'Apply',

    // === FOOTER ===
    'footer.descr': "Mountain trail running for executives. We don't pitch — we align. The movement does the rest.",
    'footer.explore': 'Explore',
    'footer.follow': 'Follow',
    'footer.copyright': '© 2026 TRLBLZR · All rights reserved',
    'footer.tagline': 'Run <span class="sep">—</span> Talk <span class="sep">—</span> Sharpen <span class="sep">—</span> Repeat',

    // === APPLY PAGE ===
    'apply.step1.label': 'Profile',
    'apply.step2.label': 'Info',
    'apply.step3.label': 'Send',

    'apply.s1.eyebrow': 'Apply / Step 1 of 3',
    'apply.s1.title': 'Join <span class="accent">the club.</span>',
    'apply.s1.lead': "A few minutes to get to know each other. Pick your profile first — the questions we ask next depend on this choice.",
    'apply.s1.dirigeant.title': 'Executive<br>Entrepreneur',
    'apply.s1.dirigeant.desc': "Founder, CEO, investor, leader. You want to join the community and take part in a session — whatever your trail level.",
    'apply.s1.athlete.title': 'Athlete<br>Pro / Elite',
    'apply.s1.athlete.desc': "Pro or semi-pro trail runner. Join us to share your experience, run the sessions and tap into the community.",
    'apply.s1.note': "Applications processed within 48–72&nbsp;h. If eligible, you'll receive a link to book a 30-min discovery call with Etienne.",

    'apply.s2.eyebrow': 'Apply / Step 2 of 3',
    'apply.s2.title.dirigeant': 'Executive profile.',
    'apply.s2.title.athlete': 'Athlete profile.',
    'apply.s2.lead': "Everything we need to assess your application. WhatsApp is our main session communication channel.",
    'apply.s2.profileLabel': 'Selected profile',
    'apply.s2.changeLink': 'Change →',
    'apply.s2.sessionLabel': 'Targeted session',
    'apply.s2.firstname': 'First name',
    'apply.s2.lastname': 'Last name',
    'apply.s2.company': 'Company',
    'apply.s2.itra': 'ITRA index',
    'apply.s2.itra.hint': 'ITRA index (or leave blank if not applicable)',
    'apply.s2.utmb': 'UTMB index',
    'apply.s2.utmb.hint': 'UTMB index (or leave blank)',
    'apply.s2.email': 'Email',
    'apply.s2.whatsapp': 'WhatsApp',
    'apply.s2.linkedin': 'LinkedIn',
    'apply.s2.linkedin.optional': '(optional)',
    'apply.s2.rgpd': "I agree that my information is used by TRLBLZR.RUN to process my application and contact me. Under GDPR, I can request deletion of my data at any time by writing to <a href=\"mailto:etienne@bourdon.com\">etienne@bourdon.com</a>.",
    'apply.s2.submit': 'Submit my application',
    'apply.s2.submitting': 'Sending…',
    'apply.s2.error.required': 'Please fill all required fields (marked with *) and tick the GDPR box.',
    'apply.s2.error.network': "Something went wrong. Try again or email us directly at etienne@bourdon.com.",

    'apply.s3.eyebrow': 'Apply / Step 3 of 3',
    'apply.s3.title': 'Application <span class="accent">received.</span>',
    'apply.s3.thanks': 'Thanks <span id="confirm-firstname">—</span>. We get back to you within 48–72 hours with a personal reply.',
    'apply.s3.ref': 'Reference —',
    'apply.s3.suite': "Here's what happens next",
    'apply.s3.body': "Etienne will personally review your application. Every submission goes through a manual review — that's what keeps the club exacting.",
    'apply.s3.step1': "<strong>Application review (48–72&nbsp;h).</strong> We assess the profile and the fit with upcoming sessions.",
    'apply.s3.step2': "<strong>Email response.</strong> If eligible, you'll get a direct link to book a 30-min discovery call with Etienne, who finalizes your registration.",
    'apply.s3.step3': "<strong>If not, we still write back.</strong> If the targeted session is full or the timing is off, we'll come back as soon as a window opens.",
    'apply.s3.cta.cal': 'Book a discovery call',
    'apply.s3.cta.home': 'Back to homepage',
    'apply.s3.contact': 'Urgent? Write to me at',
  },
};

const LANG_KEY = 'trlblzr_lang';

function getCurrentLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && I18N[stored]) return stored;
  const navLang = (navigator.language || '').toLowerCase();
  return navLang.startsWith('fr') ? 'fr' : 'en';
}

function applyTranslations(lang) {
  const dict = I18N[lang];
  if (!dict) return;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    // format: "title:key,placeholder:key"
    el.dataset.i18nAttr.split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });
  // <title> et <meta description>
  if (dict['meta.title.home'] && document.body.dataset.page === 'home') {
    document.title = dict['meta.title.home'];
  }
  if (dict['meta.title.apply'] && document.body.dataset.page === 'apply') {
    document.title = dict['meta.title.apply'];
  }
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && dict['meta.desc']) descMeta.setAttribute('content', dict['meta.desc']);

  // Update lang toggle button label
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    const other = lang === 'fr' ? 'EN' : 'FR';
    toggle.textContent = other;
    toggle.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
  }
}

function setLang(lang) {
  if (!I18N[lang]) return;
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations(lang);
  window.dispatchEvent(new CustomEvent('trlblzr:langchange', { detail: { lang } }));
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = getCurrentLang();
  applyTranslations(lang);
  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = localStorage.getItem(LANG_KEY) || getCurrentLang();
      setLang(current === 'fr' ? 'en' : 'fr');
    });
  }
});

// Expose for inline scripts (apply form)
window.I18N = I18N;
window.TRLBLZR_I18N = { setLang, get: (key) => (I18N[getCurrentLang()] || {})[key], current: getCurrentLang, applyTranslations };
