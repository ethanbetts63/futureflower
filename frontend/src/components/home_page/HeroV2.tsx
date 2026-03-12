
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HeroV2Props } from '../../types/HeroV2Props';
import flowerIcon from '../../assets/flower_symbol.svg';
import subscriptionIcon from '../../assets/subscription_symbol.svg';
import deliveryIcon from '../../assets/delivery_symbol.svg';
import Badge from '../Badge';

export const HeroV2 = ({ title, subtext, image }: HeroV2Props) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNav = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/create-account?next=${path}`);
    }
  };

  return (
    <section className="w-full md:relative md:h-screen md:flex md:items-center">

      {/* Image — in normal flow on mobile, fills section absolutely on desktop */}
      <div className="w-full md:absolute md:inset-0">
        <picture className="block w-full h-full">
          {image.mobileSrcSet && (
            <source
              media="(max-width: 767px)"
              srcSet={image.mobileSrcSet}
              sizes="100vw"
            />
          )}
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="100vw"
            alt={image.alt}
            fetchPriority="high"
            className="w-full h-80 sm:h-96 object-cover md:h-full"
          />
        </picture>
      </div>

      {/* Badge — only visible on desktop where it overlays the image */}
      <Badge
        title="Free Delivery"
        subtext="Included on all products"
        symbol={
          <img
            src={deliveryIcon}
            alt=""
            className="h-5 w-5 md:h-7 md:w-7 animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        }
        className="hidden md:block absolute top-12 right-12"
      />

      {/* Content — below image on mobile, overlaid on desktop */}
      <div className="relative w-full md:ml-24 md:w-3/7 lg:w-2/5 bg-[var(--color4)] md:bg-black/70 p-8 sm:p-12 md:rounded-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black md:text-white">
          {title}
        </h1>
        <h2 className="mt-4 text-base sm:text-lg text-black md:text-white">
          {subtext}
        </h2>

        {/* Two primary CTAs */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={() => handleNav('/event-gate/single-delivery')}
            className="w-full flex items-center justify-between bg-[var(--colorgreen)] text-black font-semibold px-6 py-4 rounded-lg hover:brightness-110 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-4">
              <img src={flowerIcon} alt="" className="h-8 w-8" />
              <div className="text-left">
                <span className="block text-base">Send Flowers</span>
                <span className="block text-xs font-normal text-black/60">One-time delivery for a specific date</span>
              </div>
            </div>
            <svg className="h-5 w-5 text-black/40 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>

          <button
            onClick={() => handleNav('/event-gate/subscription')}
            className="w-full flex items-center justify-between bg-white text-black font-semibold px-6 py-4 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <img src={subscriptionIcon} alt="" className="h-8 w-8" />
              </div>
              <div className="text-left">
                <span className="block text-base">Flower Subscriptions</span>
                <span className="block text-xs font-normal text-gray-500">Recurring flowers for every date that matters</span>
              </div>
            </div>
            <svg className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};
