import React from 'react';
import floristImage from '../assets/florist.webp';
import floristImage320 from '../assets/florist-320w.webp';
import floristImage640 from '../assets/florist-640w.webp';
import floristImage768 from '../assets/florist-768w.webp';
import floristImage1024 from '../assets/florist-1024w.webp';
import floristImage1280 from '../assets/florist-1280w.webp';


export const OtherServices: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Image Column */}
        <div className="h-full">
          <img 
            src={floristImage} 
            srcSet={`${floristImage320} 320w, ${floristImage640} 640w, ${floristImage768} 768w, ${floristImage1024} 1024w, ${floristImage1280} 1280w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="A florist arranging a beautiful bouquet of flowers." 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Flexible for every occasion
            </h2>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">🎁 One-off Single Deliveries</h3>
                    <p>Plan months or even years ahead for a single delivery, ensuring that a significant future occasion is never missed.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">🔄 Transferable Subscriptions</h3>
                    <p>You can give a person access to your subscription. This allows them to be in control of delivery details such as address, dates and bouquet preferences, whilst you retain the ability to make changes and/or top up their account.</p>
                </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
