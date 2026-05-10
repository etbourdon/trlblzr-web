import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-6 md:px-10 py-12 border-t border-stone">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="col-span-2">
          <p className="font-display font-bold text-2xl tracking-tight text-paper-white">
            TRLBLZR
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-ash">
            WEEK-END · TRAIL &amp; MOVEMENT
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
            EXPLORER
          </p>
          <ul className="space-y-2 font-sans text-sm text-ash">
            <li>
              <Link href="#circle" className="hover:text-ember transition-colors">
                Sessions
              </Link>
            </li>
            <li>
              <Link href="#club" className="hover:text-ember transition-colors">
                The Club
              </Link>
            </li>
            <li>
              <Link href="#philosophy" className="hover:text-ember transition-colors">
                Philosophy
              </Link>
            </li>
            <li>
              <Link href="#apply" className="hover:text-ember transition-colors">
                Postuler
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
            SUIVRE
          </p>
          <ul className="space-y-2 font-sans text-sm text-ash">
            <li>
              <a
                href="https://www.instagram.com/pitch_in_motion_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ember transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/pitch-in-motion/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ember transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:etienne@bourdon.com"
                className="hover:text-ember transition-colors"
              >
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-stone flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] tracking-[0.25em] text-ash">
        <span>© 2026 TRLBLZR · ALL RIGHTS RESERVED</span>
        <span>COURIR — ÉCHANGER — SE PERFECTIONNER — RECOMMENCER</span>
      </div>
    </footer>
  );
}
