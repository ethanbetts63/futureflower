import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Check } from 'lucide-react';

const compressedTimelineStyles = `
@media only screen and (min-width: 1170px) {
  .vertical-timeline--two-columns .vertical-timeline-element {
    margin: -4em 0 !important;
  }
  .vertical-timeline--two-columns .vertical-timeline-element:first-child {
    margin-top: 0 !important;
  }
}
`;

export const Timeline: React.FC = () => {
      const timelineData = [
      {
        title: 'Quick Set Up',
        description: [
          'Create your account and download you custom instore poster',
          'Optionally copy your Partner Link and it to your website',
          'Upsell a customer or let the poster/link do the talking'
        ]
      },
      {
        title: 'Customer Books Delivery',
        description: [
          'Sets budget, dates, and flower preferences',
          'Pays for each bouquets budget (eg. $100) and customer protection fee',
          'Our fee is in addition to the budget. Florists are always paid the full budget amount for accepted orders.',
        ],
      },
      {
        title: "You're Notified (2 Weeks Before Delivery)",
        description: [
          'Full order details sent via text & email: budget, address, preferences',
          "Click acceptance link to confirm or deny the order (no penalty for denying)",
          'No admin, dashboards or sites to manage - one link handled from email or text',
          "If you decline a customer you signed up, receive a 5% commission instead",
        ],
      },
      {
        title: '2nd Notice (1 Week Before Delivery)',
        description: [
          "Additional requests sent to ensure receipt of the acceptance link",
          'You have 48 hours to accept or decline',
          "Same 5% commision for declining.",
          "No response = decline",
        ],
      },
      {
        title: 'Delivery Day',
        description: [
          'Create a bouquet that matches the budget and preferences (as closely as possible)',
          'Deliver using your normal process',
          'Full budget amount paid weekly for all accepted orders.',
        ],
      },
    ];
  
    return (
      <section className="pt-10 pb-20 bg-[var(--color4)]">
        <style>{compressedTimelineStyles}</style>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
            A Simple 5-Step Process
          </h2>
          <VerticalTimeline lineColor={'#e5e7eb'}>
            {timelineData.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{ background: '#f8f8f8', color: '#444', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                contentArrowStyle={{ borderRight: '7px solid  #f8f8f8' }}
                iconStyle={{ background: 'var(--color2)', color: '#fff' }}
                icon={<Check />}
              >
                <h3 className="vertical-timeline-element-title text-black text-xl font-semibold">{item.title}</h3>
                {Array.isArray(item.description) ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                    {item.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 mt-2">{item.description}</p>
                )}
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </section>  );
};