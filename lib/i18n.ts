// TRLBLZR i18n — dictionnaire complet FR + EN.
// Repris à l'identique du site statique trlblzr.run (i18n.js).
// Stratégie : URL ?lang= + localStorage. La langue se propage cross-brand via ?lang=.

export type Locale = 'fr' | 'en';

export const LOCALES: Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';
export const LOCALE_STORAGE_KEY = 'trlblzr-locale';

export type Dict = {
  meta: { titleHome: string; titleApply: string; desc: string };
  nav: { sessions: string; athletes: string; club: string };
  header: { sublogo: string };
  common: { apply: string; back: string };
  hero: {
    tag: string;
    label: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    poweredBy: string;
    ctaPrimary: string;
    ctaSecondary: string;
    session: string;
    scroll: string;
  };
  manifesto: { label: string; titleA: string; titleB: string; body: string };
  sections: {
    nextIndex: string;
    nextHeading: string;
    nextLink: string;
    pastIndex: string;
    pastHeading: string;
    athletesIndex: string;
    athletesHeading: string;
    clubIndex: string;
    clubHeading: string;
  };
  sessions: {
    // Saison automne 2026 — sessions chronologiques (france-2026-09 annulée, retirée)
    octDate: string; octPlace: string; octTheme: string; octBody: string;
    grandCanyonDate: string; grandCanyonPlace: string; grandCanyonTheme: string; grandCanyonBody: string;
    marocDate: string; marocPlace: string; marocTheme: string; marocBody: string;
    novDate: string; novPlace: string; novTheme: string; novBody: string;
    applyShort: string;
  };
  past: {
    e0001Meta: string;
    e0001TitleLine1: string;
    e0001TitleLine2: string;
    e0001Body: string;
    e0002Meta: string;
    e0002TitleLine1: string;
    e0002TitleLine2: string;
    e0002Body: string;
    e0003Meta: string;
    e0003TitleLine1: string;
    e0003TitleLine2: string;
    e0003Body: string;
    e0004Meta: string;
    e0004TitleLine1: string;
    e0004TitleLine2: string;
    e0004Body: string;
    playHint: string;
    testimonialsLabel: string;
  };
  testimonials: {
    intro: string;
    aurore: string;
    jonathan: string;
    florian: string;
    antoine: string;
    louis: string;
    alexandre: string;
    alice: string;
    jeremie: string;
    sergio: string;
    fabrice: string;
  };
  athletes: { roleUltra: string; roleTrail: string };
  club: { statLabel: string; tagline: string; item1: string; item2: string; item3: string; cta: string; ctaApply: string; ctaNetwork: string };
  final: { eyebrow: string; titleLine1: string; titleLine2Pre: string; titleLine2Highlight: string; body1: string; body2: string; cta: string };
  footer: { descr: string; explore: string; follow: string; copyright: string; tagline: string; sisterBrand: string; memberLogin: string };
  apply: {
    s1Eyebrow: string; s1Title: string; s1TitleHighlight: string; s1Lead: string;
    s1DirigeantTitleLine1: string; s1DirigeantTitleLine2: string; s1DirigeantDesc: string;
    s1AthleteTitleLine1: string; s1AthleteTitleLine2: string; s1AthleteDesc: string;
    s1Note: string;
    s2Eyebrow: string; s2TitleDirigeant: string; s2TitleAthlete: string; s2Lead: string;
    s2ProfileLabel: string; s2ChangeLink: string; s2SessionLabel: string; s2SessionHint: string;
    s2Firstname: string; s2Lastname: string; s2Company: string; s2Role: string; s2RoleHint: string;
    s2Itra: string; s2ItraHint: string; s2Utmb: string; s2UtmbHint: string;
    s2Email: string; s2Whatsapp: string; s2Linkedin: string; s2LinkedinOptional: string;
    s2Rgpd: string; s2Submit: string; s2Submitting: string;
    s3Title: string; s3Thanks: string; s3Ref: string;
    s3CtaHome: string; s3Contact: string;
    s3EmailCheck: string; s3LoginLink: string;
    s3EmailSentTo: string; s3ResendCta: string; s3ResendCooldown: string; s3ResendSent: string;
    s3ChangeEmailCta: string; s3ChangeEmailLabel: string; s3ChangeEmailSubmit: string;
    s3ChangeEmailError: string; s3ChangeEmailSuccess: string;
    s1CategoryLabelDirigeant: string; s1CategoryLabelAthlete: string; s1Continue: string;
    s2Title: string; s2ProfileValueDirigeant: string; s2ProfileValueAthlete: string;
    s2SessionNoTarget: string; s2ItraShortHint: string; s2UtmbShortHint: string; s2LinkedinHint: string;
    errorTitle: string; errorFooter: string; errorFooterEnd: string;
    errorFallback: string; errorUnknown: string;
    // Batch 3 — Form v2
    s2SelfDescLabelDirigeant: string; s2SelfDescLabelAthlete: string; s2SelfDescHint: string;
    s2SportLevelLabel: string; s2SportLevelHint: string;
    s2SportLevel1: string; s2SportLevel2: string; s2SportLevel3: string; s2SportLevel4: string; s2SportLevel5: string;
    s2MotivationLabel: string; s2MotivationHint: string;
    s2LookingForLabel: string; s2LookingForHint: string;
    s2CityLabel: string; s2CityOther: string; s2OtherCityLabel: string; s2CountryLabel: string; s2CountryHint: string;
    s2ProWebsiteLabel: string; s2ProWebsiteHint: string;
    s2StravaLabel: string; s2OtherLinkLabel: string; s2OtherLinkHint: string;
    s2SectionAbout: string; s2SectionSport: string; s2SectionMotivation: string;
    s2SectionLocation: string; s2SectionLinks: string; s2SectionContact: string;
  };
  confirmed: {
    title: string; titleHighlight: string; body: string;
    suite: string; step1: string; step2: string; step3: string;
    ctaProfile: string; ctaHome: string;
  };
  progress: {
    eyebrow: string; stepWord: string;
    step1Label: string; step2Label: string; step3Label: string;
  };
  login: {
    title: string; lead: string; emailLabel: string; submit: string; submitting: string;
    checkTitle: string; checkBody: string; errorExpired: string; backHome: string;
    otpLead: string; otpSubmit: string; otpSubmitting: string; otpSentHint: string;
    otpVerify: string; otpVerifying: string; otpErrorInvalid: string; otpHintManyTries: string;
    otpResend: string; otpResendIn: string; otpChangeEmail: string;
    switchToLink: string; switchToOtp: string; forgotEmailHint: string;
  };
  profile: {
    title: string; lead: string; selfDescLabel: string; pictureLabel: string;
    saveLabel: string; savingLabel: string; savedMessage: string; logoutLabel: string;
    loadErrorMessage: string; notLoggedInMessage: string; languageLabel: string;
    completionLabel: string; nameLabel: string;
  };
  card: {
    sectionLabel: string; generateLabel: string; generatingLabel: string;
    generateErrorMessage: string; bioFieldLabel: string; lookingForFieldLabel: string;
    consentLabel: string; submitLabel: string; submittingLabel: string; submitErrorMessage: string;
    submittedMessage: string; needsGenerationMessage: string;
    downloadLabel: string; downloadingLabel: string; validatedMessage: string;
    suspendLabel: string; suspendingLabel: string; suspendConfirm: string; suspendErrorMessage: string;
    suspendedMessage: string; reactivateLabel: string; reactivatingLabel: string;
    reactivateErrorMessage: string;
    previewTitle: string; previewIncomplete: string; previewCta: string;
    unsavedChanges: string; downloadRequiresValidation: string;
  };
  directory: {
    title: string;
    teaserLoggedOut: { body: string };
    teaserAlumni: { body: string };
    teaserMembershipRequired: { body: string };
    ctaLogin: string;
    ctaApply: string;
    ctaBackToDirectory: string;
    ctaGoToRefuge: string;
  };
  refuge: {
    lead: string;
    noCardYet: string;
    goToProfile: string;
    goToDirectory: string;
    goToAlumniDirectory: string;
    membershipRequiredNote: string;
  };
};

