const featurePoints = [
  {
    level: 1,
    symbol: '🗓️',
    title: 'You decide once.',
    description: 'Choose the dates, budget, and how long you want this to last. Then optionally attach meaningful messages to be sent with each delivery.',
  },
  {
    level: 2,
    symbol: '🔒',
    title: 'Lock it in.',
    description: 'We create a long-term plan and store every future delivery in our system. Payment can be upfront or subscription based depending on your preference.',
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
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-primary-foreground mb-2">The <span className= "font-bold italic underline">ForeverFlower</span> System</h2>
        <p className="text-lg text-primary-foreground text-center mb-8">
            Never forget an important occasion again. Set up your flower deliveries once, and we'll handle the rest.
        </p>
        <div className="flex flex-wrap justify-center gap-6 pb-4">
          {featurePoints.map((item) => (
            <div key={item.level} className="flex-shrink-0 w-80 bg-white border rounded-xl shadow-md p-6 transform transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <span className="text-xl font-bold text-black">{item.level}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.symbol} {item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
