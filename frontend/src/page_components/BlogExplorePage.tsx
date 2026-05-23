import Link from 'next/link';
import Seo from '../components/Seo';
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
        <section className="w-full">
          <div className="md:hidden">
            <div className="w-full h-48 overflow-hidden">
              <img
                src={assetSrc(deliveryImage1280)}
                srcSet={srcSet}
                sizes="100vw"
                alt=""
                className="w-full h-full object-cover object-center"
                fetchPriority="high"
              />
            </div>
            <div className="bg-black px-6 py-4">
              <h1 className="text-2xl font-black text-white leading-tight">Guides & Articles</h1>
              <p className="text-stone-200 text-sm mt-1 leading-relaxed">
                Practical guides on flower delivery, flower subscriptions, occasion planning, and choosing the right florist-led service.
              </p>
            </div>
          </div>

          <div className="hidden md:block relative w-full h-64 overflow-hidden">
            <img
              src={assetSrc(deliveryImage1280)}
              srcSet={srcSet}
              sizes="100vw"
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              fetchPriority="high"
            />
            <div className="absolute inset-0 flex items-end justify-center p-10 pb-8">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 max-w-xl text-center">
                <h1 className="text-3xl font-black text-white leading-tight">Guides & Articles</h1>
                <p className="text-stone-200 text-sm mt-1 leading-relaxed">
                  Practical guides on flower delivery, flower subscriptions, occasion planning, and choosing the right florist-led service.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[var(--color4)]">
          <div className="container mx-auto px-4 lg:px-8 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group flex flex-col border border-black/10 rounded-lg p-6 hover:border-amber-400 hover:shadow-sm transition-all duration-200 bg-white"
                >
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-3">
                    Guide
                  </p>
                  <h2 className="text-lg font-semibold text-black group-hover:text-amber-500 transition-colors duration-200 mb-3 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-black/70 leading-relaxed mb-5 flex-1">
                    {article.description}
                  </p>
                  <span className="text-sm font-medium text-amber-500">
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
