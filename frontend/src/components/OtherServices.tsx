import React from 'react';
import floristImage from '../assets/florist.png';

export const OtherServices: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* Image Column */}
        <div className="h-full">
          <img 
            src={floristImage} 
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
                    <h3 className="text-xl font-bold mb-2">One-off Single Deliveries</h3>
                    <p>Perfect for those special, one-time events in the distant future. Plan years ahead for a single delivery, ensuring that a significant future occasion is never missed.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Transferable Subscriptions</h3>
                    <p>Our subscriptions are as flexible as life is unpredictable. You can transfer your subscription to a different person, change the recipient, or even move it to a new address, hassle-free.</p>
                </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
