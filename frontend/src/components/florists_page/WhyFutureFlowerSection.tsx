
export const WhyFutureFlowerSection = () => {
  return (
    <section className="bg-[var(--color4)] py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Customers come to us with an occasion, a budget, and their preferences — not a catalog picture to copy. We pass that brief to a florist near the delivery address. If that's you, you decide whether to take it.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            There's no recipe to follow and no stock to hold for us. You design what suits the brief from the flowers you actually have, deliver it yourself, and put <strong>your own name on it</strong>. We handle the customer, the payment, and the admin.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            And it's <strong>completely free to join</strong>. No fees, no contracts, no minimums.
          </p>

          {/* Sample order brief */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-800 font-semibold mb-2 text-lg">
              What an order looks like.
            </p>
            <p className="text-gray-600 mb-6">
              A typical brief, sent straight to your phone:
            </p>
            <dl className="flex flex-col gap-3 text-gray-700">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500 text-sm uppercase tracking-wide pt-0.5">Occasion</dt>
                <dd>Birthday — for their mum</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500 text-sm uppercase tracking-wide pt-0.5">Budget</dt>
                <dd>$90 + delivery, fully paid</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500 text-sm uppercase tracking-wide pt-0.5">Preferences</dt>
                <dd className="italic">"Loves pink and soft pastels. No lilies — allergies."</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-gray-500 text-sm uppercase tracking-wide pt-0.5">Delivery</dt>
                <dd>Friday, 12 June — address and card message included</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
