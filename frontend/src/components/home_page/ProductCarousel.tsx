import petalImage from '../../assets/petal.png';
import floristMakingFlowersImage from '../../assets/florist_making_flowers.png';
import deliveryHighImage from '../../assets/delivery_high.png';

const steps = [
  {
    level: 1,
    title: 'Choose the Vibe.',
    description:
      'Birthday. Romantic. Sympathy. Celebration. Just because. We design around the moment.',
    image: petalImage,
  },
  {
    level: 2,
    title: 'Choose the Impact.',
    description:
      'A thoughtful gesture. A classic arrangement. A statement piece. You set the budget — we use all of it on the flowers.',
    image: floristMakingFlowersImage,
  },
  {
    level: 3,
    title: 'We handle the rest.',
    description:
      'A local florist creates something unique and beautiful. No catalog copies. No warehouse stock. Just real floristry.',
    image: deliveryHighImage,
  },
];

export const ProductCarousel = () => {
  return (
    <div className="w-full pt-6 pb-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black font-['Playfair_Display',_serif] tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Meaningful flowers on meaningful dates, minus the effort. One
            decision, no hassle.
          </p>
        </div>

        {/* Cards */}
        <div className="flex gap-6 lg:gap-8 overflow-x-auto pt-2 pb-4 snap-x snap-mandatory scrollbar-hide max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.level}
              className="group bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 flex-shrink-0 w-80 md:w-auto md:flex-1 snap-start"
            >
              {/* Image with numbered badge */}
              <div className="relative">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-52 md:h-56 lg:h-64 object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center w-11 h-11 bg-black text-white text-lg font-bold rounded-md shadow-lg">
                  {step.level}
                </span>
              </div>

              {/* Text content */}
              <div className="pt-9 pb-7 px-6 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-['Playfair_Display',_serif]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
