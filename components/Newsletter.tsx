export default function Newsletter() {
  return (
    <section
      id="apply"
      className="px-6 md:px-10 py-24 md:py-32 border-t border-stone bg-trail-black"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-8">
          GO FURTHER
        </p>
        <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-tight text-paper-white">
          Reste sur le sentier.
        </h2>
        <p className="mt-6 font-sans text-base md:text-lg text-ash max-w-xl mx-auto">
          Prochaines sessions, lectures de sentier, et accès prioritaire en avant-première.
          Pas de mailing-list de masse, promis.
        </p>

        <form
          className="mt-12 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto"
          aria-label="Inscription newsletter"
        >
          <input
            type="email"
            required
            placeholder="ton@email.com"
            className="flex-1 bg-transparent border border-paper-white/20 text-paper-white placeholder:text-ash px-5 py-3 font-mono text-sm rounded-full focus:outline-none focus:border-ember transition-colors"
          />
          <button
            type="submit"
            className="font-mono text-[11px] tracking-[0.2em] bg-ember text-trail-black px-6 py-3 rounded-full hover:bg-paper-white transition-colors"
          >
            S&apos;ABONNER ↗
          </button>
        </form>

        <p className="mt-8 font-mono text-[10px] tracking-[0.2em] text-ash">
          OU POSTULE DIRECTEMENT POUR UNE SESSION →{' '}
          <a href="mailto:etienne@bourdon.com" className="text-paper-white hover:text-ember transition-colors">
            ETIENNE@BOURDON.COM
          </a>
        </p>
      </div>
    </section>
  );
}
