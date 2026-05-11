export type LandingPageContent = {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  ctaHref: string;
  ctaLabel: string;
};

export type ArticleContent = {
  slug: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
};

export const landingPages: Record<string, LandingPageContent> = {
  "/pricing": {
    path: "/pricing",
    eyebrow: "Transparent Flower Delivery Pricing",
    title: "More flowers. Fewer fees.",
    intro:
      "Choose a budget, set your dates, and let local florists design around the occasion instead of forcing them into rigid catalog recipes.",
    ctaHref: "/order",
    ctaLabel: "Choose a Plan",
    sections: [
      {
        title: "Simple budget tiers",
        body:
          "FutureFlower keeps pricing understandable: choose the impact you want, add the recipient details and delivery date, and we coordinate the florist. The budget goes toward a thoughtful arrangement rather than platform bloat.",
      },
      {
        title: "Free delivery",
        body:
          "Delivery is included. That keeps the decision focused on the bouquet, the date, and the message instead of surprise checkout fees.",
      },
      {
        title: "Designed by florists",
        body:
          "Florists are not asked to copy a stock image stem-for-stem. They receive your occasion, preferences, and budget, then build something fresh from what is best locally and seasonally available.",
      },
    ],
  },
  "/florists": {
    path: "/florists",
    eyebrow: "FutureFlower for Florists",
    title: "Grow delivery revenue without adding admin.",
    intro:
      "FutureFlower sends scheduled flower orders to local florists with clear customer preferences, budgets, delivery details, and acceptance controls.",
    ctaHref: "/partner/register",
    ctaLabel: "Become a Partner",
    sections: [
      {
        title: "Orders with context",
        body:
          "Every request is built around the occasion, budget, message, recipient, and delivery timing. That gives florists room to design properly rather than copy a generic marketplace photo.",
      },
      {
        title: "No setup fees",
        body:
          "Florists can use FutureFlower without monthly platform fees. The model is designed to make future-dated and recurring orders easier to accept.",
      },
      {
        title: "Accept or reject requests",
        body:
          "When an order comes through, you can decide whether it fits your availability and delivery area. The workflow is built around practical florist operations.",
      },
    ],
  },
  "/affiliates": {
    path: "/affiliates",
    eyebrow: "FutureFlower Affiliates",
    title: "Earn by sharing a better way to send flowers.",
    intro:
      "Help your audience schedule thoughtful flower deliveries and subscriptions while earning from referred orders.",
    ctaHref: "/partner/register/referral",
    ctaLabel: "Join the Affiliate Program",
    sections: [
      {
        title: "Easy to explain",
        body:
          "FutureFlower is built around a simple promise: pick a date, pick a budget, and local florists handle the rest.",
      },
      {
        title: "Built for repeat moments",
        body:
          "Birthdays, anniversaries, Mother's Day, Valentine's Day, and recurring deliveries all create natural opportunities to recommend the service.",
      },
      {
        title: "Supports local florists",
        body:
          "Customers get fresh arrangements from real florists, and affiliates can promote a product with a clear local-business angle.",
      },
    ],
  },
  "/birthday-flower-delivery": {
    path: "/birthday-flower-delivery",
    eyebrow: "Birthday Flower Delivery",
    title: "Fresh birthday flowers, scheduled ahead.",
    intro:
      "Pick the birthday date, set your budget, and a local florist creates a custom arrangement for the day.",
    ctaHref: "/order",
    ctaLabel: "Schedule Birthday Flowers",
    sections: [
      {
        title: "Never miss the date",
        body:
          "Birthday flowers can be planned in advance so the gesture is ready before the week gets busy.",
      },
      {
        title: "Designed for the recipient",
        body:
          "Add preferences, colours, and notes so the florist can create something that fits the person rather than a generic catalog slot.",
      },
      {
        title: "Local florist delivery",
        body:
          "Orders are coordinated through florists who understand fresh flowers, delivery timing, and occasion-specific arrangements.",
      },
    ],
  },
  "/valentines-day-flower-delivery": {
    path: "/valentines-day-flower-delivery",
    eyebrow: "Valentine's Day Flower Delivery",
    title: "Plan Valentine's Day flowers before the rush.",
    intro:
      "Schedule Valentine's Day flowers ahead of time and let a local florist design around your message, preferences, and budget.",
    ctaHref: "/order",
    ctaLabel: "Schedule Valentine's Flowers",
    sections: [
      {
        title: "Avoid last-minute panic",
        body:
          "February 14 is one of the busiest days in floristry. Scheduling early gives the order a better chance of being thoughtful and reliable.",
      },
      {
        title: "More personal than a catalog",
        body:
          "Share the tone of the gesture and the recipient's preferences so the arrangement feels intentional.",
      },
      {
        title: "Free delivery included",
        body:
          "The price is focused on the flowers and service, with delivery included rather than added as a surprise later.",
      },
    ],
  },
  "/mothers-day-flower-delivery": {
    path: "/mothers-day-flower-delivery",
    eyebrow: "Mother's Day Flower Delivery",
    title: "Mother's Day flowers, handled early.",
    intro:
      "Schedule Mother's Day flowers in advance and give a local florist the context to create something warm, fresh, and personal.",
    ctaHref: "/order",
    ctaLabel: "Schedule Mother's Day Flowers",
    sections: [
      {
        title: "Plan before the peak",
        body:
          "Mother's Day demand is high. FutureFlower helps you lock in the date and details early.",
      },
      {
        title: "Add a message once",
        body:
          "Include a note and bouquet preferences so the delivery feels considered rather than rushed.",
      },
      {
        title: "A repeatable tradition",
        body:
          "Subscriptions make it possible to schedule important annual gestures without recreating the order every year.",
      },
    ],
  },
  "/flower-delivery-perth": {
    path: "/flower-delivery-perth",
    eyebrow: "Flower Delivery Perth",
    title: "Fresh flower delivery in Perth from local florists.",
    intro:
      "FutureFlower helps Perth customers schedule one-time bouquets and flower subscriptions with local florist fulfilment.",
    ctaHref: "/order",
    ctaLabel: "Order Perth Flowers",
    sections: [
      {
        title: "Local Perth delivery",
        body:
          "Orders are built around real delivery details, timing, and florist availability across the Perth area.",
      },
      {
        title: "One-time or recurring",
        body:
          "Send a single bouquet for a specific date, or set up recurring deliveries for the moments that matter every year.",
      },
      {
        title: "Florist choice design",
        body:
          "Local florists can use fresh, seasonal stems that fit your preferences and budget instead of being forced into fixed catalog designs.",
      },
    ],
  },
};

