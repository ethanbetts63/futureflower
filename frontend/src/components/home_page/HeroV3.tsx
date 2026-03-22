
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { HeroV2Props } from '../../types/HeroV2Props';
import flowerIcon from '../../assets/flower_symbol.svg';
import subscriptionIcon from '../../assets/subscription_symbol.svg';
import deliveryIcon from '../../assets/delivery_symbol.svg';
import Badge from '../Badge';

export const HeroV3 = ({ title, subtext, image }: HeroV2Props) => {
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
    <section className="relative w-full overflow-hidden" style={{ minHeight: 'clamp(560px, 85vh, 820px)' }}>

      {/* Solid colour fill for the left panel */}
      <div className="absolute inset-0" style={{ background: 'hsl(353,100%,95%)' }} />

      {/* Image panel — starts at 38% from the left */}
      <picture className="absolute top-0 bottom-0 right-0" style={{ left: '38%' }}>
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
          sizes="62vw"
          alt={image.alt}
          fetchPriority="high"
          className="w-full h-full object-cover object-left"
        />
      </picture>

      {/* Feather where colour meets the image — starts exactly at the image edge */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: '38%',
          width: '25%',
          background: 'linear-gradient(to right, hsl(353,100%,95%), transparent)',
        }}
      />

      {/* Mobile-only bottom scrim so text remains readable when image is behind */}
      <div
        className="absolute inset-0 pointer-events-none md:hidden"
        style={{
          background:
            'linear-gradient(to top, hsl(353,100%,95%) 0%, hsl(353,100%,95%,0.92) 40%, transparent 80%)',
        }}
      />

      {/* Content — anchored bottom-left on mobile, centered-left on desktop */}
      <div className="relative z-10 flex flex-col justify-end md:justify-center h-full px-6 sm:px-10 md:px-14 lg:px-20 pb-10 md:pb-0 pt-[55%] md:pt-0" style={{ minHeight: 'inherit' }}>
        <div className="max-w-[480px]">

          {/* Eyebrow label */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-block h-px w-8"
              style={{ background: 'var(--colorgreen)' }}
            />
            <span
              className="text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: 'black' }}
            >
              Flower Delivery & Subscriptions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
            style={{ color: 'black' }}
          >
            {title}
          </h1>

          {/* Subtext */}
          <p
            className="mt-4 text-base sm:text-lg leading-relaxed"
            style={{ color: 'black' }}
          >
            {subtext}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
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
                <span className="block text-xs font-normal leading-tight mt-0.5" style={{ color: 'black' }}>Recurring deliveries</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Free Delivery badge */}
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
        className="hidden md:block absolute bottom-10 right-10 z-20"
      />

    </section>
  );
};
