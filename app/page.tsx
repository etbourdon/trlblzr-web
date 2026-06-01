import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ManifestoShort from '@/components/ManifestoShort';
import CircleSection from '@/components/CircleSection';
import PastEditionsSection from '@/components/PastEditionsSection';
import AthletesSection from '@/components/AthletesSection';
import ClubSection from '@/components/ClubSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

// Structure home — alignée sur le site statique trlblzr.run :
// Hero · Manifesto · 01 NEXT · 02 PAST EDITIONS (+ témoignages) · 03 ATHLETES · 04 THE CLUB · Go further · Footer
export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-trail-black text-paper-white">
        <Hero />
        <ManifestoShort />
        <CircleSection />
        <PastEditionsSection />
        <AthletesSection />
        <ClubSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
