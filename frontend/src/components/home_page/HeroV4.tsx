
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HeroV2Props } from '../../types/HeroV2Props';
import flowerIcon from '../../assets/flower_symbol.svg';
import subscriptionIcon from '../../assets/subscription_symbol.svg';
import deliveryIcon from '../../assets/delivery_symbol.svg';
import Badge from '../Badge';

export const HeroV4 = ({ title, subtext, image }: HeroV2Props) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNav = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/create-account?next=${path}`);
    }
  };

  const content = (
    <div className="max-w-[480px] text-center">

      {/* Eyebrow label */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="inline-block h-px w-6 bg-black/30" />
        <span className="text-xs font-bold tracking-[0.18em] uppercase text-black">
          Flower Delivery & Subscriptions
        </span>
        <span className="inline-block h-px w-6 bg-black/30" />
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-black">
        {title}
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-base sm:text-lg leading-relaxed text-black">
        {subtext}
      </p>

      {/* CTAs */}
      <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => handleNav('/event-gate/single-delivery')}
          className="flex items-center gap-3.5 font-semibold px-5 py-4 rounded-2xl transition-all cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]"
          style={{ background: 'var(--colorgreen)', color: 'black' }}
        >
          <span
            className="flex items-center justify-center rounded-xl p-1.5 shrink-0"
            style={{ background: 'hsl(143,70%,44%)' }}
          >
            <img src={flowerIcon} alt="" className="h-6 w-6" />
          </span>
          <div className="text-left">
            <span className="block text-[15px] font-bold leading-tight">Send Flowers</span>
            <span className="block text-xs font-normal opacity-70 leading-tight mt-0.5">One-time delivery</span>
          </div>
        </button>

        <button
          onClick={() => handleNav('/event-gate/subscription')}
          className="flex items-center gap-3.5 font-semibold px-5 py-4 rounded-2xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background: 'hsla(353,100%,99%,0.88)',
            backdropFilter: 'blur(8px)',
            color: 'black',
            border: '1.5px solid hsl(347,80%,84%)',
            boxShadow: '0 2px 12px hsla(347,60%,70%,0.2)',
          }}
        >
          <span
            className="flex items-center justify-center rounded-xl p-1.5 shrink-0"
            style={{ background: 'hsl(347,100%,93%)' }}
          >
            <img src={subscriptionIcon} alt="" className="h-6 w-6" />
          </span>
          <div className="text-left">
            <span className="block text-[15px] font-bold leading-tight">Subscribe</span>
            <span className="block text-xs font-normal leading-tight mt-0.5 text-black">Recurring deliveries</span>
          </div>
        </button>
      </div>

    </div>
  );

  return (
    <section className="w-full">

      {/* ── MOBILE: stacked layout ── */}
      <div className="md:hidden flex flex-col">
        <picture className="block w-full">
          {image.mobileSrcSet && (
            <source media="(max-width: 767px)" srcSet={image.mobileSrcSet} sizes="100vw" />
          )}
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="100vw"
            alt={image.alt}
            fetchPriority="high"
            className="w-full h-72 sm:h-96 object-cover object-right"
          />
        </picture>
        <div className="px-6 py-10" style={{ background: 'hsl(353,70%,97%)' }}>
          {content}
        </div>
      </div>

      {/* ── DESKTOP: sharp split ── */}
      <div
        className="hidden md:flex relative overflow-hidden"
        style={{ minHeight: 'clamp(560px, 85vh, 820px)' }}
      >
        {/* Solid colour panel — left side */}
        <div className="shrink-0 w-1/2 flex flex-col justify-center items-center px-10 md:px-14 lg:px-20" style={{ background: 'hsl(353,70%,97%)' }}>
          {content}
        </div>

        {/* Image panel — right side, fills remaining space */}
        <div className="flex-1 relative">
          <picture className="absolute inset-0">
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 52vw, 46vw"
              alt={image.alt}
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
          </picture>

          {/* Free Delivery badge */}
          <Badge
            title="Free Delivery"
            subtext="Included on all products"
            symbol={
              <img
                src={deliveryIcon}
                alt=""
                className="h-7 w-7 animate-bounce"
                style={{ animationDuration: '2s' }}
              />
            }
            className="absolute bottom-10 right-10 z-20"
          />
        </div>
      </div>

    </section>
  );
};
