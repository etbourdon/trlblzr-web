// Section finale TRLBLZR — pas de newsletter / email, 2 portes d'entrée directes :
// (1) Discovery call Cal.com 30 min  (2) Apply formulaire (qui pousse dans Notion via /api/qualify en sprint suivant)

export default function Newsletter() {
  return (
    <section
      id="apply"
      className="px-6 md:px-10 py-24 md:py-32 border-t border-stone bg-trail-black"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-8">
          GO FURTHER
        </p>
        <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-tight text-paper-white">
          Rejoins le sentier.
        </h2>
        <p className="mt-6 font-sans text-base md:text-lg text-ash max-w-2xl mx-auto leading-relaxed">
          Tu peux postuler directement pour une session, ou prendre un{' '}
          <span className="text-paper-white">appel découverte de 30 minutes</span>{' '}
          pour valider que c&apos;est aligné — pour toi comme pour nous.
        </p>

        {/* 2 CTAs côte à côte */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href="https://cal.com/bourdon/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-stone hover:bg-paper-white border border-stone hover:border-paper-white transition-colors p-6 md:p-8 flex flex-col items-start text-left"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] text-ember mb-3">
              DISCOVERY CALL
            </p>
            <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-paper-white group-hover:text-trail-black transition-colors">
              30 min en visio.
            </h3>
            <p className="mt-2 font-sans text-sm text-ash group-hover:text-trail-black/70 transition-colors">
              Comprendre TRLBLZR, voir si tu cherches ce qu&apos;on propose, sans engagement.
            </p>
            <span className="mt-6 font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors">
              RÉSERVER ↗
            </span>
          </a>

          <a
            href="/apply"
            className="group bg-ember hover:bg-paper-white transition-colors p-6 md:p-8 flex flex-col items-start text-left"
          >
            <p className="font-mono text-[10px] tracking-[0.25em] text-trail-black mb-3">
              APPLY
            </p>
            <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-trail-black">
              Postule pour une session.
            </h3>
            <p className="mt-2 font-sans text-sm text-trail-black/80">
              Formulaire de candidature qualifié. Sélection sur dossier, places limitées.
            </p>
            <span className="mt-6 font-mono text-[11px] tracking-[0.2em] text-trail-black">
              POSTULER ↗
            </span>
          </a>
        </div>

        <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-ash">
          OU PAR EMAIL DIRECT →{' '}
          <a
            href="mailto:etienne@bourdon.com"
            className="text-paper-white hover:text-ember transition-colors"
          >
            ETIENNE@BOURDON.COM
          </a>
        </p>
      </div>
    </section>
  );
}
