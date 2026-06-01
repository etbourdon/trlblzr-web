import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ManifestoShort from '@/components/ManifestoShort';
import CircleSection from '@/components/CircleSection';
import PastEditionsSection from '@/components/PastEditionsSection';
import AthletesSection from '@/components/AthletesSection';
import ClubSection from '@/components/ClubSection';
import ManifestoLong from '@/components/ManifestoLong';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

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
        <ManifestoLong />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
