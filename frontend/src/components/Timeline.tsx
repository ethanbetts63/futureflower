import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Check } from 'lucide-react'; // Using Check icon for the timeline dots

export const Timeline: React.FC = () => {
  const timelineData = [
    {
      title: 'Customer Orders',
      description: 'Customer sets budget, dates, and preferences',
    },
    {
      title: '2 Weeks Before',
      description: [
        "You're notified via text & email",
        "Can accept anytime",
      ],
    },
    {
      title: '1 Week Before',
      description: [
        "Final notification sent",
        "48 hours to accept",
      ],
    },
    {
      title: 'Delivery Day',
      description: [
        "You deliver the bouquet",
        "Paid weekly schedule",
      ],
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-[var(--color4)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
          How it Works
        </h2>
        <VerticalTimeline lineColor={'#e5e7eb'}> {/* Light gray line color */}
          {timelineData.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--work" // Generic class, can be customized
              contentStyle={{ background: 'white', color: '#333', boxShadow: '0 3px 0 rgba(0, 0, 0, 0.1)' }}
              contentArrowStyle={{ borderRight: '7px solid  white' }}
              iconStyle={{ background: 'var(--color2)', color: '#fff' }}
              icon={<Check />} // Using a checkmark icon
            >
              <h3 className="vertical-timeline-element-title text-black">{item.title}</h3>
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
          {/* Add an element at the end to signify completion or start */}
          <VerticalTimelineElement
            iconStyle={{ background: 'var(--color2)', color: '#fff' }}
            icon={<Check />}
          />
        </VerticalTimeline>
      </div>
    </section>
  );
};