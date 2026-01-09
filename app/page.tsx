import Hero from '@/components/sections/Hero';
import WhyEverMoment from '@/components/sections/WhyEverMoment';
import OurWorks from '@/components/sections/OurWorks';
import HowItWorks from '@/components/sections/HowItWorks';
import FinalCTA from '@/components/sections/FinalCTA';
import OfferBanner from "@/components/OfferBanner";


export default function Home() {
  return (
    <>
      <Hero />
      <OfferBanner />
      <WhyEverMoment />
      <OurWorks />
      <HowItWorks />
      <FinalCTA />
    </>
  );
}
