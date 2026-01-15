import React, { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import type { FaqItem } from '@/types';
import { ChevronDown } from 'lucide-react';

// Hardcoded FAQ data for the homepage
const homeFaqs: FaqItem[] = [
  {
    "question": "Are there any recurring fees?",
    "answer": "No. The price is upfront. You shouldn't even have to think about us until its time to remind you of your important event. So reaccuring fees just wouldn't fit. If you would like to make a recurring event we will provide that option but by default everything is a one time fee payed upfront."
  },
  {
    "question": "What if you can’t reach me?",
    "answer": "We designed a robust system, but we are not magicians. Our system is designed to escalate. We try your email. Then we try your phone. Then we try your backup email. Finally, we try your emergency contact. But if your numbers are dead, your emails bounce, the emergency contact fails and socials prove to be unreliable, then the line of communication ends there. We can only be as robust as the information you give us."
  },
  {
    "question": "Are you liable if I miss a deadline?",
    "answer": "No. ForeverFlower is designed to be a safety net, not the main event. Think of us like the reserve parachute. You should still pack your main parachute (your calendar, your lawyer, your own memory) with care. We are here to catch you if those primary systems fail. While we have built incredible redundancy into our code and servers, technology — like life — is unpredictable. By using ForeverFlower, you agree that we provide a layer of security, but the ultimate responsibility for your obligations remains with you."
  },
  {
    "question": "How do you use my data?",
    "answer": "Sparingly. We are in the business of reminders, not data brokerage. We do not sell your data. We do not analyze your deadlines to serve you ads. We only ask for information that is functionally necessary to contact you (emails, phone numbers, etc.). That’s it. You are the customer, not the product."
  }
];

interface FaqV2Props {
  title: string;
}

export const FaqV2: React.FC<FaqV2Props> = ({ title }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const generateJsonLd = () => {
    if (!homeFaqs.length) {
      return null;
    }

    const faqItems = homeFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  };

  return (
    <>
      {generateJsonLd()}
      <div className="pt-20 pb-2">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-8">{title}</h2>
          <div className="flex flex-col items-center gap-4">
            {homeFaqs.map((faq, index) => (
              <div key={index} className="w-full md:w-2/3 lg:w-2/3">
                <Card className="bg-white text-gray-900 rounded-lg shadow-md">
                  <CardContent className="p-0">
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="text-xl font-semibold text-black">{faq.question}</h3>
                      <ChevronDown
                        className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''
                          }`}
                      />
                    </div>
                    <div
                      className={`overflow-hidden transition-all ease-in-out duration-500 ${
                        openIndex === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-600 text-lg">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
