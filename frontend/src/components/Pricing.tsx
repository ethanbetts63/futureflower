import React from 'react';
import { CreateEventLink } from './CreateEventLink';
import { CheckCircle } from 'lucide-react';

const automatedFeatures = [
  "Repeated emails to primary email",
  "Repeated texts to primary number",
  "Escalation to secondary email & number",
  "Customizable notification schedule",
];

const fullEscalationFeatures = [
  "Includes everything in free tier",
  "Direct phone calls",
  "Social media outreach",
  "Emergency contact outreach",
  "Additional backup emails"
];


const Pricing: React.FC = () => {

  return (
    <div className="bg-background rounded-xl py-4 pz-2 md:p-8">
      <div className="w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground">Choose Your Level of Security</h2>
            <p className="mt-4 text-lg text-primary-foreground max-w-2xl mx-auto">
              You can try out a basic version of our system or opt for the full hiearchy of protection.
            </p>
          </div>
          
          {/* Grid container for the two tier cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Tier 1 Card: Automated */}
            <div className="bg-white border rounded-xl shadow-lg flex flex-col p-8">
              <div className="uppercase tracking-wide text-m text-indigo-500 font-semibold">Simple & Automated</div>
              <p className="block mt-1 text-5xl leading-tight font-bold text-black">
                $0.00
              </p>
              <p className="mt-2 text-black">Persistant, automated reminders to help you remember.</p>
              
              <ul className="mt-8 space-y-4 flex-grow">
                {automatedFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-black">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tier 2 Card: Full Escalation */}
            <div className="bg-white border rounded-xl shadow-lg flex flex-col p-8">
              <div className="uppercase tracking-wide text-m text-indigo-500 font-semibold">Full Escalation</div>
              <p className="block mt-1 text-5xl leading-tight font-bold text-black">
                $9.99
              </p>
              <p className="mt-2 text-black">Our complete outreach hierarchy for a single one time payment.</p>
              
              <ul className="mt-8 space-y-4 flex-grow">
                {fullEscalationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-black">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Single, Centered CTA Button */}
          <div className="max-w-4xl mx-auto mt-8 text-center">
              <CreateEventLink className="w-full max-w-md h-12 text-lg">
                Secure Your Reminder
              </CreateEventLink>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pricing;