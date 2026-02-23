import React from 'react';
import { FaqV2 } from '../FaqV2';
import type { FaqItem } from '../../types/FaqItem';

const pricingFaqs: FaqItem[] = [
    {
        question: 'Can I request specific flowers?',
        answer: 'Yes. When placing your order you can leave notes like "Loves lilies" or "No pink," and the florist will accommodate your preferences based on seasonal availability. Because we don\'t enforce a rigid recipe, your florist has the freedom to honour your requests.',
    },
    {
        question: 'Is delivery really included?',
        answer: 'Yes. The budget you type is the exact amount charged to your card. There is no delivery fee added at checkout — it is built into the budget from the start.',
    },
    {
        question: 'Can I change my budget later?',
        answer: 'Yes. You can adjust the budget for any upcoming scheduled delivery up to 14 days before the delivery date. Simply log in to your dashboard, open the plan, and update the budget. Changes apply to that delivery and all future ones on that plan.',
    },
];

const PricingFaq: React.FC = () => (
    <section className="bg-[var(--color4)] pb-16">
        <FaqV2
            title="Pricing questions, answered."
            faqs={pricingFaqs}
        />
    </section>
);

export default PricingFaq;
