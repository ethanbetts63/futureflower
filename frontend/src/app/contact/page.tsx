import Link from "next/link";
import { ContactHero } from "@/components/contact_page/ContactHero";
import { Letter } from "@/components/contact_page/Letter";
import OtherSites from "@/components/contact_page/OtherSites";
import { getRouteMetadata } from "@/lib/routeMetadata";
import allbikesLogo from "@/assets/allbikes_logo.webp";
import splitcartLogo from "@/assets/splitcart_logo.png";
import futureReminderLogo from "@/assets/futurereminder_logo.png";

export const metadata = getRouteMetadata("/contact");

const email = "ethan.betts.dev@gmail.com";

const otherSitesData = [
  {
    name: "AllBikes & Scooters",
    logoSrc: allbikesLogo,
    description:
      "Your one-stop shop for motorcycle and scooter servicing and parts in Perth, Western Australia.",
    url: "https://www.scootershop.com.au",
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
    description:
      "Distant and important reminder service with an escalating hierarchy of notification, including text message, email, and emergency contacts.",
    url: "https://www.futurereminder.app",
  },
];

function StaticServicesCard() {
  return (
    <aside className="bg-white shadow-md text-gray-900 rounded-none sm:rounded-xl border-0">
      <div className="px-6 py-8 text-black">
        <h2 className="font-bold text-4xl text-black font-['Playfair_Display',_serif] text-center">
          Our Services
        </h2>
        <div className="mt-8 space-y-8">
          <section>
            <h3 className="text-xl font-bold font-['Playfair_Display',_serif] text-center">
              Subscriptions
            </h3>
            <p className="text-center text-gray-700 my-3 text-sm">
              Set up flowers for the dates that matter most, from annual milestones to weekly or monthly deliveries.
            </p>
            <ul className="my-4 space-y-4">
              <li>
                <p className="font-bold text-md">Dates, budget, done</p>
                <p className="text-sm text-gray-600">Set it up once, we handle the rest.</p>
              </li>
              <li>
                <p className="font-bold text-md">Milestones first</p>
                <p className="text-sm text-gray-600">Annual moments by default, flexible schedules when you need more.</p>
              </li>
            </ul>
            <Link
              href="/event-gate/subscription"
              className="mt-4 block w-full bg-[var(--colorgreen)] text-center text-black font-bold px-4 py-3 hover:brightness-105 transition-all"
            >
              Start a Subscription
            </Link>
          </section>
          <section className="border-t border-black/10 pt-8">
            <h3 className="text-xl font-bold font-['Playfair_Display',_serif] text-center">
              One-time Bouquet Delivery
            </h3>
            <p className="text-center text-gray-700 my-3 text-sm">
              Flowers scheduled today and delivered on a future date you choose.
            </p>
            <Link
              href="/event-gate/single-delivery"
              className="mt-4 block w-full bg-black text-center text-white font-bold px-4 py-3 hover:bg-black/85 transition-all"
            >
              Send Flowers
            </Link>
          </section>
        </div>
      </div>
    </aside>
  );
}

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us",
    description:
      "Have a question, suggestion, or need support? Get in touch with the FutureFlower team - we'd love to hear from you.",
    url: "https://www.futureflower.app/contact",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.futureflower.app/contact",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email,
      contactType: "Customer Support",
      availableLanguage: "English",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactHero />
      <div className="bg-[var(--color4)] py-8">
        <div className="container mx-auto px-0 sm:px-4 lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 text-primary-foreground rounded-lg px-0 sm:p-8 md:p-8 lg:p-8 flex flex-col gap-0 sm:gap-8">
            <Letter />
            <section className="lg:hidden">
              <StaticServicesCard />
            </section>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky mb-7 mt-6 top-24">
              <StaticServicesCard />
            </div>
          </aside>
        </div>
      </div>
      <div className="bg-[var(--color4)]">
        <OtherSites sites={otherSitesData} />
      </div>
    </main>
  );
}
