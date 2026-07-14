export interface HowItWorksStep {
  title: string;
  text: string;
  image: {
    src: string;
    srcSet: string;
    alt: string;
  };
}

interface HowItWorksSectionProps {
  kicker?: string;
  heading: string;
  steps: HowItWorksStep[];
}

export const HowItWorksSection = ({
  kicker = 'How it works',
  heading,
  steps,
}: HowItWorksSectionProps) => {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
            {kicker}
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
            {heading}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ title, text, image }, index) => (
            <div key={title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black">
                <img
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(max-width: 639px) 100vw, 33vw"
                  alt={image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-4xl font-bold leading-none text-white font-playfair-display">{index + 1}</p>
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold font-playfair-display">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
