import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import deliveryImage from '../assets/delivery.webp';
import deliveryImage320 from '../assets/delivery-320w.webp';
import deliveryImage640 from '../assets/delivery-640w.webp';
import deliveryImage768 from '../assets/delivery-768w.webp';
import deliveryImage1024 from '../assets/delivery-1024w.webp';
import deliveryImage1280 from '../assets/delivery-1280w.webp';
import floristImage from '../assets/florist.webp';
import floristImage320 from '../assets/florist-320w.webp';
import floristImage640 from '../assets/florist-640w.webp';
import floristImage768 from '../assets/florist-768w.webp';
import floristImage1024 from '../assets/florist-1024w.webp';
import floristImage1280 from '../assets/florist-1280w.webp';
import kitchenImage from '../assets/kitchen.webp';
import kitchenImage320 from '../assets/kitchen-320w.webp';
import kitchenImage640 from '../assets/kitchen-640w.webp';
import kitchenImage768 from '../assets/kitchen-768w.webp';
import kitchenImage1024 from '../assets/kitchen-1024w.webp';
import kitchenImage1280 from '../assets/kitchen-1280w.webp';

const articles = [
  {
    title: 'The Best Flower Subscription Services in the United States (2026 Guide)',
    imageSrc: deliveryImage,
    srcSet: `${deliveryImage320} 320w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`,
    link: '/articles/best-flower-subscription-services-us',
    alt: 'A guide to the best flower subscription services in the US'
  },
  {
    title: 'The Best Flower Subscription Services in Australia (2026 Guide)',
    imageSrc: floristImage,
    srcSet: `${floristImage320} 320w, ${floristImage640} 640w, ${floristImage768} 768w, ${floristImage1024} 1024w, ${floristImage1280} 1280w`,
    link: '/articles/best-flower-subscription-services-au',
    alt: 'A guide to the best flower subscription services in Australia'
  },
  {
    title: 'The Best Flower Subscription Services in the United Kingdom (2026 Guide)',
    imageSrc: kitchenImage,
    srcSet: `${kitchenImage320} 320w, ${kitchenImage640} 640w, ${kitchenImage768} 768w, ${kitchenImage1024} 1024w, ${kitchenImage1280} 1280w`,
    link: '/articles/best-flower-subscription-services-uk',
    alt: 'A guide to the best flower subscription services in the UK'
  },
  {
    title: 'The Best Flower Subscription Services in Europe (2026 Guide)',
    imageSrc: floristImage,
    srcSet: `${floristImage320} 320w, ${floristImage640} 640w, ${floristImage768} 768w, ${floristImage1024} 1024w, ${floristImage1280} 1280w`,
    link: '/articles/best-flower-subscription-services-eu',
    alt: 'A guide to the best flower subscription services in Europe'
  },
  {
    title: 'The Best Flower Subscription Services in New Zealand (2026 Guide)',
    imageSrc: deliveryImage,
    srcSet: `${deliveryImage320} 320w, ${deliveryImage640} 640w, ${deliveryImage768} 768w, ${deliveryImage1024} 1024w, ${deliveryImage1280} 1280w`,
    link: '/articles/best-flower-subscription-services-nz',
    alt: 'A guide to the best flower subscription services in New Zealand'
  },
  {
    title: 'The Best Flower Delivery Services in Perth (2026 Guide)',
    imageSrc: kitchenImage,
    srcSet: `${kitchenImage320} 320w, ${kitchenImage640} 640w, ${kitchenImage768} 768w, ${kitchenImage1024} 1024w, ${kitchenImage1280} 1280w`,
    link: '/articles/best-flower-delivery-perth',
    alt: 'A guide to the best flower delivery services in Perth'
  }
];

interface ArticleCarouselProps {
  exclude?: string;
  showAll?: boolean;
}

export const ArticleCarousel: React.FC<ArticleCarouselProps> = ({ exclude, showAll = false }) => {
  let filteredArticles = articles.filter(article => article.link !== exclude);

  const articlesToShow = showAll ? filteredArticles : filteredArticles.slice(0, 3);

  if (articlesToShow.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-primary-foreground mb-2">From the ForeverFlower Blog</h2>
        <p className="text-lg text-primary-foreground text-center mb-8">
          Insights and guides for long-term floral planning.
        </p>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {articlesToShow.map((article) => (
            <Link to={article.link} key={article.link} className="flex-shrink-0 w-80 h-48 group">
              <div 
                className="relative w-full h-full bg-cover bg-center rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1"
              >
                <img 
                  src={article.imageSrc} 
                  srcSet={article.srcSet}
                  alt={article.alt}
                  className="absolute inset-0 w-full h-full object-cover"
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
            <Link to="/articles" className="flex-shrink-0 w-80 h-48 group">
              <div className="relative w-full h-full bg-secondary rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1">
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center text-secondary-foreground">
                  <h3 className="text-2xl font-semibold">See more blog posts</h3>
                  <ArrowRight className="w-8 h-8 mt-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