export const articles: ArticleContent[] = [
  {
    slug: "best-flower-subscription-services-us",
    title: "The Best Flower Subscription Services in the United States (2026 Guide)",
    description:
      "An in-depth guide to the best flower subscription services in the US, broken down by best overall, cheapest, and highest quality.",
    sections: [
      {
        title: "Best overall",
        body:
          "The best overall subscription balances delivery reliability, arrangement quality, flexible scheduling, and a customer experience that does not make repeat gifting feel like admin.",
      },
      {
        title: "Best value",
        body:
          "Budget-conscious buyers should compare the delivered bouquet value, delivery fees, subscription flexibility, and how easy it is to pause or cancel.",
      },
      {
        title: "Best quality",
        body:
          "Premium subscriptions usually win on stem quality, arrangement design, packaging, and the ability to make each delivery feel distinct.",
      },
    ],
  },
  {
    slug: "best-flower-subscription-services-au",
    title: "The Best Flower Subscription Services in Australia (2026 Guide)",
    description:
      "An in-depth guide to the best flower subscription services in Australia, broken down by best overall, cheapest, and highest quality.",
    sections: [
      {
        title: "What matters in Australia",
        body:
          "Australian flower subscriptions need to account for city coverage, climate, delivery windows, florist availability, and regional differences in fresh flower supply.",
      },
      {
        title: "Best overall",
        body:
          "The strongest services make recurring flowers easy to manage while still giving florists room to design arrangements around seasonality.",
      },
      {
        title: "Best value",
        body:
          "The best value option is not just the cheapest headline price; it is the service that sends more of the budget into the arrangement.",
      },
    ],
  },
  {
    slug: "best-flower-subscription-services-uk",
    title: "The Best Flower Subscription Services in the United Kingdom (2026 Guide)",
    description:
      "An in-depth guide to the best flower subscription services in the UK, broken down by best overall, cheapest, and highest quality.",
    sections: [
      {
        title: "UK subscription considerations",
        body:
          "The UK market has strong national flower brands, but buyers should still compare freshness, delivery consistency, and whether bouquets feel personal.",
      },
      {
        title: "Best overall",
        body:
          "Look for subscriptions that combine reliable logistics with enough design flexibility to avoid repetitive deliveries.",
      },
      {
        title: "Best for meaningful dates",
        body:
          "For birthdays and anniversaries, scheduling accuracy and message handling matter as much as stem count.",
      },
    ],
  },
  {
    slug: "best-flower-subscription-services-eu",
    title: "The Best Flower Subscription Services in Europe (2026 Guide)",
    description:
      "A guide to the best flower subscription services in Europe, covering overall experience, budget options, and high-quality bouquets.",
    sections: [
      {
        title: "European coverage",
        body:
          "Flower subscription quality across Europe depends heavily on local fulfilment, delivery partners, and the ability to adapt to country-specific logistics.",
      },
      {
        title: "Best overall",
        body:
          "The best services keep ordering simple while preserving the strengths of local floristry.",
      },
      {
        title: "Best premium experience",
        body:
          "Premium buyers should look for freshness, presentation, customer support, and clear delivery communication.",
      },
    ],
  },
  {
    slug: "best-flower-subscription-services-nz",
    title: "The Best Flower Subscription Services in New Zealand (2026 Guide)",
    description:
      "An in-depth guide to the best flower subscription services in NZ, broken down by best overall, cheapest, and highest quality.",
    sections: [
      {
        title: "New Zealand delivery coverage",
        body:
          "In New Zealand, reliable subscription flowers depend on local coverage and realistic delivery timing across cities and regions.",
      },
      {
        title: "Best overall",
        body:
          "The best overall service offers simple scheduling, good florist coordination, and arrangements that feel fresh rather than generic.",
      },
      {
        title: "Best value",
        body:
          "Compare what arrives at the door, not just the advertised plan price.",
      },
    ],
  },
  {
    slug: "best-flower-delivery-perth",
    title: "The Best Flower Delivery Services in Perth (2026 Guide)",
    description:
      "An in-depth guide to the best flower delivery services in Perth, broken down by best overall, fastest, and most affordable.",
    sections: [
      {
        title: "Best overall flower delivery in Perth",
        body:
          "The best Perth flower delivery service should combine fresh local arrangements, clear delivery windows, and enough flexibility for birthdays, sympathy, romance, and everyday gifting.",
      },
      {
        title: "Fastest delivery",
        body:
          "Same-day delivery can be useful, but reliability depends on cut-off times, florist capacity, and the destination suburb.",
      },
      {
        title: "Best value",
        body:
          "A strong value service keeps delivery transparent and puts more of the customer's budget into the flowers.",
      },
    ],
  },
  {
    slug: "best-flower-delivery-sydney",
    title: "The Best Flower Delivery Services in Sydney (2026 Guide)",
    description:
      "An in-depth guide to the best flower delivery services in Sydney, organized by best overall, fastest delivery, and most affordable.",
    sections: [
      {
        title: "Best overall flower delivery in Sydney",
        body:
          "Sydney buyers should compare florist coverage, delivery speed, bouquet quality, and whether the service can handle specific occasion details.",
      },
      {
        title: "Fastest delivery",
        body:
          "Fast delivery is only valuable when the bouquet still arrives fresh and suitable for the occasion.",
      },
      {
        title: "Best affordable option",
        body:
          "Affordable flower delivery should keep fees visible and avoid shrinking the actual bouquet value.",
      },
    ],
  },
  {
    slug: "best-flower-delivery-adelaide",
    title: "The Best Flower Delivery Services in Adelaide (2026 Guide)",
    description:
      "A complete look at the top flower delivery services in Adelaide, tailored for quality, speed, and price.",
    sections: [
      {
        title: "Best overall flower delivery in Adelaide",
        body:
          "The best Adelaide services balance fresh florist-made bouquets with dependable delivery and practical ordering cut-offs.",
      },
      {
        title: "Best for speed",
        body:
          "Fast Adelaide delivery depends on the florist's daily capacity, suburb coverage, and when the order is placed.",
      },
      {
        title: "Best for thoughtful gifting",
        body:
          "For meaningful occasions, choose a service that captures the message, preferences, and recipient details clearly.",
      },
    ],
  },
  {
    slug: "best-flower-delivery-darwin",
    title: "The Best Flower Delivery Services in Darwin (2026 Guide)",
    description:
      "A complete guide to the top flower delivery services serving Darwin, broken down by best overall, fastest delivery, and most affordable options.",
    sections: [
      {
        title: "Best overall flower delivery in Darwin",
        body:
          "Darwin flower delivery needs to account for climate, local florist coverage, and realistic timing for fresh arrangements.",
      },
      {
        title: "Fastest delivery",
        body:
          "Same-day options are useful when available, but freshness and communication are still the core quality signals.",
      },
      {
        title: "Best value",
        body:
          "The best value comes from clear fees, strong florist execution, and bouquets designed around the recipient.",
      },
    ],
  },
  {
    slug: "best-flower-delivery-melbourne",
    title: "The Best Flower Delivery Services in Melbourne (2026 Guide)",
    description:
      "A comprehensive guide to the top flower delivery services in Melbourne, broken down by best overall, fastest delivery, and most affordable options.",
    sections: [
      {
        title: "Best overall flower delivery in Melbourne",
        body:
          "Melbourne has a deep florist market, so the best services stand out through freshness, reliable delivery, and thoughtful arrangement design.",
      },
      {
        title: "Fastest delivery",
        body:
          "Speed depends on cut-off times and suburb coverage, but a fast order should still feel polished when it arrives.",
      },
      {
        title: "Best affordable option",
        body:
          "Affordable does not have to mean thin. Look for services that keep platform and delivery costs from overwhelming the flower budget.",
      },
    ],
  },
];

export const articleMap = Object.fromEntries(
  articles.map((article) => [article.slug, article]),
);
