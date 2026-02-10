import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Check } from 'lucide-react'; 

export const Timeline: React.FC = () => {
      const timelineData = [
      {
        title: 'Customer Books Delivery',
        description: [
          'Customer sets budget, dates, and flower preferences',
          'Customer pays for each bouquets budget (eg. $100) and a 5% customer protection fee',
          "We record the source of the custemers order (e.g. Westminister Florists, website, etc.)",
        ],
      },
      {
        title: "You're Notified (2 Weeks Before)",
        description: [
          'Full order details sent via text & email: budget, address, preferences',
          "Click acceptance link to confirm or deny the order (no penalty for denying)",
          'This early notice helps you plan inventory and schedule',
          'Still plenty of time - no rush to decide',
        ],
      },
      {
        title: 'Last Chance to Accept',
        description: [
          "Additional requests sent to ensure receipt of the acceptance link",
          'You have 48 hours to accept or decline',
          "No penalty for declining - we'll find another florist",
          "No response = we assume you can't fulfill and choose another florist",
        ],
      },
      {
        title: 'Delivery Day',
        description: [
          'Create a bouquet that matches the budget and preferences (as closely as possible)',
          'Deliver using your normal process',
          'Full budget amount paid to you on the next Friday payment run',
        ],
      },
    ];
  
    return (
      <section className="py-10 md:py-14 bg-[var(--color4)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
            How we work togethor: A Simple 4-Step Process
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
            <VerticalTimelineElement
              iconStyle={{ background: 'var(--color2)', color: '#fff' }}
              icon={<Check />}
            />
          </VerticalTimeline>
        </div>
      </section>  );
};