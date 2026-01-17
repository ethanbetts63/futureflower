import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import { FaqV2 } from '../components/FaqV2';
import { Letter } from '../components/Letter';
import { CtaCard } from '../components/CtaCard';
import { HeroV2 } from '../components/HeroV2';
import { DeliverySection } from '../components/DeliverySection';
import { RomanceSection } from '../components/RomanceSection';
import { OtherServices } from '../components/OtherServices';


const HomePage = () => {
  return (
    <main>
      <Seo
        title="ForeverFlower | Persistent reminders for important or distant events."
        description="Standard calendars fail for distant or important events. ForeverFlower uses an escalating hierarchy of notifications to ensure you never miss a critical deadline or event again."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
      />
      <HeroV2
        title={<>The gift that <span className='italic'>keeps</span> on giving.</>}
        subtitle={<>The most romantic gestures are those that plan for a future together. Choose the date, set the budget, and we ensure flowers are delivered year after year - turning one decision into a lifetime of meaningful moments.</>}
      />
      
      {/* --- Hierarchy Section --- */}
      <section className="bg-primary">
        <ProductCarousel />
      </section>

      <RomanceSection />
      <DeliverySection />



      {/* --- Main Content & Sticky Sidebar --- */}
      <div className="container mx-auto px-0 sm:px-4 lg:grid lg:grid-cols-3 lg:gap-8">
        
        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 bg-background text-primary-foreground rounded-lg px-0 sm:p-8 md:p-8 lg:p-8 flex flex-col gap-0 sm:gap-8">
          <Letter />
          <section className="lg:hidden">
            <CtaCard />
          </section>
        </div>

        {/* Sticky Sidebar Column (1/3 width) */}
        <aside className="hidden lg:block">
          <div className="sticky mb-7 mt-6 top-24">
            <CtaCard />
          </div>
        </aside>

      </div>

      <OtherServices />
      
      <section className="mb-16">
        <FaqV2
          title="Questions? We have answers."
        />
      </section>
    </main>
  );
};

export default HomePage;