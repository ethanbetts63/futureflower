
const quietPoints = [
  {
    title: 'Your flowers, your call',
    text: 'No recipes, no stem counts. Design from whatever\'s in the bucket today.',
  },
  {
    title: 'We take the flak',
    text: 'Bad reviews land on us, not your shop.',
  },
  {
    title: 'No lock-in',
    text: 'Every order is optional. Stop any time — there\'s nothing to cancel.',
  },
];

export const SoWhatsTheCatchSection = () => {
  return (
    <section className="bg-white py-14 sm:py-20 text-black">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
              The honest bit
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight font-playfair-display sm:text-4xl">
              So what&rsquo;s the catch?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-black/65">
              The catch is that the customer orders through us. They pay on our site, and we keep the order history. That&rsquo;s how we make our money.
            </p>

            <h3 className="mt-8 text-2xl font-bold leading-snug font-playfair-display sm:text-3xl">
              But it&rsquo;s <em>your</em> logo the customer sees.
            </h3>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-black/65">
              Every delivery goes out under your name — your wrapping, your card, your brand. A great bouquet doesn&rsquo;t always earn us a loyal customer, becuase it could earn <strong className="text-black">you </strong> one instead. If they skip us and walk into your shop next time, that&rsquo;s fine by us.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end lg:pr-8" aria-hidden="true">
            <div className="relative">
              <svg
                className="absolute -top-14 left-1/2 -translate-x-1/2"
                width="80"
                height="64"
                viewBox="0 0 80 64"
                fill="none"
              >
                <path
                  d="M40 62 C 36 40, 24 28, 12 6 M40 62 C 44 38, 58 24, 70 4"
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="w-64 rotate-3 rounded-xl bg-[#fbfaf7] p-6 pt-8 text-center shadow-lg shadow-black/10 ring-1 ring-black/5 transition-transform duration-300 hover:rotate-1 motion-reduce:transition-none">
                <span className="absolute left-1/2 top-3 h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow-inner ring-1 ring-black/15" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/40">
                  Designed &amp; delivered by
                </p>
                <div className="my-4 rounded-lg border-2 border-dashed border-black/20 py-7">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-black/35">
                    Your logo
                  </p>
                </div>
                <p className="text-sm italic text-black/45 font-playfair-display">
                  Not ours. Ever.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-black/10 border-t border-black/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {quietPoints.map(({ title, text }) => (
            <div key={title} className="py-6 md:px-7 md:first:pl-0">
              <h4 className="text-base font-bold">{title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-black/60">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
