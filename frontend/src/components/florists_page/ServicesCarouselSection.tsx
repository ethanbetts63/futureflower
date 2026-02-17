import React from 'react';
import { Calendar, RefreshCw, CreditCard, Gift } from 'lucide-react';

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
      'We specialise in annual subscriptions for significant dates (e.g. birthdays) but we also offer weekly, fortnightly, monthly and bi-annual schedules.',
      'We manage reminders, payments, scheduling, and changes.',
      'Customers love "this is handled forever" — you benefit from predictable, repeat revenue.',
    ],
  },
  {
    icon: CreditCard,
    title: 'Prepaid Plans',
    tagline: 'Upfront commitment for customers. Guaranteed future revenue for florists.',
    points: [
      'Customers prepay for multiple deliveries.',
      'No missed payments, cancellations, or admin overhead for you.',
      'We manage the capital risk, schedule, and customer communication.',
    ],
  }
];

export const ServicesCarouselSection: React.FC = () => {
  return (
    <section className="bg-primary py-6">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif] tracking-tight">
            Our Services
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to offer long-term flower commitments — without the headache.
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide max-w-6xl mx-auto justify-center">
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
                    <span className="text-green-500 mt-1">&#10003;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
