import { useRef } from 'react';
import Seo from '../components/Seo';
import { HeroAffiliatesPage } from '../components/affiliates_page/HeroAffiliatesPage';


const AffiliatesPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <Seo
        title="FutureFlower Affiliates | Earn by Gifting"
        description="Help your followers get a better deal on flower deliveries. Earn $5–$25 per delivery while giving your community $5 off their first bouquet."
        canonicalPath="/affiliates"
        ogImage="/og-images/og-affiliates.webp"
      />

      <HeroAffiliatesPage scrollToContent={scrollToContent} />
    </main>
  );
};

export default AffiliatesPage;
