import { useRef } from 'react';
import Seo from '../components/Seo';
import { FaqV2 } from '../components/FaqV2';
import type { FaqItem } from '@/types/FaqItem';
import { Calendar, RefreshCw, CreditCard, Gift, Store, Link2, ChevronRight, ArrowDown } from 'lucide-react';

import heroImage320 from '../assets/hero1-320w.webp';
import heroImage640 from '../assets/hero1-640w.webp';
import heroImage768 from '../assets/hero1-768w.webp';
import heroImage1024 from '../assets/hero1-1024w.webp';
import heroImage1280 from '../assets/hero1-1280w.webp';
import heroMobileImage from '../assets/hero_mobile.webp';
import heroMobileImage320 from '../assets/hero_mobile-320w.webp';
import heroMobileImage640 from '../assets/hero_mobile-640w.webp';
import heroMobileImage768 from '../assets/hero_mobile-768w.webp';
import heroMobileImage1024 from '../assets/hero_mobile-1024w.webp';
import heroMobileImage1280 from '../assets/hero_mobile-1280w.webp';

const services = [
  {
    icon: Calendar,
    title: 'One-Off Scheduled Deliveries',
    tagline: 'Sell flowers for moments that haven\'t happened yet.',
    points: [
      'Scheduled deliveries from one week to five years out.',
      'We hold the customer commitment, manage changes, and absorb the risk.',
      'To you, it\'s just a normal delivery — fully paid, clearly scheduled.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Subscriptions',
    tagline: 'Flowers that show up on time — every time — without anyone having to remember.',
    points: [
      'We specialise in emotionally significant dates: Mother\'s Day, anniversaries, birthdays.',
      'We manage reminders, payments, scheduling, and changes.',
      'Customers love "this is handled forever" — you benefit from predictable, repeat revenue.',
    ],
  },
  {
    icon: CreditCard,
    title: 'Prepaid Plans',
    tagline: 'Upfront commitment for customers. Guaranteed future revenue for florists.',
    points: [
      'Customers prepay for multiple deliveries and receive a bulk discount.',
      'No missed payments, cancellations, or admin overhead for you.',
      'We manage the capital, schedule, and customer communication.',
    ],
  },
  {
    icon: Gift,
    title: 'Transferable Subscriptions & Plans',
    tagline: 'The gift that keeps giving — even when the giver steps back.',
    points: [
      'Customers can transfer control to the recipient after purchase.',
      'Recipients manage preferences, delivery dates, pauses, or address changes.',
      'Removes friction, reduces support, and keeps subscriptions active longer.',
    ],
  },
];

const conversationStarters = [
  '"Would you like us to arrange something similar delivered for Mother\'s Day?"',
  '"Would you like us to arrange something similar delivered this time next year?"',
  '"Would you like us to set up a delivery subscription? We can have something like this delivered once a month."',
];

const FloristsPage = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const floristFaqs: FaqItem[] = [
    {
      question: 'What if I can\'t or don\'t want to fulfill a delivery?',
      answer: 'No problem at all. If you can\'t fulfill a delivery request from a customer you referred to us, we\'ll pass the business on to another florist and cut you a 15% referral bonus. You can always say no to a delivery request without penalty.',
    },
    {
      question: 'How do refunds work?',
      answer: 'If a customer has a legitimate refund request and we are at fault, we pay back the full amount. If you are at fault (unfulfilled order, quality issues, etc.), we refund the full amount to the customer and request that you refund us the amount we paid you.',
    },
    {
      question: 'Is there a service debt or lock-in?',
      answer: 'No service debts. You\'ll receive a request for all orders from customers you sign up, but if you can\'t or don\'t want to fulfil a request, we\'ll pass it to another florist and give you a 15% commission instead. Conversely, requests that other florists can\'t fill can come straight to you.',
    },
    {
      question: 'What does it cost?',
      answer: 'ForeverFlower is completely free to use. There are no setup fees, monthly charges, or hidden costs. Just set up a QR code in-store and/or a link on your website and you\'re ready to go.',
    },
    {
      question: 'What countries do you operate in?',
      answer: 'Currently we operate in the EU (Europe), United Kingdom, North America (USA & Canada), Australia and New Zealand.',
    },
  ];

  return (
    <main>
      <Seo
        title="ForeverFlower for Florists | Grow Your Revenue"
        description="Extend your service beyond today's purchase. Offer scheduled deliveries, subscriptions, and prepaid plans — all without adding admin, complexity, or cost."
        canonicalPath="/florists"
        ogImage="/og-images/og-homepage.webp"
      />

      {/* Hero */}
      <section className="relative h-screen w-full flex items-end md:items-center">
        <picture className="absolute inset-0 w-full h-full">
          <source
            media="(min-width: 768px)"
            srcSet={`${heroImage320} 320w, ${heroImage640} 640w, ${heroImage768} 768w, ${heroImage1024} 1024w, ${heroImage1280} 1280w`}
            sizes="100vw"
          />
          <img
            src={heroMobileImage}
            srcSet={`${heroMobileImage320} 320w, ${heroMobileImage640} 640w, ${heroMobileImage768} 768w, ${heroMobileImage1024} 1024w, ${heroMobileImage1280} 1280w`}
            sizes="100vw"
            alt="A florist arranging a beautiful bouquet of flowers."
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="relative ml-0 sm:ml-12 md:ml-24 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black/70 p-8 sm:p-12 rounded-none sm:rounded-lg text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Turn one sale into <span className="italic">many</span>.
          </h1>
          <p className="mt-6 text-lg sm:text-xl leading-8">
            Extend your service beyond today's purchase. Offer scheduled deliveries, subscriptions, and prepaid plans — completely free, with zero admin.
          </p>
          <button
            onClick={scrollToContent}
            className="mt-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium">Learn more</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Why ForeverFlower */}
      <section ref={contentRef} className="bg-[var(--color4)] py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
              Why ForeverFlower?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Right now, when a customer walks into your shop, there's only so much you can upsell: a bigger bouquet, nicer wrapping, maybe an extra gift. And then it's over.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              ForeverFlower lets you extend your service beyond today's purchase. We give you the infrastructure to offer <strong>scheduled future deliveries</strong>, <strong>ongoing flower subscriptions</strong>, and <strong>multi-year prepaid flower plans</strong> — all without adding admin, complexity, or operational burden.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              And we are <strong>completely free to use</strong>. Just set up a QR code in-store and/or a link on your website.
            </p>

            {/* Conversation Starters */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <p className="text-gray-800 font-semibold mb-2 text-lg">
                This changes the conversation in your store.
              </p>
              <p className="text-gray-600 mb-6">
                Instead of just saying "That's a lovely bouquet," and goodbye — you can say:
              </p>
              <div className="flex flex-col gap-3">
                {conversationStarters.map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ChevronRight className="h-5 w-5 text-[var(--color2)] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 italic">{line}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 text-sm">
                These aren't upsells your customers have ever heard before.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="bg-primary py-10 md:py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
            Our Services
          </h2>
          <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
            Everything you need to offer long-term flower commitments — without the long-term headache.
          </p>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md p-6 snap-start transform transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-[var(--color2)] rounded-full">
                    <service.icon className="h-5 w-5 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 font-medium mb-4 text-sm">{service.tagline}</p>
                <ul className="flex flex-col gap-2">
                  {service.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-700 text-sm">
                      <span className="text-[var(--color2)] mt-1">&#10003;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* So What's the Catch? */}
      <section className="bg-[var(--color4)] py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
              So what's the catch?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The most honest answer is that <strong>we own the customer relationship</strong>. The customers learn to use our service, pay with our system, and give us their details.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Here's our counter:
            </p>
            <div className="flex flex-col gap-3">
              {[
                'This is mostly or entirely business you wouldn\'t have grabbed or been able to serve without us. You\'re not losing customers — you\'re gaining new business.',
                'We encourage you to use your logos on the bouquet. We differentiate ourselves by standing by local florists. If the flowers are so good the customer wants to skip the middle man and go in-store next time? So be it.',
                'In addition to carrying the complexity, headache, and capital risk of delivery commitments — we also carry all the bad reviews.',
                'If you decide to stop using our service, you can. We\'ll help you transition customers back in-house by providing you with the details of all customers you signed up. Perfect for a bulk email.',
                'You give up ownership of some customers you wouldn\'t realistically retain anyway, in exchange for risk-free, future-locked revenue and less admin. That\'s not giving up ownership. That\'s outsourcing your problems.',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm">
                  <ChevronRight className="h-5 w-5 text-[var(--color2)] flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Non-Delivery Partners */}
      <section className="bg-primary py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[var(--color2)] rounded-full">
                  <Store className="h-6 w-6 text-black" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  For non-delivery partners
                </h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Not every florist wants to deliver — it's expensive, complicated, and time consuming. But that doesn't mean it hurts any less when you have to say no to a customer. ForeverFlower gives you the ability to say: <strong>"No, but…"</strong>. A small difference that goes a long way. Every sale counts.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[var(--color4)] rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    You Just Need
                  </h3>
                  <ul className="flex flex-col gap-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color2)] mt-1">&#10003;</span>
                      A small poster in-store
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color2)] mt-1">&#10003;</span>
                      A link on your website or Instagram bio
                    </li>
                  </ul>
                </div>
                <div className="bg-[var(--color4)] rounded-lg p-6">
                  <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    What You Get
                  </h3>
                  <ul className="flex flex-col gap-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color2)] mt-1">&#10003;</span>
                      A 15% referral commission on all purchases for the lifetime of the customer
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color2)] mt-1">&#10003;</span>
                      We handle everything else
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="bg-[var(--color4)]">
        <section className="pb-8">
          <FaqV2
            title="Frequently Asked Questions"
            faqs={floristFaqs}
          />
        </section>
      </div>
    </main>
  );
};

export default FloristsPage;
