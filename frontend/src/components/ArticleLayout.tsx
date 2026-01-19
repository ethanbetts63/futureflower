import React from 'react';
import { Hero } from './Hero';
import { FaqV2 } from './FaqV2';
import { faqs } from '../data/faqs';

interface ArticleLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  faqPage?: string;
  children: React.ReactNode;
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({ title, subtitle, imageSrc, imageAlt, children, faqPage }) => {
  const faqItems = faqPage ? faqs[faqPage] : undefined;

  return (
    <main>
      <Hero
        title={title}
        subtitle={subtitle}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
      />
      
      <div style={{ backgroundColor: 'var(--color4)' }} className="py-12">
        <div className="container mx-auto px-4">
          
          {/* Main Content Column (Full width) */}
          <div style={{ backgroundColor: 'var(--color4)' }} className="text-primary-foreground rounded-lg px-4 md:p-0 lg:px-16 flex flex-col gap-8 max-w-4xl mx-auto">
            <div>
              {children}
            </div>
            {faqItems && (
              <section className="bg-transparent text-gray-900 rounded-lg">
                <FaqV2
                  title="Have Questions?"
                  faqs={faqItems}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
