import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Mentions légales — TRLBLZR.run',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight text-paper-white mt-12 mb-4">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-sm md:text-base text-ash leading-relaxed mb-4">{children}</p>
  );
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="bg-trail-black text-paper-white px-6 md:px-10 pt-32 md:pt-40 pb-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight uppercase text-paper-white">
            Mentions légales
          </h1>
          <p className="font-mono text-xs tracking-[0.15em] text-dust mt-3 mb-4">
            Pitch in Motion &amp; TRLBLZR.run
          </p>

          <H2>Éditeur des sites</H2>
          <P>
            BRDN.PRO, société par actions simplifiée unipersonnelle (SASU)
            <br />
            Capital social : 2 500 €
            <br />
            Siège social : 65 rue de Créqui, 69006 Lyon, France
            <br />
            SIREN : 837 661 206 — SIRET : 837 661 206 00016
            <br />
            RCS Lyon 837 661 206
            <br />
            N° de TVA intracommunautaire : FR71 837661206
          </P>
          <P>BRDN.PRO édite et exploite les sites pitchinmotion.com et trlblzr.run.</P>
          <P>
            Directeur de la publication : Étienne Bourdon
            <br />
            Contact : contact@brdn.pro
          </P>

          <H2>Hébergement</H2>
          <P>
            trlblzr.run et pitchinmotion.com sont hébergés par :
            <br />
            Vercel Inc.
            <br />
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
          </P>

          <H2>Propriété intellectuelle</H2>
          <P>
            L&rsquo;ensemble des contenus présents sur les sites pitchinmotion.com et TRLBLZR.run
            (textes, visuels, logo, charte graphique) est la propriété de BRDN.PRO sauf mention
            contraire, et ne peut être reproduit, représenté, modifié ou diffusé sans autorisation
            préalable.
          </P>

          <H2>Données personnelles</H2>
          <P>
            Le traitement de vos données personnelles est détaillé dans notre{' '}
            <Link href="/privacy" className="text-ember hover:underline">
              politique de confidentialité
            </Link>{' '}
            commune aux deux sites.
          </P>

          <H2>Cookies</H2>
          <P>
            L&rsquo;utilisation de cookies par ces sites est détaillée dans la section dédiée de
            notre{' '}
            <Link href="/privacy#cookies" className="text-ember hover:underline">
              politique de confidentialité
            </Link>
            .
          </P>

          <H2>Contact</H2>
          <P>
            Pour toute question relative à trlblzr.run : contact@trlblzr.run
            <br />
            Pour toute question relative à pitchinmotion.com : contact@pitchinmotion.com
          </P>
        </div>
      </main>
      <Footer />
    </>
  );
}
