"use client";

import Link from 'next/link';
import Seo from '../components/Seo';
import { Hero } from '../components/Hero';
import deliveryImage320 from '../assets/delivery-320w.webp';
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1024 from '../assets/delivery-1024w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';
import { articles } from '@/lib/staticPages';
import { assetSrc } from '@/lib/assets';

const BlogExplorePage = () => {
  const srcSet = [
    `${assetSrc(deliveryImage320)} 320w`,
    `${assetSrc(deliveryImage640)} 640w`,
    `${assetSrc(deliveryImage768)} 768w`,
    `${assetSrc(deliveryImage1024)} 1024w`,
    `${assetSrc(deliveryImage1280)} 1280w`,
  ].join(', ');

  return (
    <>
      <Seo
        title="FutureFlower Blog"
        description="Explore articles, insights, and guides on long-term floral planning, personal growth, and making sure you never forget the important stuff."
        canonicalPath="/articles"
        ogType="website"
      />
      <div className="bg-primary text-primary-foreground">
        <Hero
          title="Guides & Articles"
          subtitle="Practical guides on flower delivery, flower subscriptions, occasion planning, and choosing the right florist-led service."
          imageSrc={deliveryImage1280}
          srcSet={srcSet}
          imageAlt="A florist delivering a bouquet of flowers."
        />

        <div className="bg-[var(--color4)]">
          <div className="container mx-auto px-4 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col border border-black/10 rounded-lg p-6 hover:border-[var(--colorgreen)] hover:shadow-sm transition-all duration-200 bg-white"
                >
                  <p className="text-[var(--colorgreen)] text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                    Guide
                  </p>
                  <h2 className="text-lg font-semibold text-black group-hover:text-[var(--colorgreen)] transition-colors duration-200 mb-3 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-black/70 leading-relaxed mb-5 flex-1">
                    {article.description}
                  </p>
                  <span className="text-sm font-medium text-[var(--colorgreen)]">
                    Read guide -&gt;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogExplorePage;
