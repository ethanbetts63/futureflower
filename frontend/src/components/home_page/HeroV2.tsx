
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HeroV2Props } from '../../types/HeroV2Props';
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
      <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-14 bg-white md:w-[45%] order-2 md:order-1">

        <p className="text-xs font-bold tracking-widest uppercase text-black/40 mb-4">
          Fresh flower delivery
        </p>

        <h1 className="font-['Playfair_Display',_serif] text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-black leading-tight">
          {title}
        </h1>

        <p className="mt-5 text-base text-black/60 leading-relaxed max-w-sm">
          {subtext}
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <button
            onClick={() => handleNav('/event-gate/single-delivery')}
            className="w-full bg-black text-white font-bold px-8 py-4 text-xs tracking-widest uppercase hover:bg-black/80 transition-colors cursor-pointer text-left flex items-center justify-between group"
          >
            <span>Send Flowers</span>
            <span className="text-white/40 font-normal normal-case tracking-normal text-xs group-hover:text-white/70 transition-colors">One-time delivery</span>
          </button>
          <button
            onClick={() => handleNav('/event-gate/subscription')}
            className="w-full border border-black text-black font-bold px-8 py-4 text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors cursor-pointer text-left flex items-center justify-between group"
          >
            <span>Flower Subscriptions</span>
            <span className="text-black/40 font-normal normal-case tracking-normal text-xs group-hover:text-white/60 transition-colors">Recurring deliveries</span>
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
