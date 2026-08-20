import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — TRLBLZR.run',
};

function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-display font-bold text-xl md:text-2xl tracking-tight text-paper-white mt-12 mb-4 scroll-mt-28"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-sm md:text-base text-ash leading-relaxed mb-4">{children}</p>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc pl-5 space-y-2 font-sans text-sm md:text-base text-ash leading-relaxed mb-4">
      {children}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-trail-black text-paper-white px-6 md:px-10 pt-32 md:pt-40 pb-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight uppercase text-paper-white">
            Politique de confidentialité
          </h1>
          <p className="font-mono text-xs tracking-[0.15em] text-dust mt-3 mb-4">
            Pitch in Motion &amp; TRLBLZR.run — dernière mise à jour : 20 août 2026
          </p>

          <H2>1. Qui est responsable de vos données ?</H2>
          <P>
            BRDN.PRO, société par actions simplifiée unipersonnelle (SASU) au capital de 2 500 €,
            immatriculée sous le numéro SIRET 837 661 206 00016 (RCS Lyon), dont le siège est
            situé 65 rue de Créqui, 69006 Lyon, France, édite et exploite les sites
            pitchinmotion.com et trlblzr.run (ci-après « nous »).
          </P>
          <P>
            Responsable du traitement : Étienne Bourdon
            <br />
            Contact : contact@brdn.pro
          </P>

          <H2>2. Quels sites couvre cette politique ?</H2>
          <P>
            Cette politique s&rsquo;applique aux deux sites, édités par la même société. La façon
            dont les données sont collectées diffère fortement entre les deux — trlblzr.run gère
            directement candidatures et comptes membres, tandis que pitchinmotion.com oriente vers
            des services tiers sans rien stocker lui-même — c&rsquo;est pourquoi la section 3 les
            distingue.
          </P>

          <H2>3. Quelles données sont collectées ?</H2>
          <p className="font-mono text-xs tracking-[0.15em] text-ember mb-2 mt-6">
            3.1 SUR TRLBLZR.RUN
          </p>
          <P>
            <strong className="text-paper-white">Lors de votre candidature</strong> — vos
            coordonnées (nom, email, téléphone), des informations professionnelles et sportives
            que vous nous fournissez pour évaluer votre candidature (entreprise, poste, niveau
            sportif, motivation, ce que vous recherchez), ainsi que, si vous les renseignez, vos
            liens professionnels et sociaux et la source par laquelle vous nous avez découverts.
          </P>
          <P>
            <strong className="text-paper-white">Une fois membre</strong> — votre photo de profil,
            le contenu de votre profil public (rédigé par vous ou généré à partir de vos
            informations via un outil d&rsquo;intelligence artificielle, à votre demande), vos
            préférences de participation aux événements, et votre langue d&rsquo;affichage.
          </P>
          <P>
            <strong className="text-paper-white">Données techniques</strong> — des données liées à
            la gestion de votre compte et à la sécurité de votre connexion (vérification
            d&rsquo;email, code de connexion à usage unique, durée de session).
          </P>
          <P>
            Nous ne collectons aucune donnée dite « sensible » au sens du RGPD (origine, santé,
            opinions, etc.).
          </P>

          <p className="font-mono text-xs tracking-[0.15em] text-ember mb-2 mt-6">
            3.2 SUR PITCHINMOTION.COM
          </p>
          <P>
            pitchinmotion.com ne dispose d&rsquo;aucun formulaire propre : le site oriente vers des
            outils tiers, exploités sous notre propre compte (organisateur) :
          </P>
          <Ul>
            <li>une plateforme d&rsquo;inscription tierce pour les événements ;</li>
            <li>une plateforme de prise de rendez-vous tierce ;</li>
            <li>des groupes de messagerie communautaire ;</li>
            <li>
              des réseaux sociaux (abonnés — aucune donnée personnelle supplémentaire reçue
              au-delà du profil public visible sur ces plateformes).
            </li>
          </Ul>
          <P>
            Ces plateformes sont elles-mêmes responsables du traitement qu&rsquo;elles opèrent
            pour leur propre compte (création de votre compte, fonctionnement du service, etc.) —
            consultez leur politique de confidentialité respective à ce titre.
          </P>
          <P>
            En tant qu&rsquo;organisateur, nous recevons cependant directement, via ces outils, vos
            coordonnées (nom, email et, selon le cas, numéro de téléphone). Ces données sont
            ensuite centralisées dans la même base de données que celle utilisée pour trlblzr.run
            — voir section 6.
          </P>
          <P>
            pitchinmotion.com ne dépose aucun cookie : votre préférence de langue est retenue
            uniquement dans le stockage local de votre navigateur (localStorage), jamais transmise
            à nos serveurs.
          </P>

          <H2>4. Pourquoi collectons-nous ces données ?</H2>
          <Ul>
            <li>Étudier votre candidature et gérer votre compte membre ;</li>
            <li>
              Afficher votre profil public au sein de la communauté, si vous en faites la demande
              et donnez votre accord spécifique ;
            </li>
            <li>Vous mettre en relation avec les autres membres et avec nos événements ;</li>
            <li>
              Vous contacter au sujet de votre candidature, de votre compte, ou de nos activités ;
            </li>
            <li>Assurer la sécurité de votre compte.</li>
          </Ul>

          <H2>5. Sur quelle base légale ?</H2>
          <P>
            Sur trlblzr.run, le traitement repose sur votre{' '}
            <strong className="text-paper-white">consentement</strong>, recueilli explicitement :
          </P>
          <Ul>
            <li>lors de la candidature (case à cocher obligatoire) ;</li>
            <li>
              séparément, avant toute publication publique de votre profil (case à cocher dédiée,
              distincte du consentement de candidature).
            </li>
          </Ul>
          <P>
            Sur pitchinmotion.com, le traitement repose également sur votre{' '}
            <strong className="text-paper-white">consentement</strong> : en vous inscrivant
            volontairement à un événement, en réservant un créneau, ou en rejoignant un groupe
            WhatsApp, vous nous transmettez sciemment vos coordonnées à cette fin.
          </P>
          <P>Vous pouvez retirer votre consentement à tout moment (voir section 9).</P>

          <H2>6. Qui a accès à vos données ?</H2>
          <P>
            Sur trlblzr.run, vos données sont traitées par nous et par les catégories de
            sous-traitants suivantes, chacune retenue pour la durée strictement nécessaire au
            service :
          </P>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border border-stone text-sm">
              <thead>
                <tr className="bg-stone/40 text-left">
                  <th className="p-3 font-mono text-xs tracking-[0.1em] text-paper-white border-b border-stone">
                    Catégorie
                  </th>
                  <th className="p-3 font-mono text-xs tracking-[0.1em] text-paper-white border-b border-stone">
                    Rôle
                  </th>
                </tr>
              </thead>
              <tbody className="text-ash">
                <tr>
                  <td className="p-3 border-b border-stone">Hébergement du site et des fichiers</td>
                  <td className="p-3 border-b border-stone">
                    Hébergement, stockage des photos de profil
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-stone">Base de données</td>
                  <td className="p-3 border-b border-stone">
                    Stockage de votre dossier candidat/membre
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-stone">Envoi d&rsquo;emails</td>
                  <td className="p-3 border-b border-stone">
                    Candidature, connexion, notifications
                  </td>
                </tr>
                <tr>
                  <td className="p-3">Génération de texte assistée par IA</td>
                  <td className="p-3">
                    Rédaction du contenu de votre profil — uniquement si vous utilisez cette
                    fonction
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            La liste nominative de ces prestataires est communiquée sur simple demande à
            contact@brdn.pro.
          </P>
          <P>
            Les coordonnées reçues via pitchinmotion.com (section 3.2) sont stockées dans cette
            même base de données, aux côtés des données de trlblzr.run.
          </P>
          <P>
            Certains de ces sous-traitants sont basés hors de l&rsquo;Union européenne (aux
            États-Unis notamment) et peuvent donc, dans le cadre de ces traitements, transférer vos
            données hors de l&rsquo;UE. Ce transfert s&rsquo;appuie sur des garanties reconnues par
            le RGPD : clauses contractuelles types de la Commission européenne et/ou certification
            du cadre de protection des données UE-États-Unis (Data Privacy Framework), selon le
            sous-traitant concerné. Vous pouvez obtenir une copie des garanties applicables sur
            simple demande à contact@brdn.pro.
          </P>
          <P>
            Vos données ne sont ni vendues, ni louées, ni partagées à des fins publicitaires.
          </P>

          <H2>7. Combien de temps vos données sont-elles conservées ?</H2>
          <p className="font-mono text-xs tracking-[0.15em] text-ember mb-2 mt-6">
            SUR TRLBLZR.RUN
          </p>
          <Ul>
            <li>
              <strong className="text-paper-white">Candidature non retenue</strong> : 2 ans à
              compter du dernier contact avec le candidat, puis suppression. Il n&rsquo;existe pas
              de durée légale imposée spécifiquement pour ce cas ; cette durée de 2 ans reprend,
              par analogie et à titre de plafond volontaire, le repère que la CNIL recommande pour
              les candidatures à un emploi non retenues — c&rsquo;est le principe de
              proportionnalité du RGPD (article 5.1.e) qui s&rsquo;applique réellement ici.
            </li>
            <li>
              <strong className="text-paper-white">Membre actif</strong> : pour la durée de votre
              adhésion et de votre participation à la communauté.
            </li>
            <li>
              <strong className="text-paper-white">Profil public retiré</strong> : conservé 90
              jours après retrait (délai vous permettant de le réactiver), puis supprimé.
            </li>
            <li>
              <strong className="text-paper-white">
                Demande de suppression complète du compte
              </strong>{' '}
              : traitée manuellement sur simple demande à contact@brdn.pro (voir section 9), dans
              un délai maximal d&rsquo;un mois.
            </li>
          </Ul>
          <p className="font-mono text-xs tracking-[0.15em] text-ember mb-2 mt-6">
            SUR PITCHINMOTION.COM
          </p>
          <P>
            3 ans à compter de votre dernier contact avec nous (dernière participation à un
            événement, dernier échange), puis suppression. Il n&rsquo;existe pas de durée légale
            imposée spécifiquement pour ce cas ; cette durée de 3 ans reprend, par analogie, le
            repère que la CNIL recommande pour la gestion de contacts professionnels/prospects en
            l&rsquo;absence de relation contractuelle continue.
          </P>

          <H2 id="cookies">8. Cookies</H2>
          <P>trlblzr.run utilise deux cookies :</P>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border border-stone text-sm">
              <thead>
                <tr className="bg-stone/40 text-left">
                  <th className="p-3 font-mono text-xs tracking-[0.1em] text-paper-white border-b border-stone">
                    Cookie
                  </th>
                  <th className="p-3 font-mono text-xs tracking-[0.1em] text-paper-white border-b border-stone">
                    Finalité
                  </th>
                  <th className="p-3 font-mono text-xs tracking-[0.1em] text-paper-white border-b border-stone">
                    Type
                  </th>
                  <th className="p-3 font-mono text-xs tracking-[0.1em] text-paper-white border-b border-stone">
                    Consentement requis ?
                  </th>
                </tr>
              </thead>
              <tbody className="text-ash">
                <tr>
                  <td className="p-3 border-b border-stone font-mono text-xs">
                    trlblzr_session
                  </td>
                  <td className="p-3 border-b border-stone">
                    Vous garder connecté après vérification de votre email
                  </td>
                  <td className="p-3 border-b border-stone">Strictement nécessaire</td>
                  <td className="p-3 border-b border-stone">
                    Non — exempté (fonctionnement du service demandé)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">trlblzr-locale</td>
                  <td className="p-3">Mémoriser votre préférence de langue (français/anglais)</td>
                  <td className="p-3">Préférence utilisateur</td>
                  <td className="p-3">Non — exempté (préférence d&rsquo;affichage)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <P>
            Aucun cookie de mesure d&rsquo;audience, de publicité ou de traçage n&rsquo;est utilisé
            sur trlblzr.run. pitchinmotion.com ne dépose aucun cookie (voir section 3.2).
          </P>

          <H2>9. Vos droits</H2>
          <P>Conformément au RGPD, vous disposez des droits suivants sur vos données :</P>
          <Ul>
            <li>
              <strong className="text-paper-white">Accès</strong> : obtenir une copie des données
              vous concernant ;
            </li>
            <li>
              <strong className="text-paper-white">Rectification</strong> : corriger des données
              inexactes — la plupart des champs de trlblzr.run sont modifiables directement depuis
              votre espace membre ;
            </li>
            <li>
              <strong className="text-paper-white">Effacement</strong> : demander la suppression
              de vos données (« droit à l&rsquo;oubli ») ;
            </li>
            <li>
              <strong className="text-paper-white">Limitation</strong> : demander la suspension
              temporaire d&rsquo;un traitement ;
            </li>
            <li>
              <strong className="text-paper-white">Portabilité</strong> : recevoir vos données
              dans un format structuré ;
            </li>
            <li>
              <strong className="text-paper-white">Opposition</strong> : vous opposer à un
              traitement ;
            </li>
            <li>
              <strong className="text-paper-white">Retrait du consentement</strong> à tout moment,
              sans effet rétroactif.
            </li>
          </Ul>
          <P>
            Pour exercer ces droits, écrivez à{' '}
            <strong className="text-paper-white">contact@brdn.pro</strong>. Nous répondons dans un
            délai maximal d&rsquo;un mois.
          </P>
          <P>
            Vous pouvez également retirer votre profil public de la visibilité publique à tout
            moment depuis votre espace membre trlblzr.run.
          </P>
          <P>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une
            réclamation à la CNIL (www.cnil.fr).
          </P>

          <H2>10. Sécurité</H2>
          <P>
            Sur trlblzr.run, la connexion se fait sans mot de passe (liens magiques et codes à
            usage unique), avec des mesures de sécurité conformes à l&rsquo;état de l&rsquo;art.
            Les sessions expirent automatiquement.
          </P>

          <H2>11. Modification de cette politique</H2>
          <P>
            Cette politique peut être mise à jour. La date de dernière modification est indiquée
            en haut de ce document.
          </P>

          <H2>12. Contact</H2>
          <P>
            Pour toute question relative à vos données personnelles :{' '}
            <strong className="text-paper-white">contact@brdn.pro</strong>
          </P>
        </div>
      </main>
      <Footer />
    </>
  );
}
