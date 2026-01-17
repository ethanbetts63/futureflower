const featurePoints = [
  {
    level: 1,
    symbol: '🗓️',
    title: 'You decide once.',
    description: 'Choose the dates, budget and frequency. Then optionally attach meaningful messages to be sent with each delivery. Finally, give us your preferences on bouquet composition and color.',
  },
  {
    level: 2,
    symbol: '🔒',
    title: 'Lock it in.',
    description: 'We create a long-term plan and store every future delivery in our system. Payment can be upfront or subscription based depending on your preference. Recieve up to a 38% discount for upfront payment.',
  },
  {
    level: 3,
    symbol: '✨',
    title: 'It just happens.',
    description: 'Every year, on time, we arrange the flowers — no risk of forgetting, no effort. Our expertise is reliability and arrangement. We partner with companies that deliver high quality flowers for the rest.',
  }
];

export const ProductCarousel = () => {
  return (
    <div className="w-full py-6">
      <div className="container mx-auto px-4 pt-2">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">Our Process: <span className="italic">simple, reliable, unique</span>.</h2>
        <div className="flex flex-wrap justify-center gap-6 pb-4">
          {featurePoints.map((item) => (
            <div key={item.level} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md p-6 transform transition-transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[var(--color2)] rounded-full mr-4">
                  <span className="text-xl font-bold text-black">{item.level}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.symbol} {item.title}</h3>
              </div>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
