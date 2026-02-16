import React from 'react';
import { MapPin } from 'lucide-react';
import SummarySection from './SummarySection';
import type { OrderBase } from '@/types/OrderBase';

interface RecipientSummaryProps {
  plan: OrderBase;
  editUrl: string;
}

const RecipientSummary: React.FC<RecipientSummaryProps> = ({ plan, editUrl }) => {
  const fullAddress = [
    plan.recipient_street_address,
    plan.recipient_suburb,
    plan.recipient_city,
    plan.recipient_state,
    plan.recipient_postcode,
    plan.recipient_country
  ].filter(Boolean).join(', ');

  return (
    <SummarySection label="Recipient" editUrl={editUrl}>
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-black/20 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-lg font-['Playfair_Display',_serif]">
            {plan.recipient_first_name} {plan.recipient_last_name}
          </p>
          <p className="text-black/60">{fullAddress || 'No address provided'}</p>
        </div>
      </div>
    </SummarySection>
  );
};

export default RecipientSummary;