export const dictionary: Record<Locale, Dict> = {
  fr: {
    meta: {
      titleHome: 'TRLBLZR.RUN — Trace ton sentier',
      titleApply: 'Postuler — TRLBLZR.RUN',
      desc: "Du trail running en montagne pour dirigeants, avec des athlètes professionnels. On ne pitche pas — on s'aligne.",
    },
    nav: { sessions: 'Sessions', athletes: 'Athlètes', club: 'Le Club' },
    header: { sublogo: 'TRACE TON SENTIER' },
    common: { apply: 'Postuler', back: '← Retour' },
    hero: {
      tag: 'TRLBLZR // 0001',
      label: 'Trace ton sentier',
      titleLine1: 'Entre dans',
      titleLine2: "l'extraordinaire.",
      lead: "Du Trail Running en montagne pour dirigeants de tous les niveaux, avec des athlètes de trail professionnels. On ne pitche pas — on s'aligne. Le mouvement fait le reste.",
      poweredBy: 'Join TRLBLZR.run powered by',
      ctaPrimary: 'Postuler',
      ctaSecondary: 'Voir les sessions →',
      session: 'Session // 0002 — Vercors · Août 2025',
      scroll: '↓ Scroll',
    },
    manifesto: {
      label: 'Manifesto',
      titleA: 'Résilience',
      titleB: 'Vitesse',
      body: 'On ne vient pas chercher un chrono. On vient apprendre à durer.',
    },
    sections: {
      nextIndex: '01 / 04 — À VENIR',
      nextHeading: 'Prochaines sessions',
      nextLink: 'Toutes les expériences →',
      pastIndex: '02 / 04 — ÉDITIONS PASSÉES',
      pastHeading: "Ce qu'ils en disent",
      athletesIndex: '03 / 04 — ATHLÈTES',
      athletesHeading: 'Les pros qui nous accompagnent',
      clubIndex: '04 / 04 — LE CLUB',
      clubHeading: 'La communauté',
    },
    sessions: {
      // Saison automne 2026
      octDate: '2 — 4 octobre 2026',
      octPlace: 'France',
      octTheme: 'TRLBLZR WE',
      octBody: "L'automne pour clarifier tes priorités avant le dernier trimestre. Trois jours pour transformer ton élan en progression durable, sur les sentiers comme dans le business. Recul, terrain, intention.",
      grandCanyonDate: '8 — 11 octobre 2026',
      grandCanyonPlace: 'Grand Canyon, États-Unis',
      grandCanyonTheme: 'RIM to RIM to RIM',
      grandCanyonBody: "67 km de légende au cœur du Grand Canyon. Des milliers de mètres de dénivelé, des paysages à couper le souffle. Trois jours pour sortir du cadre et repousser tes limites avec d'autres entrepreneurs.",
      marocDate: '6 — 8 novembre 2026',
      marocPlace: 'France',
      marocTheme: 'TRLBLZR WE',
      marocBody: "Trois jours pour clôturer la saison fort. Un corps durable, des sentiers d'automne, des échanges profonds. Tes prochains défis se préparent ici, sur les sentiers comme dans tes projets.",
      novDate: '20 — 22 novembre 2026',
      novPlace: 'France',
      novTheme: 'TRLBLZR WE',
      novBody: "Le dernier week-end de la saison, encore à écrire. Nouveau territoire, nouveau thème, même ambition : le trail pour progresser et créer des connexions fortes. Détails bientôt.",
      applyShort: 'Postuler',
    },
    past: {
      e0001Meta: 'Avril 2025',
      e0001TitleLine1: 'Annecy',
      e0001TitleLine2: '— Aravis',
      e0001Body: "Premier week-end dans les Aravis. Une dizaine de fondateurs, une championne du monde de trail, et la confirmation qu'on tenait quelque chose.",
      e0002Meta: 'Août 2025',
      e0002TitleLine1: 'Vercors',
      e0002TitleLine2: '— Hauts Plateaux',
      e0002Body: "Une édition fondatrice. Plateaux du Vercors, dénivelé long, soirées sans téléphone, débats jusque tard. C'est de là que vient TRLBLZR.",
      e0003Meta: 'Mars 2026',
      e0003TitleLine1: 'Vercors',
      e0003TitleLine2: '— Hiver',
      e0003Body: "Édition hivernale sur les sentiers du Vercors. Rythme soutenu, conditions exigeantes, ascension partagée. Le froid trie ce qui compte.",
      e0004Meta: 'Avril 2026',
      e0004TitleLine1: 'Annecy',
      e0004TitleLine2: '— Printemps',
      e0004Body: "Retour dans les Aravis au sortir de l'hiver. Le printemps en montagne, des dénivelés francs, et la même règle : on court, on échange, on dort tôt.",
      playHint: '▶ Survoler pour lire',
      testimonialsLabel: '— Témoignages',
    },
    testimonials: {
      intro: "Trois jours en montagne — et c'est souvent une décision business qui se débloque, un partenariat qui se noue, un cap stratégique qui se clarifie. Co-développement entre pairs, masterclasses d'élites du trail, conversations qui sortent du cadre habituel. La preuve par celles et ceux qui sont venus.",
      aurore: "Le motto du week-end est vite posé : on n'est pas là pour se comparer, mais pour définir son propre objectif et l'atteindre. Un très bon dosage de sport, de discussions informelles et de moments collectifs.",
      jonathan: "Une superbe expérience. J'ai apprécié la disponibilité et le partage des athlètes. Hâte de revenir pour les prochains.",
      florian: "Je suis revenu avec une énergie que je n'avais pas eue depuis des semaines. J'en suis sorti avec un plan clair : business, nutrition au quotidien et en compétition, et ce que je veux affiner dans mes triathlons.",
      antoine: "Un format aussi unique qu'intense : des kilomètres, du D+, des échanges profonds, des soins, et une énergie collective dingue. C'est rare de pouvoir se livrer sans filtre, entouré de gens qui partagent la même flamme pour le sport et l'entrepreneuriat.",
      louis: "Un week-end unique : des kilomètres, du D+, et une énergie collective de dingue. C'est rare de pouvoir échanger avec des gens qui vivent les mêmes galères et la même passion du dépassement.",
      alexandre: "Un week-end inspirant à Annecy mêlant sports d'endurance et connexions humaines profondes. Au-delà du défi physique, une vraie réflexion sur ce qu'est la performance — pas se comparer aux autres, mais pousser ses propres limites et se montrer pleinement.",
      alice: "Dans ces moments-là, quelque chose se passe. On tombe les masques, on sort des titres, des fonctions, des attentes. Et on revient à quelque chose de plus simple : le mouvement, l'effort, le collectif.",
      jeremie: "Fabuleux week-end, très enrichissant à la fois sur la performance sportive que sur la réflexion autour de ma startup, grâce aux co-dev. Ça a dépassé largement mes attentes.",
      sergio: "Une superbe et surprenante intersection entre performance sportive et professionnelle. Des séances co-dev franches et bienveillantes qui apportent de la clarté sur comment avancer. Un vrai boost pour les jambes et le cerveau.",
      fabrice: "C'est un super cadre pour connecter avec d'autres entrepreneurs. Les moments d'effort intense en pleine nature facilitent des discussions qu'on n'aurait pas eues sinon. Je repars plein d'énergie !",
    },
    athletes: {
      roleUltra: 'Ultra-Traileur · Co-fondateur Trail Running Lab',
      roleTrail: 'Athlète trail',
    },
    club: {
      statLabel: 'Coureurs · Entrepreneurs',
      tagline: 'Plus de 250 entrepreneurs et investisseurs qui courent ensemble — sans petits fours, sans slides, en vrai.',
      item1: 'Social Runs hebdomadaires à Paris et Lyon, en vrai.',
      item2: "Communauté WhatsApp + LinkedIn pour partager training, retours d'expérience et actus Trail × Leadership.",
      item3: 'Accès prioritaire aux informations et opportunités.',
      cta: 'Rejoindre le club',
      ctaApply: 'Postuler',
      ctaNetwork: 'Rejoins le réseau',
    },
    final: {
      eyebrow: 'Aller plus loin',
      titleLine1: 'Rejoins',
      titleLine2Pre: 'le ',
      titleLine2Highlight: 'sentier.',
      body1: "S'abonner ou postule directement pour une session.",
      body2: "Un appel découverte de 30 minutes pour vérifier que c'est aligné — pour toi comme pour nous.",
      cta: 'Postuler',
    },
    footer: {
      descr: "Trail running en montagne pour dirigeants. On ne pitche pas — on s'aligne. Le mouvement fait le reste.",
      explore: 'Explorer',
      follow: 'Suivre',
      copyright: '© 2026 TRLBLZR · Tous droits réservés',
      tagline: 'Courir — Échanger — Se perfectionner — Recommencer',
      sisterBrand: 'Pitch in Motion',
      memberLogin: 'Déjà membre ? Se connecter',
    },
    apply: {
      s1Eyebrow: 'Postuler / Étape 1 sur 3',
      s1Title: 'Rejoindre',
      s1TitleHighlight: 'le club.',
      s1Lead: "Quelques minutes pour qu'on apprenne à se connaître. Sélectionne d'abord ton profil — les informations qu'on te demandera ensuite dépendent de ce choix.",
      s1DirigeantTitleLine1: 'Dirigeant',
      s1DirigeantTitleLine2: 'Entrepreneur',
      s1DirigeantDesc: 'Business leader, entrepreneur, investisseur ou executive. Tu veux rejoindre la communauté et participer à une session — quel que soit ton niveau de trail.',
      s1AthleteTitleLine1: 'Athlète',
      s1AthleteTitleLine2: 'Pro / Élite',
      s1AthleteDesc: 'Trail running athlete, élite ou pro runner. Tu peux nous rejoindre pour partager ton expérience, encadrer les sessions et bénéficier de la communauté.',
      s1Note: 'Sessions traitées sous 48–72 h. Si éligible, tu recevras un lien pour réserver un appel découverte de 30 min avec Etienne.',
      s2Eyebrow: 'Postuler / Étape 2 sur 3',
      s2TitleDirigeant: 'Profil dirigeant.',
      s2TitleAthlete: 'Profil athlète.',
      s2Lead: "Tout ce qu'il nous faut pour évaluer ta candidature. WhatsApp est notre canal principal de communication pour les sessions.",
      s2ProfileLabel: 'Profil sélectionné',
      s2ChangeLink: 'Changer →',
      s2SessionLabel: 'Sessions qui t\'intéressent',
      s2SessionHint: 'plusieurs choix possibles',
      s2Firstname: 'Prénom', s2Lastname: 'Nom', s2Company: 'Société',
      s2Role: 'Poste / Titre', s2RoleHint: 'ex. CEO, Fondatrice, VP Sales',
      s2Itra: 'Index ITRA', s2ItraHint: 'Index ITRA (ou laisse vide si pas applicable)',
      s2Utmb: 'Index UTMB', s2UtmbHint: 'Index UTMB (ou laisse vide)',
      s2Email: 'Email', s2Whatsapp: 'WhatsApp', s2Linkedin: 'LinkedIn',
      s2LinkedinOptional: '(optionnel)',
      s2Rgpd: "J'accepte que mes informations soient utilisées par TRLBLZR.RUN pour traiter ma candidature et me recontacter. Conformément au RGPD, je peux à tout moment demander la suppression de mes données en écrivant à etienne@bourdon.com.",
      s2Submit: 'Soumettre ma candidature',
      s2Submitting: 'Envoi en cours…',
      s3Title: 'Candidature',
      s3Thanks: "Dernière étape : ouvre l'email qu'on vient de t'envoyer et clique sur le bouton pour finaliser ta candidature.",
      s3Ref: 'Référence —',
      s3CtaHome: "Retour à l'accueil",
      s3Contact: 'Une question urgente ? Écris-moi à',
      s3EmailCheck: 'Vérifie ta boîte mail (et les spams).',
      s3LoginLink: "Je n'ai pas accès à cet email — se connecter →",
      s3EmailSentTo: 'Email envoyé à :',
      s3ResendCta: "Renvoyer l'email",
      s3ResendCooldown: 'Tu peux renvoyer un email toutes les 60 secondes.',
      s3ResendSent: 'Email renvoyé.',
      s3ChangeEmailCta: "Changer d'email",
      s3ChangeEmailLabel: 'Nouvelle adresse email',
      s3ChangeEmailSubmit: 'Valider',
      s3ChangeEmailError: 'Cette adresse ne peut pas être utilisée. Réessaie.',
      s3ChangeEmailSuccess: 'Email mis à jour — vérifie ta nouvelle boîte mail.',
      s1CategoryLabelDirigeant: '01 — DIRIGEANT',
      s1CategoryLabelAthlete: '02 — ATHLÈTE',
      s1Continue: 'CONTINUER',
      s2Title: 'Quelques infos.',
      s2ProfileValueDirigeant: 'Dirigeant · Entrepreneur',
      s2ProfileValueAthlete: 'Athlète · Pro / Élite',
      s2SessionNoTarget: '— Sans session ciblée —',
      s2ItraShortHint: 'ou laisse vide si pas applicable',
      s2UtmbShortHint: 'ou laisse vide',
      s2LinkedinHint: 'optionnel',
      errorTitle: 'Une erreur est survenue',
      errorFooter: 'Si le problème persiste, écris à',
      errorFooterEnd: 'en mentionnant le message ci-dessus.',
      errorFallback: "Une erreur est survenue. Réessaie ou écris à etienne@bourdon.com.",
      errorUnknown: 'Erreur inconnue',
      // Batch 3 — Form v2
      s2SelfDescLabelDirigeant: 'Décris-toi en tant que dirigeant',
      s2SelfDescLabelAthlete: 'Décris-toi en tant qu\'athlète',
      s2SelfDescHint: 'Ton rôle, ta boîte, ce qui te fait avancer (1-3 phrases)',
      s2SportLevelLabel: 'Niveau sportif',
      s2SportLevelHint: 'Où te situes-tu sur le spectrum trail ?',
      s2SportLevel1: '1 · Jog occasionnel (5-10 km, route ou parc)',
      s2SportLevel2: '2 · Coureur régulier (10-20 km, quelques trails)',
      s2SportLevel3: '3 · Traileur (20-50 km, avec quelques courses)',
      s2SportLevel4: '4 · Long trail (50-100 km, ultra distances)',
      s2SportLevel5: '5 · Ultra élite (>100 km)',
      s2MotivationLabel: 'Pourquoi rejoindre TRLBLZR ?',
      s2MotivationHint: '2-3 phrases sur ce qui t\'attire ici',
      s2LookingForLabel: 'Que cherches-tu dans cette communauté ?',
      s2LookingForHint: '2-3 phrases sur les connexions et expériences que tu recherches',
      s2CityLabel: 'Ville',
      s2CityOther: 'Autre',
      s2OtherCityLabel: 'Quelle ville ?',
      s2CountryLabel: 'Pays',
      s2CountryHint: 'Optionnel',
      s2ProWebsiteLabel: 'Site pro',
      s2ProWebsiteHint: 'Entreprise, portfolio, site perso',
      s2StravaLabel: 'Profil Strava',
      s2OtherLinkLabel: 'Autre lien',
      s2OtherLinkHint: 'Blog, Instagram, etc.',
      s2SectionAbout: 'À propos de toi',
      s2SectionSport: 'Niveau trail',
      s2SectionMotivation: 'Motivation',
      s2SectionLocation: 'Localisation',
      s2SectionLinks: 'Liens (optionnels)',
      s2SectionContact: 'Contact',
    },
    confirmed: {
      title: 'Candidature',
      titleHighlight: 'finalisée.',
      body: 'Ton email est confirmé. Ta candidature est bien enregistrée.',
      suite: 'Voici la suite',
      step1: "Revue de ta candidature (48–72 h). On évalue le profil et l'alignement avec les sessions à venir.",
      step2: "Réponse par email. Si éligible, tu recevras un lien direct pour réserver un appel découverte de 30 min avec Etienne, qui finalise l'inscription.",
      step3: "Sinon, on t'écrit aussi. Si la session ciblée est complète ou si le timing n'est pas le bon, on revient vers toi dès qu'une fenêtre se libère.",
      ctaProfile: 'Compléter ma carte',
      ctaHome: "Retour à l'accueil",
    },
    progress: {
      eyebrow: 'Candidature',
      stepWord: 'Étape',
      step1Label: 'Formulaire ok',
      step2Label: 'Confirme ton email',
      step3Label: 'Complète ton profil',
    },
    login: {
      title: 'Connexion.',
      lead: "Entre l'email de ta candidature — on t'envoie un lien pour te reconnecter, sans mot de passe.",
      emailLabel: 'Email',
      submit: 'Recevoir mon lien',
      submitting: 'Envoi en cours…',
      checkTitle: 'Vérifie ta boîte mail.',
      checkBody: "Si cet email correspond à une candidature, un lien de connexion vient d'être envoyé. Il expire dans 20 minutes.",
      errorExpired: 'Ce lien a expiré ou est invalide. Demandes-en un nouveau ci-dessous.',
      backHome: "Retour à l'accueil",
      otpLead: "Entre l'email de ta candidature — on t'envoie un code à 6 chiffres, valable 10 minutes.",
      otpSubmit: 'Recevoir mon code',
      otpSubmitting: 'Envoi du code…',
      otpSentHint: 'Code envoyé par email. Vérifie ta boîte mail (et les spams).',
      otpVerify: 'Valider',
      otpVerifying: 'Vérification…',
      otpErrorInvalid: 'Code invalide ou expiré. Demande-en un nouveau.',
      otpHintManyTries: 'Plusieurs essais infructueux ? Demande un nouveau code plutôt que de continuer à deviner.',
      otpResend: 'Renvoyer le code',
      otpResendIn: 'Renvoyer dans',
      otpChangeEmail: "Changer d'email",
      switchToLink: 'Tu préfères un lien de connexion ? →',
      switchToOtp: 'Tu préfères un code ? →',
      forgotEmailHint: 'Tu ne sais plus quel email tu as utilisé pour postuler ? Écris-nous à',
    },
    profile: {
      title: 'Ton profil.',
      lead: 'Mets à jour tes informations à tout moment.',
      selfDescLabel: 'Décris-toi',
      pictureLabel: 'Photo (URL)',
      saveLabel: 'Enregistrer',
      savingLabel: 'Enregistrement…',
      savedMessage: 'Profil mis à jour.',
      logoutLabel: 'Se déconnecter',
      loadErrorMessage: 'Impossible de charger ton profil. Réessaie ou reconnecte-toi.',
      notLoggedInMessage: 'Tu dois te connecter pour voir cette page.',
      languageLabel: 'Langue préférée (emails et messages)',
      completionLabel: 'Profil complété',
      nameLabel: 'Nom complet',
    },
    card: {
      sectionLabel: 'Ta Member Card',
      generateLabel: 'Générer ma card',
      generatingLabel: 'Génération…',
      generateErrorMessage: "Échec de la génération. Réessaie dans un instant.",
      bioFieldLabel: 'Bio (modifiable)',
      lookingForFieldLabel: 'Recherche (modifiable)',
      consentLabel: "J'accepte que ma Member Card soit visible publiquement dans la communauté TRLBLZR.",
      submitLabel: 'Confirmer ma Card',
      submittingLabel: 'Envoi…',
      submitErrorMessage: "Échec de l'envoi. Réessaie dans un instant.",
      submittedMessage: 'Card envoyée — en attente de validation.',
      needsGenerationMessage: "Génère ta card avant de l'envoyer.",
      downloadLabel: 'Télécharger ma card',
      downloadingLabel: 'Téléchargement…',
      validatedMessage: 'Card validée — prête à être partagée sur WhatsApp par l\'équipe TRLBLZR.',
      suspendLabel: 'Retirer ma card',
      suspendingLabel: 'Retrait…',
      suspendConfirm: 'Retirer ta Member Card ? Elle ne sera plus partagée. Tu pourras la réactiver pendant 90 jours.',
      suspendErrorMessage: 'Échec du retrait. Réessaie dans un instant.',
      suspendedMessage: "Card retirée. Réactivable jusqu'au {date}, après quoi elle sera supprimée définitivement.",
      reactivateLabel: 'Réactiver ma card',
      reactivatingLabel: 'Réactivation…',
      reactivateErrorMessage: 'Échec de la réactivation. Réessaie dans un instant.',
      previewTitle: 'Ta Member Card',
      previewIncomplete: "Ta carte n'est pas encore complète — complète ton profil pour la générer.",
      previewCta: 'Compléter ma carte →',
      unsavedChanges: 'Modifications non enregistrées — confirme ta card pour les appliquer.',
      downloadRequiresValidation: 'Disponible une fois ta card validée par TRLBLZR.',
    },
    directory: {
      title: 'Annuaire des membres',
      teaserLoggedOut: {
        body: "L'annuaire TRLBLZR — profils et cartes des membres validés. Connecte-toi pour y accéder.",
      },
      teaserAlumni: {
        body: 'Cette liste est réservée aux membres Alumni.',
      },
      teaserMembershipRequired: {
        body: "L'accès à cet annuaire nécessite une adhésion active. Rends-toi sur ton Refuge pour voir ton statut, ou écris-nous pour la renouveler.",
      },
      ctaLogin: 'Se connecter',
      ctaApply: 'Postuler',
      ctaBackToDirectory: "Voir l'annuaire",
      ctaGoToRefuge: 'Aller à mon Refuge',
    },
    refuge: {
      lead: 'Ton espace membre — retrouve ta card, ton profil et les annuaires accessibles.',
      noCardYet: "Tu n'as pas encore créé ta Member Card.",
      goToProfile: 'Mon profil',
      goToDirectory: "Annuaire des membres",
      goToAlumniDirectory: 'Annuaire Alumni',
      membershipRequiredNote:
        "L'accès aux annuaires nécessite une adhésion active. Écris-nous si tu penses que c'est une erreur.",
    },
  },
  en: {
    meta: {
      titleHome: 'TRLBLZR.RUN — Trail Running Business Club',
      titleApply: 'Apply — TRLBLZR.RUN',
      desc: "Mountain trail running for executives, alongside professional athletes. We don't pitch — we align. The movement does the rest.",
    },
    nav: { sessions: 'Sessions', athletes: 'Athletes', club: 'The Club' },
    header: { sublogo: 'BLAZE YOUR TRAIL' },
    common: { apply: 'Apply', back: '← Back' },
    hero: {
      tag: 'TRLBLZR // 0001',
      label: 'Trail Running Business Club',
      titleLine1: 'Step into',
      titleLine2: 'the extraordinary.',
      lead: "Mountain trail running for executives at every level, run alongside pro trail athletes. We don't pitch — we align. The movement does the rest.",
      poweredBy: 'Join TRLBLZR.run powered by',
      ctaPrimary: 'Apply',
      ctaSecondary: 'See the sessions →',
      session: 'Session // 0002 — Vercors · August 2025',
      scroll: '↓ Scroll',
    },
    manifesto: {
      label: 'Manifesto',
      titleA: 'Resilience',
      titleB: 'Speed',
      body: "We're not here to chase a time. We're here to learn how to last.",
    },
    sections: {
      nextIndex: '01 / 04 — NEXT',
      nextHeading: 'Upcoming sessions',
      nextLink: 'All experiences →',
      pastIndex: '02 / 04 — PAST EDITIONS',
      pastHeading: 'What they say',
      athletesIndex: '03 / 04 — ATHLETES',
      athletesHeading: 'The pros that join us',
      clubIndex: '04 / 04 — THE CLUB',
      clubHeading: 'The community',
    },
    sessions: {
      // Fall 2026 season
      octDate: 'October 2 — 4, 2026',
      octPlace: 'France',
      octTheme: 'TRLBLZR WE',
      octBody: "Autumn to clarify your priorities before the last quarter. Three days to turn momentum into sustainable progress, on the trails and in business. Perspective, terrain, intention.",
      grandCanyonDate: 'October 8 — 11, 2026',
      grandCanyonPlace: 'Grand Canyon, USA',
      grandCanyonTheme: 'RIM to RIM to RIM',
      grandCanyonBody: "67 km of legend through the Grand Canyon. Thousands of meters of elevation, breathtaking landscapes. Three days to step out of the frame and push your limits with fellow entrepreneurs.",
      marocDate: 'November 6 — 8, 2026',
      marocPlace: 'France',
      marocTheme: 'TRLBLZR WE',
      marocBody: "Three days to close the season strong. A durable body, autumn trails, deeper conversations. Your next challenges start here, on the trails and in your projects.",
      novDate: 'November 20 — 22, 2026',
      novPlace: 'France',
      novTheme: 'TRLBLZR WE',
      novBody: "The final weekend of the season, yet to be written. New territory, new theme, same ambition: trail running to progress and build strong connections. Details soon.",
      applyShort: 'Apply',
    },
    past: {
      e0001Meta: 'April 2025',
      e0001TitleLine1: 'Annecy',
      e0001TitleLine2: '— Aravis',
      e0001Body: 'First weekend in the Aravis. A dozen founders, a trail world champion, and confirmation that we had something.',
      e0002Meta: 'August 2025',
      e0002TitleLine1: 'Vercors',
      e0002TitleLine2: '— High Plateaus',
      e0002Body: 'A founding edition. Vercors plateaus, long elevation, phone-free evenings, debates late into the night. This is where TRLBLZR comes from.',
      e0003Meta: 'March 2026',
      e0003TitleLine1: 'Vercors',
      e0003TitleLine2: '— Winter',
      e0003Body: 'Winter edition on the Vercors trails. Sustained pace, demanding conditions, shared ascent. The cold filters what matters.',
      e0004Meta: 'April 2026',
      e0004TitleLine1: 'Annecy',
      e0004TitleLine2: '— Spring',
      e0004Body: "Back to the Aravis at winter's end. Spring in the mountains, honest elevation gains, and the same rule: we run, we talk, we sleep early.",
      playHint: '▶ Hover to play',
      testimonialsLabel: '— Testimonials',
    },
    testimonials: {
      intro: "Three days in the mountains — and often, a business decision gets unlocked, a partnership forms, a strategic direction sharpens. Peer co-development, masterclasses from trail elites, conversations that break the usual mold. The proof comes from those who came.",
      aurore: "The motto of the weekend was set early: we're not here to compare ourselves but to define our own goal and reach it. A great balance of sport, informal discussions and collective moments.",
      jonathan: "A great experience. I appreciated the athletes' availability and willingness to share. Can't wait for the next one.",
      florian: "I came back with an energy I hadn't had in weeks. I left with a clear plan: business, daily and race nutrition, and what I want to refine in my triathlons.",
      antoine: "A format as unique as it is intense: kilometers, vertical gain, deep exchanges, recovery, and an incredible collective energy. It's rare to open up without a filter, surrounded by people who share the same flame for sport and entrepreneurship.",
      louis: "A unique weekend: kilometers, vertical gain, and an incredible collective energy. It's rare to connect with people who live the same struggles and share the same passion for self-overcoming.",
      alexandre: "An inspiring weekend in Annecy blending endurance sports and deep human connections. Beyond the physical challenge, a real reflection on what performance truly means — not competing with others, but pushing your own limits and showing up fully.",
      alice: 'In those moments, something happens. The masks drop, we step out of titles, roles and expectations. And we return to something simpler: movement, effort, the collective.',
      jeremie: "A fabulous weekend, deeply enriching both for athletic performance and for thinking through my startup, thanks to the co-dev sessions. It far exceeded my expectations.",
      sergio: "A great and surprising intersection between athletic and professional performance. Frank and benevolent co-dev sessions that bring clarity on how to move forward. A real boost for both the legs and the brain.",
      fabrice: "A great setting to connect with other entrepreneurs. The moments of intense effort in nature unlock conversations we wouldn't have had otherwise. I leave full of energy!",
    },
    athletes: {
      roleUltra: 'Ultra-Trailer · Co-founder Trail Running Lab',
      roleTrail: 'Trail athlete',
    },
    club: {
      statLabel: 'Runners · Entrepreneurs',
      tagline: 'More than 250 entrepreneurs and investors running together — no canapés, no slides, the real thing.',
      item1: 'Weekly social runs in Paris and Lyon, in real life.',
      item2: 'WhatsApp + LinkedIn community to share training, experience, Trail × Leadership news.',
      item3: 'Priority access to news and opportunities.',
      cta: 'Join the club',
      ctaApply: 'Apply',
      ctaNetwork: 'Join the network',
    },
    final: {
      eyebrow: 'Go further',
      titleLine1: 'Join',
      titleLine2Pre: 'the ',
      titleLine2Highlight: 'trail.',
      body1: 'Subscribe, or apply directly to a session.',
      body2: "A 30-minute discovery call to check it's a fit — for you as much as for us.",
      cta: 'Apply',
    },
    footer: {
      descr: "Mountain trail running for executives. We don't pitch — we align. The movement does the rest.",
      explore: 'Explore',
      follow: 'Follow',
      copyright: '© 2026 TRLBLZR · All rights reserved',
      tagline: 'Run — Talk — Sharpen — Repeat',
      sisterBrand: 'Pitch in Motion',
      memberLogin: 'Already a member? Log in',
    },
    apply: {
      s1Eyebrow: 'Apply / Step 1 of 3',
      s1Title: 'Join',
      s1TitleHighlight: 'the club.',
      s1Lead: 'A few minutes to get to know each other. Pick your profile first — the questions we ask next depend on this choice.',
      s1DirigeantTitleLine1: 'Executive',
      s1DirigeantTitleLine2: 'Entrepreneur',
      s1DirigeantDesc: 'Business leader, entrepreneur, investor or executive. You want to join the community and take part in a session — whatever your trail level.',
      s1AthleteTitleLine1: 'Athlete',
      s1AthleteTitleLine2: 'Pro / Elite',
      s1AthleteDesc: 'Trail running athlete, elite runner or pro runner. Join us to share your experience, run the sessions and tap into the community.',
      s1Note: "Applications processed within 48–72 h. If eligible, you'll receive a link to book a 30-min discovery call with Etienne.",
      s2Eyebrow: 'Apply / Step 2 of 3',
      s2TitleDirigeant: 'Executive profile.',
      s2TitleAthlete: 'Athlete profile.',
      s2Lead: 'Everything we need to assess your application. WhatsApp is our main session communication channel.',
      s2ProfileLabel: 'Selected profile',
      s2ChangeLink: 'Change →',
      s2SessionLabel: 'Sessions you\'re interested in',
      s2SessionHint: 'multiple choices possible',
      s2Firstname: 'First name', s2Lastname: 'Last name', s2Company: 'Company',
      s2Role: 'Role / Title', s2RoleHint: 'e.g. CEO, Founder, VP Sales',
      s2Itra: 'ITRA index', s2ItraHint: 'ITRA index (or leave blank if not applicable)',
      s2Utmb: 'UTMB index', s2UtmbHint: 'UTMB index (or leave blank)',
      s2Email: 'Email', s2Whatsapp: 'WhatsApp', s2Linkedin: 'LinkedIn',
      s2LinkedinOptional: '(optional)',
      s2Rgpd: 'I agree that my information is used by TRLBLZR.RUN to process my application and contact me. Under GDPR, I can request deletion of my data at any time by writing to etienne@bourdon.com.',
      s2Submit: 'Submit my application',
      s2Submitting: 'Sending…',
      s3Title: 'Application',
      s3Thanks: 'Final step: open the email we just sent you and click the button to finish your application.',
      s3Ref: 'Reference —',
      s3CtaHome: 'Back to homepage',
      s3Contact: 'Urgent? Write to me at',
      s3EmailCheck: 'Check your inbox (and spam).',
      s3LoginLink: "I don't have access to this email — log in →",
      s3EmailSentTo: 'Email sent to:',
      s3ResendCta: 'Resend email',
      s3ResendCooldown: 'You can resend an email once every 60 seconds.',
      s3ResendSent: 'Email resent.',
      s3ChangeEmailCta: 'Change email',
      s3ChangeEmailLabel: 'New email address',
      s3ChangeEmailSubmit: 'Confirm',
      s3ChangeEmailError: "This address can't be used. Try another one.",
      s3ChangeEmailSuccess: 'Email updated — check your new inbox.',
      s1CategoryLabelDirigeant: '01 — LEADER',
      s1CategoryLabelAthlete: '02 — ATHLETE',
      s1Continue: 'CONTINUE',
      s2Title: 'A few details.',
      s2ProfileValueDirigeant: 'Leader · Entrepreneur',
      s2ProfileValueAthlete: 'Athlete · Pro / Elite',
      s2SessionNoTarget: '— No specific session —',
      s2ItraShortHint: 'or leave blank if not applicable',
      s2UtmbShortHint: 'or leave blank',
      s2LinkedinHint: 'optional',
      errorTitle: 'An error occurred',
      errorFooter: 'If the issue persists, write to',
      errorFooterEnd: 'and quote the message above.',
      errorFallback: 'An error occurred. Try again or write to etienne@bourdon.com.',
      errorUnknown: 'Unknown error',
      // Batch 3 — Form v2
      s2SelfDescLabelDirigeant: 'Describe yourself as a leader',
      s2SelfDescLabelAthlete: 'Describe yourself as an athlete',
      s2SelfDescHint: 'Your role, your company, what drives you (1-3 sentences)',
      s2SportLevelLabel: 'Sport level',
      s2SportLevelHint: 'Where do you fit on the trail spectrum?',
      s2SportLevel1: '1 · Occasional jog (5-10 km, road or park)',
      s2SportLevel2: '2 · Regular runner (10-20 km, some trails)',
      s2SportLevel3: '3 · Trail runner (20-50 km, some races)',
      s2SportLevel4: '4 · Long trail (50-100 km, ultra distances)',
      s2SportLevel5: '5 · Ultra elite (>100 km)',
      s2MotivationLabel: 'Why do you want to join TRLBLZR?',
      s2MotivationHint: '2-3 sentences on what draws you here',
      s2LookingForLabel: 'What are you looking for in this community?',
      s2LookingForHint: '2-3 sentences on the connections and experiences you seek',
      s2CityLabel: 'City',
      s2CityOther: 'Other',
      s2OtherCityLabel: 'Which city?',
      s2CountryLabel: 'Country',
      s2CountryHint: 'Optional',
      s2ProWebsiteLabel: 'Pro website',
      s2ProWebsiteHint: 'Company, portfolio, personal site',
      s2StravaLabel: 'Strava profile',
      s2OtherLinkLabel: 'Other link',
      s2OtherLinkHint: 'Blog, Instagram, etc.',
      s2SectionAbout: 'About you',
      s2SectionSport: 'Trail level',
      s2SectionMotivation: 'Motivation',
      s2SectionLocation: 'Location',
      s2SectionLinks: 'Links (optional)',
      s2SectionContact: 'Contact',
    },
    confirmed: {
      title: 'Application',
      titleHighlight: 'confirmed.',
      body: 'Your email is confirmed. Your application is submitted.',
      suite: "Here's what happens next",
      step1: 'Application review (48–72 h). We assess the profile and the fit with upcoming sessions.',
      step2: "Email response. If eligible, you'll get a direct link to book a 30-min discovery call with Etienne, who finalizes your registration.",
      step3: "If not, we still write back. If the targeted session is full or the timing is off, we'll come back as soon as a window opens.",
      ctaProfile: 'Complete my card',
      ctaHome: 'Back to homepage',
    },
    progress: {
      eyebrow: 'Application',
      stepWord: 'Step',
      step1Label: 'Form done',
      step2Label: 'Confirm your email',
      step3Label: 'Complete your profile',
    },
    login: {
      title: 'Log in.',
      lead: "Enter the email from your application — we'll send you a link to log back in, no password needed.",
      emailLabel: 'Email',
      submit: 'Send my link',
      submitting: 'Sending…',
      checkTitle: 'Check your inbox.',
      checkBody: "If that email matches an application, a login link was just sent. It expires in 20 minutes.",
      errorExpired: 'That link has expired or is invalid. Request a new one below.',
      backHome: 'Back to homepage',
      otpLead: "Enter the email from your application — we'll send you a 6-digit code, valid for 10 minutes.",
      otpSubmit: 'Send my code',
      otpSubmitting: 'Sending code…',
      otpSentHint: 'Code sent by email. Check your inbox (and spam).',
      otpVerify: 'Verify',
      otpVerifying: 'Verifying…',
      otpErrorInvalid: 'Invalid or expired code. Request a new one.',
      otpHintManyTries: "A few failed tries? Request a new code instead of guessing.",
      otpResend: 'Resend code',
      otpResendIn: 'Resend in',
      otpChangeEmail: 'Change email',
      switchToLink: 'Prefer a login link instead? →',
      switchToOtp: 'Prefer a code instead? →',
      forgotEmailHint: "Not sure which email you applied with? Write to us at",
    },
    profile: {
      title: 'Your profile.',
      lead: 'Update your details anytime.',
      selfDescLabel: 'Describe yourself',
      pictureLabel: 'Photo (URL)',
      saveLabel: 'Save',
      savingLabel: 'Saving…',
      savedMessage: 'Profile updated.',
      logoutLabel: 'Log out',
      loadErrorMessage: "Couldn't load your profile. Try again or log back in.",
      notLoggedInMessage: 'You need to log in to see this page.',
      languageLabel: 'Preferred language (emails and messages)',
      completionLabel: 'Profile completeness',
      nameLabel: 'Full name',
    },
    card: {
      sectionLabel: 'Your Member Card',
      generateLabel: 'Generate my card',
      generatingLabel: 'Generating…',
      generateErrorMessage: 'Generation failed. Try again in a moment.',
      bioFieldLabel: 'Bio (editable)',
      lookingForFieldLabel: 'Looking for (editable)',
      consentLabel: 'I agree that my Member Card is visible publicly in the TRLBLZR community.',
      submitLabel: 'Confirm my card',
      submittingLabel: 'Submitting…',
      submitErrorMessage: 'Submission failed. Try again in a moment.',
      submittedMessage: 'Card submitted — awaiting review.',
      needsGenerationMessage: 'Generate your card before submitting it.',
      downloadLabel: 'Download my card',
      downloadingLabel: 'Downloading…',
      validatedMessage: 'Card validated — ready to be shared on WhatsApp by the TRLBLZR team.',
      suspendLabel: 'Remove my card',
      suspendingLabel: 'Removing…',
      suspendConfirm: 'Remove your Member Card? It will no longer be shared. You can reactivate it for 90 days.',
      suspendErrorMessage: 'Removal failed. Try again in a moment.',
      suspendedMessage: 'Card removed. Reactivate it until {date}, after which it will be permanently deleted.',
      reactivateLabel: 'Reactivate my card',
      reactivatingLabel: 'Reactivating…',
      reactivateErrorMessage: 'Reactivation failed. Try again in a moment.',
      previewTitle: 'Your Member Card',
      previewIncomplete: "Your card isn't complete yet — finish your profile to generate it.",
      previewCta: 'Complete my card →',
      unsavedChanges: 'Unsaved changes — confirm your card to apply them.',
      downloadRequiresValidation: 'Available once your card is validated by TRLBLZR.',
    },
    directory: {
      title: 'Member directory',
      teaserLoggedOut: {
        body: "The TRLBLZR member directory — validated members' profiles and cards. Log in to access it.",
      },
      teaserAlumni: {
        body: 'This list is reserved for Alumni members.',
      },
      teaserMembershipRequired: {
        body: 'Accessing this directory requires an active membership. Go to your Refuge to see your status, or write to us to renew.',
      },
      ctaLogin: 'Log in',
      ctaApply: 'Apply for membership',
      ctaBackToDirectory: 'View the directory',
      ctaGoToRefuge: 'Go to my Refuge',
    },
    refuge: {
      lead: 'Your member space — your card, your profile, and the directories you can access.',
      noCardYet: "You haven't created your Member Card yet.",
      goToProfile: 'My profile',
      goToDirectory: 'Member directory',
      goToAlumniDirectory: 'Alumni directory',
      membershipRequiredNote:
        'Directory access requires an active membership. Write to us if you think this is a mistake.',
    },
  },
};

export function pimUrl(
  path: string,
  locale: Locale,
  utm: { source: string; medium: string; campaign: string },
): string {
  const url = new URL(`https://pitchinmotion.com${path.startsWith('#') ? '/' : ''}${path}`);
  url.searchParams.set('utm_source', utm.source);
  url.searchParams.set('utm_medium', utm.medium);
  url.searchParams.set('utm_campaign', utm.campaign);
  url.searchParams.set('lang', locale);
  return url.toString();
}
