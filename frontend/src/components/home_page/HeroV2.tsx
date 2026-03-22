
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
    <section className="w-full flex flex-col md:flex-row md:min-h-[600px] md:max-h-[800px]">

      {/* Content — below image on mobile, left column on desktop */}
      <div className="flex flex-col justify-center px-8 sm:px-12 py-12 bg-[var(--color4)] md:w-[45%] order-2 md:order-1">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black">
          {title}
        </h1>

        <h2 className="mt-4 text-base sm:text-lg text-black">
          {subtext}
        </h2>

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
              <img src={subscriptionIcon} alt="" className="h-8 w-8" />
              <div className="text-left">
                <span className="block text-base">Flower Subscriptions</span>
                <span className="block text-xs font-normal text-gray-500">Recurring flowers for every date that matters</span>
              </div>
            </div>
            <svg className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </div>

      {/* Image — on top on mobile, right column on desktop */}
      <div className="relative md:w-[55%] order-1 md:order-2 overflow-hidden">
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
            sizes="(min-width: 768px) 55vw, 100vw"
            alt={image.alt}
            fetchPriority="high"
            className="w-full h-72 sm:h-96 md:h-full object-cover"
          />
        </picture>

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
          className="hidden md:block absolute bottom-10 left-10"
        />
      </div>

    </section>
  );
};
