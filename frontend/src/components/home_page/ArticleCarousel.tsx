import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import floristImage from '../../assets/florist.webp';
import delivery1Image from '../../assets/delivery1.webp';
import floristPackingImage from '../../assets/florist_packing.webp';
import floristPacking2Image from '../../assets/florist_packing2.webp';
import type { ArticleCarouselProps } from '../../types/ArticleCarouselProps';

const articles = [
  {
    title: 'The Best Flower Subscription Services in Australia (2026 Guide)',
    imageSrc: floristImage,
    link: '/articles/best-flower-subscription-services-au',
    alt: 'A guide to the best flower subscription services in Australia'
  },
  {
    title: 'The Best Flower Delivery Services in Perth (2026 Guide)',
    imageSrc: floristPackingImage,
    link: '/articles/best-flower-delivery-perth',
    alt: 'A guide to the best flower delivery services in Perth'
  },
  {
    title: 'The Best Flower Delivery Services in Sydney (2026 Guide)',
    imageSrc: delivery1Image,
    link: '/articles/best-flower-delivery-sydney',
    alt: 'A guide to the best flower delivery services in Sydney'
  },
  {
    title: 'The Best Flower Delivery Services in Adelaide (2026 Guide)',
    imageSrc: floristPackingImage,
    link: '/articles/best-flower-delivery-adelaide',
    alt: 'A guide to the best flower delivery services in Adelaide'
  },
  {
    title: 'The Best Flower Delivery Services in Darwin (2026 Guide)',
    imageSrc: floristPackingImage,
    link: '/articles/best-flower-delivery-darwin',
    alt: 'A guide to the best flower delivery services in Darwin'
  },
  {
    title: 'The Best Flower Delivery Services in Melbourne (2026 Guide)',
    imageSrc: floristPackingImage,
    link: '/articles/best-flower-delivery-melbourne',
    alt: 'A guide to the best flower delivery services in Melbourne'
  }
];



export const ArticleCarousel = ({ exclude, showAll = false }: ArticleCarouselProps) => {
  const filteredArticles = articles.filter(article => article.link !== exclude);

  const articlesToShow = showAll ? filteredArticles : filteredArticles.slice(0, 3);

  if (articlesToShow.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-primary-foreground mb-2">From the FutureFlower Blog</h2>
        <p className="text-lg text-primary-foreground text-center mb-8">
          Insights and guides for long-term floral planning.
        </p>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {articlesToShow.map((article) => (
            <Link href={article.link} key={article.link} className="flex-shrink-0 w-80 h-48 group">
              <div 
                className="relative w-full h-full bg-cover bg-center rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1"
              >
                <Image
                  src={article.imageSrc}
                  alt={article.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.3vw"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-center h-full p-6">
                  <h3 className="text-2xl font-semibold text-center text-white">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
          {!showAll && filteredArticles.length > 3 && (
            <Link href="/articles" className="flex-shrink-0 w-80 h-48 group">
              <div className="relative w-full h-full bg-[var(--color4)] rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1">
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center text-secondary-foreground">
                  <h3 className="text-2xl text-black font-semibold">See more blog posts</h3>
                  <ArrowRight className="w-8 h-8 mt-2 group-hover:translate-x-2 transition-transform text-black" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
