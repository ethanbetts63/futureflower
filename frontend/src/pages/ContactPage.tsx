import React from 'react';
import heroImage from '../assets/hero2.png';
import { Hero } from '../components/Hero';
import OtherSites from '../components/OtherSites';
import { Letter } from '../components/Letter';
import { CtaCard } from '../components/CtaCard';
import Seo from '@/components/Seo';
import allbikesLogo from '@/assets/allbikes_logo.webp'; 
import splitcartLogo from '@/assets/splitcart_logo.png';
import futureReminderLogo from '@/assets/futurereminder_logo.png';

const otherSitesData = [
    {
        name: "Allbikes",
        logoSrc: allbikesLogo, 
        description: "Your one-stop shop for motorcycle and scooter servicing and parts in Perth, Western Australia.",
        url: "https://www.allbikes.com.au", 
    },
    {
        name: "Splitcart",
        logoSrc: splitcartLogo, 
        description: "Compare grocery prices across major Australian supermarkets.",
        url: "https://www.splitcart.com.au", 
    },
    {
        name: "FutureReminder",
        logoSrc: futureReminderLogo, 
        description: "Distant and important reminder service with an escalating hierachy of notification. Including text message, email, and emergency contacts.",
        url: "https://www.futurereminder.app", 
    },
];

const ContactPage: React.FC = () => {
    const description = "Have questions, suggestions, or feedback? Get in touch with us. I'd love to hear from you. I know that there is room for improvement! ethanbetts63@gmail.com";
    const email = "ethanbetts63@gmail.com";

    const contactPageSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Us",
        "description": description,
        "url": "https://www.futureflower.app/contact",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.futureflower.app/contact"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": email,
            "contactType": "Customer Support",
            "availableLanguage": "English"
        }
    };

    return (
        <div>
            <Seo
                title="Contact Us | FutureFlower"
                description={description}
                canonicalPath="/contact"
                structuredData={contactPageSchema}
            />
            <Hero
                title="Contact Us"
                subtitle={description}
                imageSrc={heroImage}
                imageAlt="A pin up board of postnotes with various reminder icons"
            />
                  {/* --- Main Content & Sticky Sidebar --- */}
                  <div className="bg-[var(--color4)] py-8">
                    <div className="container mx-auto px-0 sm:px-4 lg:grid lg:grid-cols-3 lg:gap-8">
                      
                      {/* Main Content Column (2/3 width) */}
                      <div className="lg:col-span-2 text-primary-foreground rounded-lg px-0 sm:p-8 md:p-8 lg:p-8 flex flex-col gap-0 sm:gap-8">
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
                  </div>
            
            <div style={{ backgroundColor: 'var(--color4)' }}>
                <OtherSites sites={otherSitesData} />
            </div>
        </div>
    );
};

export default ContactPage;
